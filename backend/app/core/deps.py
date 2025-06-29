# app/core/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.models.user import User
from app.core.config import get_settings
from app.core.security import decode_access_token  # reuse your helper

settings = get_settings()

# NOTE: prefix matters – this must be the full path used by your router include
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Parse JWT, fetch the user, raise 401/404 as needed.
    """
    try:
        payload = decode_access_token(token)  # wraps jose.jwt.decode
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    """
    Allow only admin‑role users to proceed.
    """
    if user.role != "admin":          # adjust if you renamed the field
        raise HTTPException(status_code=403, detail="Admins only")
    return user
