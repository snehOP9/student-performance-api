import os
import unittest
from unittest.mock import patch

from fastapi import HTTPException

from api import main


class GeneratedModelFallbackTests(unittest.TestCase):
    def setUp(self):
        self.previous = {
            key: getattr(main, key)
            for key in (
                'model', 'FEATURE_COLUMNS', 'qhat', 'explainer',
                'artifact_load_error', 'explainer_load_error', 'model_backend'
            )
        }

    def tearDown(self):
        for key, value in self.previous.items():
            setattr(main, key, value)

    def _load_with_bad_model(self):
        def mock_load(path):
            if path == main.FEATURES_PATH:
                return ['study_hours_sum']
            if path == main.QHAT_PATH:
                return 0.5
            if path == main.MODEL_PATH:
                raise ValueError('internal model path contains private context')
            raise AssertionError(path)

        with patch.object(main, 'init_db'), patch.object(main.joblib, 'load', side_effect=mock_load):
            main.load_artifacts()

    def test_primary_model_failure_stops_predictions_by_default(self):
        with patch.dict(os.environ, {'ALLOW_GENERATED_MODEL_FALLBACK': '', 'APP_ENV': 'development'}):
            self._load_with_bad_model()

        self.assertIsNone(main.model)
        self.assertEqual(main.model_backend, 'unloaded')
        self.assertNotIn('private context', main.artifact_load_error or '')
        with self.assertRaises(HTTPException) as raised:
            main.assert_model_ready()
        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(raised.exception.detail, 'Model artifacts are not loaded')
        self.assertNotIn('private context', str(raised.exception.detail))

    def test_explicit_local_opt_in_uses_generated_model(self):
        with patch.dict(os.environ, {'ALLOW_GENERATED_MODEL_FALLBACK': 'true', 'APP_ENV': 'development'}):
            self._load_with_bad_model()

        self.assertEqual(main.model_backend, 'generated')
        self.assertIsNotNone(main.model)
        self.assertIsNone(main.explainer)
        self.assertNotIn('private context', main.explainer_load_error or '')
        main.assert_model_ready()

    def test_staging_or_production_deny_generated_fallback_even_if_enabled(self):
        for environment in ('staging', 'production'):
            with self.subTest(environment=environment):
                with patch.dict(os.environ, {
                    'ALLOW_GENERATED_MODEL_FALLBACK': 'true', 'APP_ENV': environment
                }):
                    self._load_with_bad_model()
                self.assertIsNone(main.model)
                self.assertEqual(main.model_backend, 'unloaded')
                with self.assertRaises(HTTPException):
                    main.assert_model_ready()

    def test_valid_false_values_never_enable_fallback(self):
        for value in ('false', '0', 'no', 'random'):
            with self.subTest(value=value), patch.dict(os.environ, {
                'ALLOW_GENERATED_MODEL_FALLBACK': value, 'APP_ENV': 'development'
            }):
                self.assertFalse(main.allow_generated_model_fallback())

    def test_explainer_failure_returns_generic_503_without_internal_details(self):
        main.model = object()
        main.FEATURE_COLUMNS = ['study_hours_sum']
        main.qhat = 0.5
        main.explainer = None
        main.explainer_load_error = 'ImportError: private path /srv/app/.venv/shap.py'

        with self.assertRaises(HTTPException) as raised:
            main.assert_explainer_ready()

        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(raised.exception.detail, 'Feature explainability is temporarily unavailable')
        self.assertNotIn('/srv/app', str(raised.exception.detail))
        self.assertNotIn('ImportError', str(raised.exception.detail))


if __name__ == '__main__':
    unittest.main()
