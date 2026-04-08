from pydantic import BaseModel, EmailStr, Field
from typing import Literal

Role = Literal['student', 'teacher', 'admin']
PublicSignupRole = Literal['student', 'teacher']


class SignupRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: PublicSignupRole = 'student'


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class Enable2FARequest(BaseModel):
    setup_token: str
    code: str = Field(min_length=6, max_length=6)


class Verify2FARequest(BaseModel):
    temp_token: str
    code: str = Field(min_length=6, max_length=6)


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: Role
    two_fa_enabled: bool


class LoginResponse(BaseModel):
    requires_2fa: bool
    temp_token: str | None = None
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = 'bearer'
