import numpy as np

from .generated_model import FEATURE_IMPORTANCES, N_ESTIMATORS, N_FEATURES, score


class GeneratedRiskModel:
    feature_importances_ = np.asarray(FEATURE_IMPORTANCES, dtype=float)
    n_estimators_ = int(N_ESTIMATORS)
    n_features_in_ = int(N_FEATURES)

    def predict_proba(self, X):
        values = X.to_numpy(dtype=float) if hasattr(X, 'to_numpy') else np.asarray(X, dtype=float)
        if values.ndim == 1:
            values = values.reshape(1, -1)
        return np.asarray([score(row.tolist()) for row in values], dtype=float)
