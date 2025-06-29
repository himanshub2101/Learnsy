from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import uuid4

from app.db.postgres import get_db
from app.models.user import User
from app.routers.schemas.auth import SignupIn, LoginIn, TokenOut
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# ────────── SIGN‑UP ──────────
@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupIn, db: AsyncSession = Depends(get_db)):
    # Check duplicate email
    if await db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        id=str(uuid4()),
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="user",           # or 'admin' if you seed manually
    )
    db.add(user)
    await db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token}

# ────────── LOGIN ──────────
@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    user: User | None = await db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token}
