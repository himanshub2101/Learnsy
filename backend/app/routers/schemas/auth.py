from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional


class SignupIn(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=64)
    last_name:  str = Field(..., min_length=1, max_length=64)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=20, pattern=r"^\+?[0-9\- ]+$")
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    wallet_address: Optional[str] = None

    # ✅ ensure both passwords match before it even hits your route
    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("password and confirm_password do not match")
        return self


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
