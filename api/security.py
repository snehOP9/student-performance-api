import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import bcrypt
import pyotp
from jose import JWTError, jwt

PBKDF2_ALGORITHM = 'sha256'
PBKDF2_ITERATIONS = 600_000
PBKDF2_PREFIX = 'pbkdf2_sha256'

def _load_secret_key() -> str:
    secret = os.getenv('JWT_SECRET_KEY', '').strip()
    if not secret:
        return secrets.token_urlsafe(48)
    if secret == 'change-me-in-env' or len(secret) < 32:
        raise RuntimeError('JWT_SECRET_KEY must be set to a strong 32+ character value')
    return secret


SECRET_KEY = _load_secret_key()
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '15'))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRE_DAYS', '7'))
TEMP_2FA_TOKEN_EXPIRE_MINUTES = int(os.getenv('TEMP_2FA_TOKEN_EXPIRE_MINUTES', '5'))
SETUP_2FA_TOKEN_EXPIRE_MINUTES = int(os.getenv('SETUP_2FA_TOKEN_EXPIRE_MINUTES', '10'))


def _pbkdf2_hash(password: str, salt: bytes | None = None) -> str:
    salt_bytes = salt or secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM,
        password.encode('utf-8'),
        salt_bytes,
        PBKDF2_ITERATIONS,
    )
    encoded_salt = base64.urlsafe_b64encode(salt_bytes).decode('utf-8')
    encoded_hash = base64.urlsafe_b64encode(derived_key).decode('utf-8')
    return f'{PBKDF2_PREFIX}${PBKDF2_ITERATIONS}${encoded_salt}${encoded_hash}'


def _verify_pbkdf2(password: str, hashed_password: str) -> bool:
    try:
        _, iterations, encoded_salt, encoded_hash = hashed_password.split('$', 3)
        salt = base64.urlsafe_b64decode(encoded_salt.encode('utf-8'))
        expected = base64.urlsafe_b64decode(encoded_hash.encode('utf-8'))
    except (ValueError, TypeError):
        return False

    derived_key = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM,
        password.encode('utf-8'),
        salt,
        int(iterations),
    )
    return hmac.compare_digest(derived_key, expected)


def _verify_legacy_bcrypt(password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        return False


def hash_password(password: str) -> str:
    return _pbkdf2_hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    if hashed_password.startswith(f'{PBKDF2_PREFIX}$'):
        return _verify_pbkdf2(password, hashed_password)
    if hashed_password.startswith('$2'):
        return _verify_legacy_bcrypt(password, hashed_password)
    return False


def create_access_token(subject: str, role: str, session_version: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': subject,
        'role': role,
        'sv': session_version,
        'type': 'access',
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str, session_version: int) -> tuple[str, str, datetime]:
    now = datetime.now(timezone.utc)
    expires = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    jti = str(uuid4())
    payload = {
        'sub': subject,
        'type': 'refresh',
        'sv': session_version,
        'jti': jti,
        'iat': int(now.timestamp()),
        'exp': int(expires.timestamp()),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expires


def create_temp_2fa_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': subject,
        'type': '2fa-temp',
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(minutes=TEMP_2FA_TOKEN_EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_2fa_setup_token(subject: str, secret: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'sub': subject,
        'secret': secret,
        'type': '2fa-setup',
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(minutes=SETUP_2FA_TOKEN_EXPIRE_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError('Invalid token') from exc


def generate_2fa_secret() -> str:
    return pyotp.random_base32()


def provisioning_uri(secret: str, email: str) -> str:
    issuer = os.getenv('TOTP_ISSUER', 'StudentPerformancePredictorPro')
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer)


def verify_totp(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code, valid_window=1)


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
