import unittest

from api.security import (
    MAX_PBKDF2_VERIFY_ITERATIONS,
    PBKDF2_PREFIX,
    hash_password,
    verify_password,
)


class PasswordVerificationTests(unittest.TestCase):
    def test_pbkdf2_password_round_trip(self):
        hashed = hash_password('correct horse battery staple')

        self.assertTrue(verify_password('correct horse battery staple', hashed))
        self.assertFalse(verify_password('wrong password', hashed))

    def test_malformed_iteration_count_returns_false(self):
        malformed = f'{PBKDF2_PREFIX}$not-a-number$c2FsdA==$aGFzaA=='

        self.assertFalse(verify_password('password', malformed))

    def test_excessive_iteration_count_returns_false_without_hashing(self):
        excessive = MAX_PBKDF2_VERIFY_ITERATIONS + 1
        malformed = f'{PBKDF2_PREFIX}${excessive}$c2FsdA==$aGFzaA=='

        self.assertFalse(verify_password('password', malformed))

    def test_invalid_base64_returns_false(self):
        malformed = f'{PBKDF2_PREFIX}$600000$a$a'

        self.assertFalse(verify_password('password', malformed))


if __name__ == '__main__':
    unittest.main()
