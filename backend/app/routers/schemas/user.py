from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    wallet_address: Optional[str] = None
    role: str

    class Config:
        from_attributes = True          # Pydantic v2 replacement for orm_mode

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    wallet_address: Optional[str]

class PasswordChange(BaseModel):
    old_password: str = Field(min_length=6)
    new_password: str = Field(min_length=6)
