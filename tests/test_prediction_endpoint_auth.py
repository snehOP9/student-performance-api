import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from api import main


VALID_STUDENT = {
    "study_hours_sum": 20,
    "study_hours_mean": 3,
    "clicks_sum": 100,
    "resources_sum": 20,
    "forum_posts_sum": 5,
    "attendance_mean": 0.9,
    "sleep_mean": 7,
    "study_habits_index_mean": 70,
    "consistency_score_mean": 70,
    "cramming_indicator_mean": 0.2,
    "age": 21,
}


class PredictionEndpointAuthTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        self.original_overrides = dict(main.app.dependency_overrides)
        main.app.dependency_overrides.clear()

    def tearDown(self):
        main.app.dependency_overrides.clear()
        main.app.dependency_overrides.update(self.original_overrides)

    def set_user(self, role):
        main.app.dependency_overrides[main.get_current_user] = lambda: SimpleNamespace(
            id=f"{role}-test",
            role=role,
            is_active=True,
        )

    def test_prediction_requires_authentication(self):
        response = self.client.post("/predict", json=VALID_STUDENT)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_student_can_use_personal_prediction(self):
        self.set_user("student")
        with patch.object(main, "assert_model_ready"), patch.object(
            main, "build_prediction_payload", return_value={"risk_band": "Low"}
        ):
            response = self.client.post("/predict", json=VALID_STUDENT)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["risk_band"], "Low")

    def test_student_cannot_access_staff_analytics(self):
        self.set_user("student")
        response = self.client.get("/model-info")
        self.assertEqual(response.status_code, 403)

    def test_teacher_can_access_staff_model_metadata(self):
        self.set_user("teacher")
        with patch.object(main, "assert_model_ready"), patch.object(
            main, "model", SimpleNamespace(n_estimators_=10, n_features_in_=1)
        ), patch.object(main, "FEATURE_COLUMNS", ["feature"]), patch.object(
            main, "qhat", 0.2
        ), patch.object(main, "explainer", None), patch.object(
            main, "model_backend", "lightgbm"
        ):
            response = self.client.get("/model-info")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["n_features"], 1)


if __name__ == "__main__":
    unittest.main()
