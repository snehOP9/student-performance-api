import importlib
import os
import sys
import unittest
from unittest.mock import patch


MODULE_NAME = 'api.security'


def _import_security():
    sys.modules.pop(MODULE_NAME, None)
    return importlib.import_module(MODULE_NAME)


class SecretKeyLoadingTests(unittest.TestCase):
    def tearDown(self):
        sys.modules.pop(MODULE_NAME, None)

    def test_uses_configured_secret(self):
        secret = 'x' * 32
        with patch.dict(
            os.environ,
            {
                'JWT_SECRET_KEY': secret,
                'APP_ENV': 'production',
                'ALLOW_EPHEMERAL_JWT_SECRET': '',
            },
            clear=False,
        ):
            security = _import_security()
            self.assertEqual(security.SECRET_KEY, secret)

    def test_missing_production_secret_raises(self):
        with patch.dict(
            os.environ,
            {
                'JWT_SECRET_KEY': '',
                'APP_ENV': 'production',
                'ALLOW_EPHEMERAL_JWT_SECRET': '',
            },
            clear=False,
        ):
            with self.assertRaisesRegex(RuntimeError, 'required in production'):
                _import_security()

    def test_weak_secret_raises(self):
        with patch.dict(
            os.environ,
            {
                'JWT_SECRET_KEY': 'too-short',
                'APP_ENV': 'production',
                'ALLOW_EPHEMERAL_JWT_SECRET': '',
            },
            clear=False,
        ):
            with self.assertRaisesRegex(RuntimeError, '32\\+ character'):
                _import_security()

    def test_test_mode_allows_ephemeral_secret(self):
        with patch.dict(
            os.environ,
            {
                'JWT_SECRET_KEY': '',
                'APP_ENV': 'test',
                'ALLOW_EPHEMERAL_JWT_SECRET': '',
            },
            clear=False,
        ):
            security = _import_security()
            self.assertGreaterEqual(len(security.SECRET_KEY), 32)

    def test_opt_in_flag_allows_ephemeral_secret(self):
        with patch.dict(
            os.environ,
            {
                'JWT_SECRET_KEY': '',
                'APP_ENV': '',
                'ALLOW_EPHEMERAL_JWT_SECRET': 'true',
            },
            clear=False,
        ):
            security = _import_security()
            self.assertGreaterEqual(len(security.SECRET_KEY), 32)


if __name__ == '__main__':
    unittest.main()
