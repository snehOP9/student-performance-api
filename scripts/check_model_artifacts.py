#!/usr/bin/env python3
"""Smoke-test committed ML artifacts against the installed runtime stack."""

from __future__ import annotations

import math
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "artifacts"
MODEL_PATH = ARTIFACTS / "lgbm_model.joblib"
FEATURES_PATH = ARTIFACTS / "feature_columns.joblib"
QHAT_PATH = ARTIFACTS / "conformal_qhat.joblib"


def fail(message: str) -> None:
    raise SystemExit(message)


def main() -> int:
    for path in (MODEL_PATH, FEATURES_PATH, QHAT_PATH):
        if not path.is_file():
            fail(f"Missing artifact: {path.relative_to(ROOT)}")

    feature_columns = list(joblib.load(FEATURES_PATH))
    if not feature_columns:
        fail("feature_columns.joblib is empty")
    if len(feature_columns) != len(set(feature_columns)):
        fail("feature_columns.joblib contains duplicate feature names")

    qhat = float(joblib.load(QHAT_PATH))
    if not math.isfinite(qhat) or not 0.0 <= qhat <= 1.0:
        fail(f"conformal_qhat.joblib is outside [0, 1]: {qhat!r}")

    model = joblib.load(MODEL_PATH)
    if not hasattr(model, "predict_proba"):
        fail(f"Loaded model {type(model).__name__} has no predict_proba()")

    # Use two deterministic, finite rows. This intentionally tests the model's
    # serialized feature contract and inference path without depending on the
    # application database or API startup lifecycle.
    values = np.vstack(
        [
            np.zeros(len(feature_columns), dtype=float),
            np.full(len(feature_columns), 0.5, dtype=float),
        ]
    )
    frame = pd.DataFrame(values, columns=feature_columns)
    probabilities = np.asarray(model.predict_proba(frame), dtype=float)

    if probabilities.ndim != 2 or probabilities.shape[0] != len(frame):
        fail(f"Unexpected predict_proba shape: {probabilities.shape}")
    if probabilities.shape[1] < 2:
        fail(f"Expected binary/multiclass probabilities, got shape {probabilities.shape}")
    if not np.isfinite(probabilities).all():
        fail("predict_proba returned NaN or infinite values")
    if ((probabilities < 0.0) | (probabilities > 1.0)).any():
        fail("predict_proba returned values outside [0, 1]")
    if not np.allclose(probabilities.sum(axis=1), 1.0, rtol=1e-6, atol=1e-6):
        fail("predict_proba rows do not sum to 1")

    print(
        "Artifact smoke test passed: "
        f"model={type(model).__name__}, features={len(feature_columns)}, "
        f"qhat={qhat:.6g}, output_shape={probabilities.shape}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
