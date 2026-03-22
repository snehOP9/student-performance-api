import os
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from sqlalchemy.orm import Session

from .auth import (
    create_user,
    disable_2fa,
    enable_2fa,
    get_current_user,
    login_user,
    refresh_access_token,
    request_password_reset,
    reset_password,
    revoke_refresh_token,
    setup_2fa,
    verify_2fa_and_issue,
)
from .db import get_db, init_db
from .schemas import (
    Enable2FARequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    ResetPasswordRequest,
    SignupRequest,
    Verify2FARequest,
)
from .models import User

app = FastAPI(title="Student Performance Predictor API")


ROOT_DIR = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT_DIR / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "lgbm_model.joblib"
FEATURES_PATH = ARTIFACTS_DIR / "feature_columns.joblib"
QHAT_PATH = ARTIFACTS_DIR / "conformal_qhat.joblib"


def parse_frontend_origins() -> list[str]:
    raw = os.getenv("FRONTEND_ORIGINS", "*").strip()
    if raw == "*":
        return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_frontend_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = None
FEATURE_COLUMNS = []
qhat = None


@app.on_event("startup")
def load_artifacts() -> None:
    global model, FEATURE_COLUMNS, qhat
    init_db()
    try:
        model = joblib.load(MODEL_PATH)
        FEATURE_COLUMNS = joblib.load(FEATURES_PATH)
        qhat = float(joblib.load(QHAT_PATH))
    except FileNotFoundError as exc:
        raise RuntimeError(f"Missing model artifact: {exc.filename}") from exc


def assert_model_ready() -> None:
    if model is None or qhat is None or not FEATURE_COLUMNS:
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded")


class StudentInput(BaseModel):
    # numeric engineered features (student-level)
    study_hours_sum: float
    study_hours_mean: float
    clicks_sum: float
    resources_sum: float
    forum_posts_sum: float
    attendance_mean: float
    sleep_mean: float
    study_habits_index_mean: float
    consistency_score_mean: float
    cramming_indicator_mean: float
    age: int

    # one-hot / categorical (defaults to 0)
    gender_F: int = 0
    gender_M: int = 0
    gender_Other: int = 0

    socio_econ_low: int = 0
    socio_econ_middle: int = 0
    socio_econ_high: int = 0

    school_type_public: int = 0
    school_type_private: int = 0

    parent_education_none: int = 0
    parent_education_primary: int = 0
    parent_education_secondary: int = 0
    parent_education_bachelor: int = 0
    parent_education_master_: int = 0

    internet_access: int = 1
    tutoring: int = 0  # ✅ FIXED


def to_model_df(student: StudentInput) -> pd.DataFrame:
    """
    Convert request -> dataframe with EXACT training feature columns.
    Any missing columns are added as 0 (safe for one-hot).
    """
    df = pd.DataFrame([student.model_dump()])

    # add any missing columns expected by the model
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    # keep exact order
    return df[FEATURE_COLUMNS]


@app.get("/")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "features_loaded": bool(FEATURE_COLUMNS),
    }


@app.post('/auth/signup')
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user = create_user(db, payload.full_name, payload.email, payload.password, payload.role)
    return {
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'role': user.role,
        'two_fa_enabled': user.two_fa_enabled,
    }


@app.post('/auth/login', response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, payload.email, payload.password)


@app.post('/auth/2fa/verify', response_model=LoginResponse)
def verify_2fa(payload: Verify2FARequest, db: Session = Depends(get_db)):
    return verify_2fa_and_issue(db, payload.temp_token, payload.code)


@app.post('/auth/refresh')
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_access_token(db, payload.refresh_token)


@app.post('/auth/logout')
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    revoke_refresh_token(db, payload.refresh_token)
    return {'status': 'logged_out'}


@app.get('/auth/me')
def me(current_user: User = Depends(get_current_user)):
    return {
        'id': current_user.id,
        'full_name': current_user.full_name,
        'email': current_user.email,
        'role': current_user.role,
        'two_fa_enabled': current_user.two_fa_enabled,
    }


@app.post('/auth/forgot-password')
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    request_password_reset(db, payload.email)
    return {'status': 'ok', 'message': 'If the account exists, a reset link was sent'}


@app.post('/auth/reset-password')
def perform_reset(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_password(db, payload.token, payload.new_password)
    return {'status': 'ok', 'message': 'Password reset successful'}


@app.post('/auth/2fa/setup')
def two_fa_setup(current_user: User = Depends(get_current_user)):
    data = setup_2fa(current_user)
    return data


@app.post('/auth/2fa/enable')
def two_fa_enable(
    payload: Enable2FARequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enable_2fa(db, current_user, payload.secret, payload.code)
    return {'status': 'ok', 'message': '2FA enabled'}


@app.post('/auth/2fa/disable')
def two_fa_disable(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    disable_2fa(db, current_user)
    return {'status': 'ok', 'message': '2FA disabled'}


@app.get("/healthz")
def healthz():
    assert_model_ready()
    return {"status": "ok"}


@app.post("/predict")
def predict(student: StudentInput):
    assert_model_ready()
    X = to_model_df(student)
    prob = float(model.predict_proba(X)[0, 1])
    return {"risk_probability": round(prob, 4)}


@app.post("/uncertainty")
def uncertainty(student: StudentInput):
    """
    Conformal-style set prediction using qhat.
    Returns a human-friendly uncertainty label.
    """
    assert_model_ready()
    X = to_model_df(student)
    prob = float(model.predict_proba(X)[0, 1])

    include_1 = (1 - prob) <= qhat
    include_0 = prob <= qhat

    if include_0 and include_1:
        pred_set = "{0,1}"
        level = "uncertain_need_more_data"
    elif include_1:
        pred_set = "{1}"
        level = "confident_high_risk"
    else:
        pred_set = "{0}"
        level = "confident_low_risk"

    return {
        "risk_probability": round(prob, 4),
        "prediction_set": pred_set,
        "uncertainty_level": level
    }


@app.post("/recommend")
def recommend(student: StudentInput):
    """
    Simple counterfactual-style recommendations:
    try small safe improvements and keep those that reduce risk.
    """
    assert_model_ready()
    X = to_model_df(student)
    base = float(model.predict_proba(X)[0, 1])

    # bounded action proposals (edit as you like)
    ACTIONS = {
        "study_hours_sum": [5, 10],          # add total study hours
        "attendance_mean": [0.05, 0.10],     # +5% / +10% attendance
        "sleep_mean": [0.5, 1.0],            # +0.5 / +1 hour sleep
        "consistency_score_mean": [5, 10],   # +5 / +10 consistency points
    }

    recs = []
    for feat, deltas in ACTIONS.items():
        if feat not in X.columns:
            continue
        for d in deltas:
            X_new = X.copy()
            X_new[feat] = X_new[feat] + d
            newp = float(model.predict_proba(X_new)[0, 1])

            if newp < base:
                recs.append({
                    "feature": feat,
                    "change": f"+{d}",
                    "risk_before": round(base, 3),
                    "risk_after": round(newp, 3),
                    "risk_reduction": round(base - newp, 3),
                })

    recs = sorted(recs, key=lambda x: -x["risk_reduction"])
    return {"baseline_risk": round(base, 4), "recommendations": recs[:5]}
