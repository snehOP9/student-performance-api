import os
import secrets
from datetime import datetime, timedelta
from uuid import uuid4
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .db import get_db
from .mailer import MailerError, send_password_reset_email
from .models import PasswordResetToken, RefreshToken, User
from .security import (
    create_access_token,
    create_refresh_token,
    create_temp_2fa_token,
    decode_token,
    generate_2fa_secret,
    hash_password,
    hash_reset_token,
    provisioning_uri,
    verify_password,
    verify_totp,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')


def _issue_tokens(db: Session, user: User) -> dict:
    access_token = create_access_token(user.id, user.role)
    refresh_token, jti, expires_at = create_refresh_token(user.id)
    token_row = RefreshToken(id=jti, user_id=user.id, expires_at=expires_at, revoked=False)
    db.add(token_row)
    db.commit()
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'bearer',
    }


def create_user(db: Session, full_name: str, email: str, password: str, role: str) -> User:
    existing = db.query(User).filter(User.email == email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail='Email already registered')

    user = User(
        id=str(uuid4()),
        full_name=full_name,
        email=email.lower(),
        password_hash=hash_password(password),
        role=role,
        is_active=True,
        is_email_verified=False,
        two_fa_enabled=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    if not user.is_active:
        raise HTTPException(status_code=403, detail='User is inactive')

    if user.two_fa_enabled:
        return {
            'requires_2fa': True,
            'temp_token': create_temp_2fa_token(user.id),
            'token_type': 'bearer',
        }

    tokens = _issue_tokens(db, user)
    return {
        'requires_2fa': False,
        **tokens,
    }


def verify_2fa_and_issue(db: Session, temp_token: str, code: str) -> dict:
    payload = decode_token(temp_token)
    if payload.get('type') != '2fa-temp':
        raise HTTPException(status_code=401, detail='Invalid temporary token')

    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if not user or not user.two_fa_enabled or not user.two_fa_secret:
        raise HTTPException(status_code=400, detail='2FA is not configured')

    if not verify_totp(user.two_fa_secret, code):
        raise HTTPException(status_code=401, detail='Invalid 2FA code')

    tokens = _issue_tokens(db, user)
    return {
        'requires_2fa': False,
        **tokens,
    }


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if payload.get('type') != 'refresh':
        raise HTTPException(status_code=401, detail='Invalid refresh token type')

    jti = payload.get('jti')
    sub = payload.get('sub')

    token_row = db.query(RefreshToken).filter(RefreshToken.id == jti).first()
    if not token_row or token_row.revoked or token_row.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail='Refresh token expired or revoked')

    user = db.query(User).filter(User.id == sub).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail='User not available')

    token_row.revoked = True
    db.add(token_row)
    db.commit()

    return _issue_tokens(db, user)


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    try:
        payload = decode_token(refresh_token)
    except ValueError:
        return

    if payload.get('type') != 'refresh':
        return

    token_row = db.query(RefreshToken).filter(RefreshToken.id == payload.get('jti')).first()
    if token_row:
        token_row.revoked = True
        db.add(token_row)
        db.commit()


def request_password_reset(db: Session, email: str) -> None:
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        return

    plain_token = secrets.token_urlsafe(48)
    token_hash = hash_reset_token(plain_token)
    expiry = datetime.utcnow() + timedelta(minutes=30)

    reset_row = PasswordResetToken(
        id=str(uuid4()),
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expiry,
        used=False,
    )
    db.add(reset_row)
    db.commit()

    frontend_url = os.getenv('FRONTEND_BASE_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/forgot-password?token={plain_token}"
    try:
        send_password_reset_email(user.email, reset_link)
    except MailerError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def reset_password(db: Session, token: str, new_password: str) -> None:
    token_hash = hash_reset_token(token)
    row = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == token_hash, PasswordResetToken.used == False)
        .first()
    )
    if not row or row.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail='Invalid or expired reset token')

    user = db.query(User).filter(User.id == row.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user.password_hash = hash_password(new_password)
    row.used = True
    db.add(user)
    db.add(row)
    db.commit()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if payload.get('type') != 'access':
        raise HTTPException(status_code=401, detail='Invalid token type')

    user = db.query(User).filter(User.id == payload.get('sub')).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


def require_roles(*roles: str):
    def _checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
        return user

    return _checker


def setup_2fa(user: User) -> dict:
    secret = generate_2fa_secret()
    uri = provisioning_uri(secret, user.email)
    return {'secret': secret, 'otpauth_url': uri}


def enable_2fa(db: Session, user: User, secret: str, code: str) -> None:
    if not verify_totp(secret, code):
        raise HTTPException(status_code=400, detail='Invalid authenticator code')

    user.two_fa_secret = secret
    user.two_fa_enabled = True
    db.add(user)
    db.commit()


def disable_2fa(db: Session, user: User) -> None:
    user.two_fa_enabled = False
    user.two_fa_secret = None
    db.add(user)
    db.commit()
