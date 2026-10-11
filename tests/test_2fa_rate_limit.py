import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from api.auth import MAX_2FA_FAILURES, verify_2fa_and_issue
from api.db import Base
from api.models import User

USER_ID = 'user-2fa-test'


class TwoFactorLockoutTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            'sqlite+pysqlite:///:memory:',
            connect_args={'check_same_thread': False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)
        self.db.add(User(
            id=USER_ID,
            full_name='Test Account',
            email='test@example.com',
            password_hash='test-only',
            role='student',
            is_active=True,
            two_fa_enabled=True,
            two_fa_secret='JBSWY3DPEHPK3PXP',
        ))
        self.db.commit()
        self.decode = patch(
            'api.auth.decode_token',
            return_value={'sub': USER_ID, 'type': '2fa-temp'},
        )
        self.decode.start()
        self.addCleanup(self.decode.stop)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_five_failures_lock_even_a_correct_code_until_expiry(self):
        with patch('api.auth.verify_totp', return_value=False):
            for attempt in range(MAX_2FA_FAILURES):
                with self.assertRaises(HTTPException) as caught:
                    verify_2fa_and_issue(self.db, 'temp-token', 'wrong')
                expected = 429 if attempt == MAX_2FA_FAILURES - 1 else 401
                self.assertEqual(caught.exception.status_code, expected)

        with Session(self.engine) as other_session:
            with patch('api.auth.verify_totp', return_value=True) as checker:
                with self.assertRaises(HTTPException) as caught:
                    verify_2fa_and_issue(other_session, 'new-temp-token', 'correct')
                self.assertEqual(caught.exception.status_code, 429)
                self.assertGreater(int(caught.exception.headers['Retry-After']), 0)
                checker.assert_not_called()

        user = self.db.get(User, USER_ID)
        user.two_fa_locked_until = datetime.now(timezone.utc) - timedelta(seconds=1)
        self.db.commit()

        with patch('api.auth.verify_totp', return_value=True), patch(
            'api.auth._issue_tokens', return_value={'access_token': 'test-token'}
        ):
            result = verify_2fa_and_issue(self.db, 'new-temp-token', 'correct')

        self.assertEqual(result['access_token'], 'test-token')
        self.db.refresh(user)
        self.assertEqual(user.two_fa_failed_attempts, 0)
        self.assertIsNone(user.two_fa_locked_until)

    def test_success_clears_partial_failed_attempts(self):
        with patch('api.auth.verify_totp', return_value=False):
            with self.assertRaises(HTTPException):
                verify_2fa_and_issue(self.db, 'temp-token', 'wrong')

        with patch('api.auth.verify_totp', return_value=True), patch(
            'api.auth._issue_tokens', return_value={'access_token': 'test-token'}
        ):
            verify_2fa_and_issue(self.db, 'temp-token', 'correct')

        user = self.db.get(User, USER_ID)
        self.assertEqual(user.two_fa_failed_attempts, 0)

    def test_disabled_user_cannot_complete_2fa(self):
        user = self.db.get(User, USER_ID)
        user.is_active = False
        self.db.commit()

        with patch('api.auth.verify_totp', return_value=True):
            with self.assertRaises(HTTPException) as caught:
                verify_2fa_and_issue(self.db, 'temp-token', 'correct')
        self.assertEqual(caught.exception.status_code, 403)


if __name__ == '__main__':
    unittest.main()
