import os
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def import_security_with_env(overrides, remove=()):
    env = os.environ.copy()
    env.pop('JWT_SECRET_KEY', None)
    env.pop('APP_ENV', None)
    env.pop('NODE_ENV', None)
    env.pop('RENDER', None)
    env.pop('VERCEL', None)
    for key in remove:
        env.pop(key, None)
    env.update(overrides)
    return subprocess.run(
        [sys.executable, '-c', 'import api.security'],
        cwd=ROOT,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


class JwtSecretConfigurationTests(unittest.TestCase):
    def test_production_fails_when_secret_is_missing(self):
        result = import_security_with_env({'APP_ENV': 'production'})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('JWT_SECRET_KEY must be configured in production/staging', result.stderr)

    def test_render_production_fails_when_secret_is_missing(self):
        result = import_security_with_env({'RENDER': 'true'})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('JWT_SECRET_KEY must be configured in production/staging', result.stderr)

    def test_production_rejects_weak_or_example_secret(self):
        for secret in ('short', 'replace-with-a-generated-random-secret-at-least-32-characters'):
            result = import_security_with_env({'APP_ENV': 'production', 'JWT_SECRET_KEY': secret})
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('JWT_SECRET_KEY must be a real random value', result.stderr)

    def test_development_can_generate_an_ephemeral_secret(self):
        result = import_security_with_env({'APP_ENV': 'development'})
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_configured_secret_is_accepted(self):
        secret = 'a-real-test-secret-value-that-is-longer-than-32-characters'
        result = import_security_with_env({'APP_ENV': 'production', 'JWT_SECRET_KEY': secret})
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == '__main__':
    unittest.main()
