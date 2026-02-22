from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware
import os

# ---- Paths (relative to project root) ----
MODEL_PATH = "artifacts/lgbm_model.joblib"
FEATURES_PATH = "artifacts/feature_columns.joblib"
QHAT_PATH = "artifacts/conformal_qhat.joblib"

# ---- Load artifacts ----
model = joblib.load(MODEL_PATH)
FEATURE_COLUMNS = joblib.load(FEATURES_PATH)
qhat = joblib.load(QHAT_PATH)

app = FastAPI(title="Student Performance Predictor API")

# ---- CORS (for browser-based frontends) ----
# You can set FRONTEND_ORIGINS as a comma-separated list, e.g.
# FRONTEND_ORIGINS="http://localhost:3000,https://your-frontend.vercel.app"
origins_env = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    df = pd.DataFrame([student.dict()])

    # add any missing columns expected by the model
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    # keep exact order
    return df[FEATURE_COLUMNS]


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(student: StudentInput):
    X = to_model_df(student)
    prob = float(model.predict_proba(X)[0, 1])
    return {"risk_probability": round(prob, 4)}


@app.post("/uncertainty")
def uncertainty(student: StudentInput):
    """
    Conformal-style set prediction using qhat.
    Returns a human-friendly uncertainty label.
    """
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
