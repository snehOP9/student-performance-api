import os
from pathlib import Path
from urllib.parse import urlparse

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field
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
from .models import User
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

app = FastAPI(title='Student Performance Predictor API')


ROOT_DIR = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT_DIR / 'artifacts'
MODEL_PATH = ARTIFACTS_DIR / 'lgbm_model.joblib'
FEATURES_PATH = ARTIFACTS_DIR / 'feature_columns.joblib'
QHAT_PATH = ARTIFACTS_DIR / 'conformal_qhat.joblib'
COHORT_SOURCE_PATH = ROOT_DIR / 'student_performance_synth_400k.csv'

RISK_LOW_THRESHOLD = 0.35
RISK_HIGH_THRESHOLD = 0.65
DEFAULT_FRONTEND_ORIGINS = [
    'https://student-performance-predictor-pro-w.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
FEATURE_BOUNDS = {
    'study_hours_sum': (0.0, 120.0),
    'study_hours_mean': (0.0, 12.0),
    'clicks_sum': (0.0, 2500.0),
    'resources_sum': (0.0, 600.0),
    'forum_posts_sum': (0.0, 180.0),
    'attendance_mean': (0.0, 1.0),
    'sleep_mean': (2.0, 10.0),
    'study_habits_index_mean': (0.0, 100.0),
    'consistency_score_mean': (0.0, 100.0),
    'cramming_indicator_mean': (0.0, 1.0),
    'age': (14.0, 30.0),
    'internet_access': (0.0, 1.0),
    'tutoring': (0.0, 1.0),
}
OPTIMIZATION_ACTIONS = {
    'study_hours_sum': [5.0, 10.0],
    'attendance_mean': [0.03, 0.05],
    'sleep_mean': [0.25, 0.5],
    'study_habits_index_mean': [3.0, 5.0],
    'consistency_score_mean': [3.0, 5.0],
    'resources_sum': [10.0, 20.0],
    'forum_posts_sum': [2.0, 4.0],
    'cramming_indicator_mean': [-0.05, -0.10],
}
FEATURE_LABELS = {
    'study_hours_sum': 'study volume',
    'study_hours_mean': 'daily study rhythm',
    'clicks_sum': 'platform engagement',
    'resources_sum': 'learning resource usage',
    'forum_posts_sum': 'support-seeking activity',
    'attendance_mean': 'attendance consistency',
    'sleep_mean': 'sleep recovery',
    'study_habits_index_mean': 'study habits quality',
    'consistency_score_mean': 'consistency score',
    'cramming_indicator_mean': 'cramming intensity',
    'age': 'age calibration',
}
FRACTIONAL_FEATURES = {'attendance_mean', 'cramming_indicator_mean'}
BINARY_FLAGS = {
    'gender_F',
    'gender_M',
    'gender_Other',
    'socio_econ_low',
    'socio_econ_middle',
    'socio_econ_high',
    'school_type_public',
    'school_type_private',
    'parent_education_none',
    'parent_education_primary',
    'parent_education_secondary',
    'parent_education_bachelor',
    'parent_education_master_',
    'internet_access',
    'tutoring',
}
POPULATION_SAMPLE_SIZE = 1000
API_ENDPOINTS = [
    '/',
    '/healthz',
    '/predict',
    '/uncertainty',
    '/recommend',
    '/explain',
    '/interactions',
    '/simulate',
    '/simulate-2d',
    '/predict/batch',
    '/compare',
    '/cohort-stats',
    '/feature-importance',
    '/model-info',
    '/optimize',
    '/stress-test',
]


def parse_frontend_origins() -> list[str]:
    raw = os.getenv('FRONTEND_ORIGINS', '').strip()
    frontend_base_url = os.getenv('FRONTEND_BASE_URL', '').strip()

    merged_origins = list(DEFAULT_FRONTEND_ORIGINS)
    if frontend_base_url:
        parsed_frontend = urlparse(frontend_base_url)
        if parsed_frontend.scheme and parsed_frontend.netloc:
            merged_origins.append(f'{parsed_frontend.scheme}://{parsed_frontend.netloc}')

    if not raw:
        return list(dict.fromkeys(merged_origins))
    if raw == '*':
        return ['*']

    merged_origins.extend(origin.strip() for origin in raw.split(',') if origin.strip())
    return list(dict.fromkeys(merged_origins))


ALLOWED_ORIGINS = parse_frontend_origins()


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials='*' not in ALLOWED_ORIGINS,
    allow_methods=['*'],
    allow_headers=['*'],
)


model = None
FEATURE_COLUMNS = []
qhat = None
explainer = None
cohort_source = None
artifact_load_error: str | None = None
explainer_load_error: str | None = None
model_backend = 'unloaded'


@app.on_event('startup')
def load_artifacts() -> None:
    global artifact_load_error, explainer_load_error, model_backend, model, FEATURE_COLUMNS, qhat, explainer
    init_db()
    try:
        FEATURE_COLUMNS = joblib.load(FEATURES_PATH)
        qhat = float(joblib.load(QHAT_PATH))
        artifact_load_error = None
        explainer_load_error = None

        try:
            model = joblib.load(MODEL_PATH)
            model_backend = 'lightgbm'
            try:
                import shap

                explainer = shap.TreeExplainer(model)
            except Exception as exc:  # pragma: no cover - optional explainability dependency
                explainer = None
                explainer_load_error = str(exc)
        except Exception as model_exc:  # pragma: no cover - managed deploy fallback
            from .pure_model import GeneratedRiskModel

            model = GeneratedRiskModel()
            model_backend = 'generated'
            explainer = None
            explainer_load_error = (
                'Using generated predictor without SHAP explainability: '
                f'{model_exc}'
            )
    except Exception as exc:  # pragma: no cover - startup resilience for managed deploys
        model = None
        FEATURE_COLUMNS = []
        qhat = None
        explainer = None
        artifact_load_error = str(exc)
        explainer_load_error = None
        model_backend = 'unloaded'


def assert_model_ready() -> None:
    if model is None or qhat is None or not FEATURE_COLUMNS:
        detail = 'Model artifacts are not loaded'
        if artifact_load_error:
            detail = f'{detail}: {artifact_load_error}'
        raise HTTPException(status_code=503, detail=detail)


def assert_explainer_ready() -> None:
    assert_model_ready()
    if explainer is None:
        detail = 'Feature explainability is temporarily unavailable'
        if explainer_load_error:
            detail = f'{detail}: {explainer_load_error}'
        raise HTTPException(status_code=503, detail=detail)


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def format_feature_name(feature: str) -> str:
    return FEATURE_LABELS.get(feature, feature.replace('_', ' '))


def format_feature_value(feature: str, value: float) -> str:
    if feature in FRACTIONAL_FEATURES:
        return f'{value * 100:.1f}%'
    if feature == 'sleep_mean':
        return f'{value:.1f}h'
    if feature == 'age':
        return str(int(round(value)))
    return f'{value:.1f}'


def format_delta(feature: str, delta: float) -> str:
    if feature in FRACTIONAL_FEATURES:
        return f'{delta * 100:+.1f}%'
    if feature == 'sleep_mean':
        return f'{delta:+.1f}h'
    return f'{delta:+.1f}'


def normalize_feature_value(feature: str, value: float) -> float:
    normalized = float(value)
    if feature in FRACTIONAL_FEATURES and normalized > 1:
        normalized /= 100
    if feature in FEATURE_BOUNDS:
        lower, upper = FEATURE_BOUNDS[feature]
        normalized = clamp(normalized, lower, upper)
    return normalized


class StudentInput(BaseModel):
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
    tutoring: int = 0


class BatchPredictRequest(BaseModel):
    students: list[StudentInput] = Field(min_length=1, max_length=500)


class SimulationRequest(BaseModel):
    student: StudentInput
    feature: str
    min_val: float
    max_val: float
    steps: int = Field(default=25, ge=2, le=200)


class Simulation2DRequest(BaseModel):
    student: StudentInput
    feature_x: str
    feature_y: str
    x_min: float
    x_max: float
    y_min: float
    y_max: float
    steps: int = Field(default=18, ge=2, le=60)


class CompareRequest(BaseModel):
    student_a: StudentInput
    student_b: StudentInput


class OptimizeRequest(BaseModel):
    student: StudentInput
    budget: int = Field(default=3, ge=1, le=10)


class StressTestRequest(BaseModel):
    student: StudentInput
    noise_level: float = Field(default=0.05, ge=0.0, le=0.5)
    n_samples: int = Field(default=200, ge=10, le=2000)


def normalize_student_payload(student: StudentInput) -> dict[str, float | int]:
    payload = student.model_dump()
    for feature in FEATURE_BOUNDS:
        if feature in payload:
            payload[feature] = normalize_feature_value(feature, payload[feature])

    payload['age'] = int(round(payload['age']))
    for feature in BINARY_FLAGS:
        payload[feature] = int(bool(payload.get(feature, 0)))
    return payload


def to_model_df(student: StudentInput) -> pd.DataFrame:
    df = pd.DataFrame([normalize_student_payload(student)])
    for column in FEATURE_COLUMNS:
        if column not in df.columns:
            df[column] = 0
    return df[FEATURE_COLUMNS]


def predict_probability_from_df(X: pd.DataFrame) -> float:
    return float(model.predict_proba(X)[0, 1])


def classify_risk(probability: float) -> str:
    if probability < RISK_LOW_THRESHOLD:
        return 'Low'
    if probability < RISK_HIGH_THRESHOLD:
        return 'Moderate'
    return 'High'


def get_expected_value() -> float:
    assert_explainer_ready()
    expected_value = explainer.expected_value
    if isinstance(expected_value, list):
        expected_value = expected_value[-1]
    if isinstance(expected_value, np.ndarray):
        expected_value = expected_value.reshape(-1)[-1]
    return float(expected_value)


def get_shap_values(X: pd.DataFrame) -> np.ndarray:
    assert_explainer_ready()
    values = explainer.shap_values(X)
    if isinstance(values, list):
        values = values[-1]
    values = np.asarray(values)
    if values.ndim == 1:
        values = values.reshape(1, -1)
    if values.ndim == 3:
        values = values[:, :, -1]
    return values


def build_top_features(X: pd.DataFrame, limit: int = 5) -> list[dict[str, float | str]]:
    shap_values = get_shap_values(X)[0]
    row = X.iloc[0]
    top_indices = np.argsort(np.abs(shap_values))[::-1][:limit]
    top_features: list[dict[str, float | str]] = []

    for index in top_indices:
        feature = X.columns[index]
        shap_value = float(shap_values[index])
        raw_value = float(row.iloc[index])
        top_features.append(
            {
                'feature': feature,
                'label': format_feature_name(feature).title(),
                'value': raw_value,
                'display_value': format_feature_value(feature, raw_value),
                'shap_value': shap_value,
                'direction': 'increase' if shap_value > 0 else 'decrease',
            }
        )

    return top_features


def build_fallback_top_features(X: pd.DataFrame, limit: int = 5) -> list[dict[str, float | str]]:
    row = X.iloc[0]
    importance = getattr(model, 'feature_importances_', None)
    if importance is None:
        importance = np.ones(len(X.columns), dtype=float)

    importance = np.asarray(importance, dtype=float)
    top_indices = np.argsort(importance)[::-1][:limit]
    top_features: list[dict[str, float | str]] = []

    for index in top_indices:
        feature = X.columns[index]
        raw_value = float(row.iloc[index])
        top_features.append(
            {
                'feature': feature,
                'label': format_feature_name(feature).title(),
                'value': raw_value,
                'display_value': format_feature_value(feature, raw_value),
                'shap_value': 0.0,
                'direction': 'context',
                'importance_gain': float(importance[index]),
            }
        )

    return top_features


def build_explanation_lines(top_features: list[dict[str, float | str]]) -> list[str]:
    if not top_features:
        return ['Risk drivers are not available for the current prediction.']

    lines: list[str] = []
    for feature in top_features[:3]:
        label = str(feature['label'])
        display_value = str(feature['display_value'])
        shap_value = float(feature['shap_value'])
        direction = 'raising' if shap_value > 0 else 'lowering'
        intensity = 'strongly' if abs(shap_value) >= 0.05 else 'slightly'
        lines.append(f'{label} at {display_value} is {intensity} {direction} projected risk.')

    return lines


def build_fallback_explanation_lines(
    probability: float,
    top_features: list[dict[str, float | str]],
) -> list[str]:
    risk_band = classify_risk(probability)
    summary = f'The model forecasts a {risk_band.lower()} risk profile at {probability * 100:.1f}%.'

    if not top_features:
        return [summary, 'Detailed driver explanations are temporarily unavailable in this deployment.']

    lead_features = ', '.join(
        f"{feature['label']} ({feature['display_value']})" for feature in top_features[:3]
    )
    return [
        summary,
        f'Key signals used in this forecast include {lead_features}.',
        'Detailed SHAP explanations are temporarily unavailable in this deployment.',
    ]


def build_prediction_payload(student: StudentInput) -> dict[str, object]:
    X = to_model_df(student)
    probability = predict_probability_from_df(X)
    if explainer is not None:
        top_features = build_top_features(X)
        explanation = build_explanation_lines(top_features)
        base_value: float | None = round(get_expected_value(), 6)
    else:
        top_features = build_fallback_top_features(X)
        explanation = build_fallback_explanation_lines(probability, top_features)
        base_value = None

    return {
        'risk_probability': round(probability, 4),
        'risk_percentage': round(probability * 100, 1),
        'risk_band': classify_risk(probability),
        'explanation': explanation,
        'explanation_summary': explanation[0],
        'top_features': top_features,
        'base_value': base_value,
        'explainer_available': explainer is not None,
    }


def build_uncertainty_payload(probability: float) -> dict[str, object]:
    include_1 = (1 - probability) <= qhat
    include_0 = probability <= qhat

    if include_0 and include_1:
        prediction_set = '{0,1}'
        uncertainty_level = 'uncertain_need_more_data'
    elif include_1:
        prediction_set = '{1}'
        uncertainty_level = 'confident_high_risk'
    else:
        prediction_set = '{0}'
        uncertainty_level = 'confident_low_risk'

    confidence = clamp(max(probability, 1 - probability), 0.51, 0.99)
    if prediction_set == '{0,1}':
        confidence = min(confidence, 0.64)

    uncertainty = clamp(1 - confidence, 0.01, 0.49)
    return {
        'risk_probability': round(probability, 4),
        'risk_percentage': round(probability * 100, 1),
        'risk_band': classify_risk(probability),
        'prediction_set': prediction_set,
        'uncertainty_level': uncertainty_level,
        'confidence': round(confidence, 4),
        'uncertainty': round(uncertainty, 4),
    }


def score_candidate_feature_change(
    X: pd.DataFrame,
    feature: str,
    delta: float,
    base_probability: float,
) -> dict[str, object] | None:
    if feature not in X.columns:
        return None

    candidate = X.copy()
    current_value = float(candidate.at[0, feature])
    updated_value = normalize_feature_value(feature, current_value + delta)
    if updated_value == current_value:
        return None

    candidate.at[0, feature] = updated_value
    new_probability = predict_probability_from_df(candidate)
    reduction = base_probability - new_probability
    if reduction <= 0:
        return None

    impact = 'High impact' if reduction >= 0.08 else 'Quick win' if reduction >= 0.04 else 'Long-term'
    feature_name = format_feature_name(feature).title()
    return {
        'feature': feature,
        'change': format_delta(feature, delta),
        'new_value': round(updated_value, 4),
        'risk_before': round(base_probability, 4),
        'risk_after': round(new_probability, 4),
        'risk_reduction': round(reduction, 4),
        'title': f'Improve {feature_name}',
        'description': (
            f'Adjust {feature_name.lower()} from {format_feature_value(feature, current_value)} '
            f'to {format_feature_value(feature, updated_value)}.'
        ),
        'impact': impact,
        'expectedReduction': round(reduction * 100, 1),
    }


def build_recommendations(student: StudentInput) -> tuple[float, list[dict[str, object]]]:
    X = to_model_df(student)
    base_probability = predict_probability_from_df(X)
    recommendations: list[dict[str, object]] = []

    for feature, deltas in OPTIMIZATION_ACTIONS.items():
        for delta in deltas:
            candidate = score_candidate_feature_change(X, feature, delta, base_probability)
            if candidate:
                recommendations.append(candidate)

    recommendations.sort(key=lambda item: float(item['risk_reduction']), reverse=True)
    return base_probability, recommendations[:5]


def require_feature(feature: str) -> None:
    if feature not in FEATURE_COLUMNS or feature not in FEATURE_BOUNDS:
        raise HTTPException(status_code=400, detail=f'Unsupported feature: {feature}')


def get_interaction_values(X: pd.DataFrame) -> np.ndarray:
    assert_explainer_ready()
    interaction_values = explainer.shap_interaction_values(X)
    if isinstance(interaction_values, list):
        interaction_values = interaction_values[-1]
    interaction_values = np.asarray(interaction_values)
    if interaction_values.ndim == 4:
        interaction_values = interaction_values[:, :, :, -1]
    if interaction_values.ndim == 2:
        interaction_values = interaction_values.reshape(1, *interaction_values.shape)
    return interaction_values


def load_cohort_reference() -> dict[str, object]:
    global cohort_source
    if cohort_source is not None:
        return cohort_source

    if not COHORT_SOURCE_PATH.exists():
        raise HTTPException(status_code=503, detail='Population reference data is unavailable')

    sample = pd.read_csv(COHORT_SOURCE_PATH)
    if len(sample) > POPULATION_SAMPLE_SIZE:
        sample = sample.sample(POPULATION_SAMPLE_SIZE, random_state=42)

    gender = sample.get('gender', pd.Series(['M'] * len(sample))).astype(str).str.lower()
    socio = sample.get('socio_econ', pd.Series(['middle'] * len(sample))).astype(str).str.lower()
    school_type = sample.get('school_type', pd.Series(['public'] * len(sample))).astype(str).str.lower()
    parent_education = sample.get('parent_education', pd.Series(['secondary'] * len(sample))).astype(str).str.lower()

    mapped = pd.DataFrame(
        {
            'study_hours_sum': sample['study_hours_week'].astype(float),
            'study_hours_mean': (sample['study_hours_week'].astype(float) / 7).round(4),
            'clicks_sum': sample['clicks_week'].astype(float),
            'resources_sum': sample['resources_visited'].astype(float),
            'forum_posts_sum': sample['forum_posts'].astype(float),
            'attendance_mean': sample['attendance_rate'].astype(float),
            'sleep_mean': sample['sleep_hours'].astype(float),
            'study_habits_index_mean': sample['study_habits_index'].astype(float),
            'consistency_score_mean': sample['consistency_score'].astype(float),
            'cramming_indicator_mean': sample['cramming_indicator'].astype(float),
            'age': sample['age'].astype(int),
            'gender_F': (gender == 'f').astype(int),
            'gender_M': (gender == 'm').astype(int),
            'gender_Other': (~gender.isin(['f', 'm'])).astype(int),
            'socio_econ_low': (socio == 'low').astype(int),
            'socio_econ_middle': (socio == 'middle').astype(int),
            'socio_econ_high': (socio == 'high').astype(int),
            'school_type_public': (school_type == 'public').astype(int),
            'school_type_private': (school_type == 'private').astype(int),
            'parent_education_none': (parent_education == 'none').astype(int),
            'parent_education_primary': (parent_education == 'primary').astype(int),
            'parent_education_secondary': (parent_education == 'secondary').astype(int),
            'parent_education_bachelor': (parent_education == 'bachelor').astype(int),
            'parent_education_master_': parent_education.isin(['master', 'master_']).astype(int),
            'internet_access': sample.get('internet_access', pd.Series([1] * len(sample))).astype(int),
            'tutoring': sample.get('tutoring', pd.Series([0] * len(sample))).astype(int),
        }
    )

    for feature in FEATURE_BOUNDS:
        if feature in mapped.columns:
            mapped[feature] = mapped[feature].apply(lambda value: normalize_feature_value(feature, value))

    for column in FEATURE_COLUMNS:
        if column not in mapped.columns:
            mapped[column] = 0

    mapped = mapped[FEATURE_COLUMNS]
    risks = model.predict_proba(mapped)[:, 1]
    cohort_source = {'frame': mapped, 'risks': risks}
    return cohort_source


@app.get('/')
def health():
    return {
        'status': 'ok',
        'model_loaded': model is not None,
        'features_loaded': bool(FEATURE_COLUMNS),
        'explainer_loaded': explainer is not None,
        'model_backend': model_backend,
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
    return setup_2fa(current_user)


@app.post('/auth/2fa/enable')
def two_fa_enable(
    payload: Enable2FARequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enable_2fa(db, current_user, payload.setup_token, payload.code)
    return {'status': 'ok', 'message': '2FA enabled'}


@app.post('/auth/2fa/disable')
def two_fa_disable(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    disable_2fa(db, current_user)
    return {'status': 'ok', 'message': '2FA disabled'}


@app.get('/healthz')
def healthz():
    assert_model_ready()
    return {'status': 'ok'}


@app.post('/predict')
def predict(student: StudentInput):
    assert_model_ready()
    return build_prediction_payload(student)


@app.post('/uncertainty')
def uncertainty(student: StudentInput):
    assert_model_ready()
    probability = predict_probability_from_df(to_model_df(student))
    return build_uncertainty_payload(probability)


@app.post('/recommend')
def recommend(student: StudentInput):
    assert_model_ready()
    baseline, recommendations = build_recommendations(student)
    return {
        'baseline_risk': round(baseline, 4),
        'baseline_risk_percentage': round(baseline * 100, 1),
        'recommendations': recommendations,
    }


@app.post('/explain')
def explain(student: StudentInput):
    assert_model_ready()
    prediction = build_prediction_payload(student)
    return {
        'risk_probability': prediction['risk_probability'],
        'risk_percentage': prediction['risk_percentage'],
        'base_value': prediction['base_value'],
        'top_features': prediction['top_features'],
        'explanation': prediction['explanation'],
        'explainer_available': prediction['explainer_available'],
    }


@app.post('/interactions')
def interactions(student: StudentInput):
    assert_explainer_ready()
    X = to_model_df(student)
    interaction_values = get_interaction_values(X)[0]
    pairs: list[dict[str, object]] = []

    for index_a, feature_a in enumerate(FEATURE_COLUMNS):
        for index_b in range(index_a + 1, len(FEATURE_COLUMNS)):
            strength = float(interaction_values[index_a, index_b])
            pairs.append(
                {
                    'feature_a': feature_a,
                    'feature_b': FEATURE_COLUMNS[index_b],
                    'interaction_strength': round(strength, 6),
                }
            )

    pairs.sort(key=lambda item: abs(float(item['interaction_strength'])), reverse=True)
    return {'top_interactions': pairs[:25]}


@app.post('/simulate')
def simulate(request: SimulationRequest):
    assert_model_ready()
    require_feature(request.feature)

    raw_values = np.linspace(request.min_val, request.max_val, request.steps)
    base_payload = request.student.model_dump()
    base_risk = predict_probability_from_df(to_model_df(request.student))
    risks: list[float] = []

    for raw_value in raw_values:
        candidate_payload = {**base_payload, request.feature: float(raw_value)}
        probability = predict_probability_from_df(to_model_df(StudentInput(**candidate_payload)))
        risks.append(round(probability, 4))

    return {
        'feature': request.feature,
        'sweep_values': [round(float(value), 4) for value in raw_values],
        'risk_values': risks,
        'current_value': round(float(base_payload[request.feature]), 4),
        'current_risk': round(base_risk, 4),
    }


@app.post('/simulate-2d')
def simulate_2d(request: Simulation2DRequest):
    assert_model_ready()
    require_feature(request.feature_x)
    require_feature(request.feature_y)

    base_payload = request.student.model_dump()
    x_values = np.linspace(request.x_min, request.x_max, request.steps)
    y_values = np.linspace(request.y_min, request.y_max, request.steps)
    risk_grid: list[list[float]] = []

    for y_value in y_values:
        row: list[float] = []
        for x_value in x_values:
            candidate_payload = {
                **base_payload,
                request.feature_x: float(x_value),
                request.feature_y: float(y_value),
            }
            probability = predict_probability_from_df(to_model_df(StudentInput(**candidate_payload)))
            row.append(round(probability, 4))
        risk_grid.append(row)

    return {
        'feature_x': request.feature_x,
        'feature_y': request.feature_y,
        'x_values': [round(float(value), 4) for value in x_values],
        'y_values': [round(float(value), 4) for value in y_values],
        'risk_grid': risk_grid,
        'current_x': round(float(base_payload[request.feature_x]), 4),
        'current_y': round(float(base_payload[request.feature_y]), 4),
    }


@app.post('/predict/batch')
def predict_batch(request: BatchPredictRequest):
    assert_model_ready()
    predictions: list[dict[str, object]] = []
    low_risk_count = 0
    medium_risk_count = 0
    high_risk_count = 0

    for student in request.students:
        probability = predict_probability_from_df(to_model_df(student))
        risk_band = classify_risk(probability)
        uncertainty_payload = build_uncertainty_payload(probability)
        predictions.append(
            {
                'risk_probability': round(probability, 4),
                'risk_percentage': round(probability * 100, 1),
                'risk_band': risk_band,
                'prediction_set': uncertainty_payload['prediction_set'],
                'uncertainty_level': uncertainty_payload['uncertainty_level'],
                'confidence': uncertainty_payload['confidence'],
                'uncertainty': uncertainty_payload['uncertainty'],
            }
        )

        if risk_band == 'Low':
            low_risk_count += 1
        elif risk_band == 'Moderate':
            medium_risk_count += 1
        else:
            high_risk_count += 1

    return {
        'predictions': predictions,
        'summary': {
            'count': len(predictions),
            'low_risk_count': low_risk_count,
            'medium_risk_count': medium_risk_count,
            'high_risk_count': high_risk_count,
        },
    }


@app.post('/compare')
def compare(request: CompareRequest):
    assert_explainer_ready()
    X_a = to_model_df(request.student_a)
    X_b = to_model_df(request.student_b)
    risk_a = predict_probability_from_df(X_a)
    risk_b = predict_probability_from_df(X_b)
    shap_a = get_shap_values(X_a)[0]
    shap_b = get_shap_values(X_b)[0]
    top_differences: list[dict[str, object]] = []

    for index, feature in enumerate(FEATURE_COLUMNS):
        shap_diff = float(shap_b[index] - shap_a[index])
        top_differences.append({'feature': feature, 'shap_diff': round(shap_diff, 6)})

    top_differences.sort(key=lambda item: abs(float(item['shap_diff'])), reverse=True)
    return {
        'risk_a': round(risk_a, 4),
        'risk_b': round(risk_b, 4),
        'risk_diff': round(risk_b - risk_a, 4),
        'top_differences': top_differences[:12],
    }


@app.post('/cohort-stats')
def cohort_stats(student: StudentInput):
    assert_model_ready()
    reference = load_cohort_reference()
    population_risks = np.asarray(reference['risks'], dtype=float)
    student_risk = predict_probability_from_df(to_model_df(student))
    percentile = float((population_risks <= student_risk).mean() * 100)

    return {
        'student_risk': round(student_risk, 4),
        'percentile': round(percentile, 2),
        'population_mean': round(float(population_risks.mean()), 4),
        'population_std': round(float(population_risks.std(ddof=0)), 4),
        'population_bins': {
            'low': int((population_risks < RISK_LOW_THRESHOLD).sum()),
            'medium': int(((population_risks >= RISK_LOW_THRESHOLD) & (population_risks < RISK_HIGH_THRESHOLD)).sum()),
            'high': int((population_risks >= RISK_HIGH_THRESHOLD).sum()),
        },
        'population_histogram': [round(float(risk), 4) for risk in population_risks.tolist()],
    }


@app.get('/feature-importance')
def feature_importance():
    assert_model_ready()
    importance = getattr(model, 'feature_importances_', None)
    if importance is None:
        raise HTTPException(status_code=503, detail='Feature importance is unavailable')

    rows = [
        {'feature': feature, 'importance_gain': float(score)}
        for feature, score in zip(FEATURE_COLUMNS, importance, strict=True)
    ]
    rows.sort(key=lambda item: item['importance_gain'], reverse=True)
    return {'feature_importance': rows}


@app.get('/model-info')
def model_info():
    assert_model_ready()
    estimator_count = int(getattr(model, 'n_estimators_', getattr(model, 'n_estimators', 0)))
    feature_count = int(getattr(model, 'n_features_in_', len(FEATURE_COLUMNS)))
    return {
        'model_type': type(model).__name__,
        'model_backend': model_backend,
        'n_estimators': estimator_count,
        'n_features': feature_count,
        'conformal_qhat': round(float(qhat), 6),
        'explainer_loaded': explainer is not None,
        'endpoints': API_ENDPOINTS,
    }


@app.post('/optimize')
def optimize(request: OptimizeRequest):
    assert_model_ready()
    current = to_model_df(request.student)
    baseline = predict_probability_from_df(current)
    steps: list[dict[str, object]] = []

    for _ in range(request.budget):
        current_probability = predict_probability_from_df(current)
        best_step: dict[str, object] | None = None

        for feature, deltas in OPTIMIZATION_ACTIONS.items():
            for delta in deltas:
                candidate = score_candidate_feature_change(current, feature, delta, current_probability)
                if not candidate:
                    continue
                if best_step is None or float(candidate['risk_reduction']) > float(best_step['risk_reduction']):
                    best_step = candidate

        if best_step is None:
            break

        target_feature = str(best_step['feature'])
        current.at[0, target_feature] = float(best_step['new_value'])
        steps.append(best_step)

    optimized = predict_probability_from_df(current)
    return {
        'baseline_risk': round(baseline, 4),
        'optimized_risk': round(optimized, 4),
        'total_reduction': round(baseline - optimized, 4),
        'steps': steps,
    }


@app.post('/stress-test')
def stress_test(request: StressTestRequest):
    assert_model_ready()
    rng = np.random.default_rng(42)
    base_payload = normalize_student_payload(request.student)
    base_risk = predict_probability_from_df(to_model_df(request.student))
    samples: list[float] = []

    for _ in range(request.n_samples):
        candidate_payload = dict(base_payload)
        for feature, (lower, upper) in FEATURE_BOUNDS.items():
            if feature in {'age', 'internet_access', 'tutoring'}:
                continue
            sigma = max((upper - lower) * request.noise_level, 1e-6)
            candidate_payload[feature] = clamp(float(rng.normal(candidate_payload[feature], sigma)), lower, upper)

        probability = predict_probability_from_df(to_model_df(StudentInput(**candidate_payload)))
        samples.append(probability)

    sample_array = np.asarray(samples, dtype=float)
    stability_score = clamp(1 - (sample_array.std(ddof=0) / 0.25), 0.0, 1.0)
    return {
        'base_risk': round(base_risk, 4),
        'stability_score': round(float(stability_score), 4),
        'mean_risk': round(float(sample_array.mean()), 4),
        'std_risk': round(float(sample_array.std(ddof=0)), 4),
        'p5': round(float(np.percentile(sample_array, 5)), 4),
        'p25': round(float(np.percentile(sample_array, 25)), 4),
        'p50': round(float(np.percentile(sample_array, 50)), 4),
        'p75': round(float(np.percentile(sample_array, 75)), 4),
        'p95': round(float(np.percentile(sample_array, 95)), 4),
        'risk_samples': [round(float(value), 4) for value in sample_array.tolist()],
    }
