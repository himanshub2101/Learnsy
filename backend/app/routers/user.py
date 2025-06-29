from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.postgres import get_db
from app.models.user import User
from app.core.deps import get_current_user, require_admin
from app.routers.schemas.user import UserOut, UserUpdate, PasswordChange
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["users"])

# ────────── CURRENT USER ──────────
@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return user

@router.patch("/me", response_model=UserOut)
async def update_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    for k, v in data.dict(exclude_unset=True).items():
        setattr(user, k, v)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/me/change-password", status_code=204)
async def change_password(
    payload: PasswordChange,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not verify_password(payload.old_password, user.password_hash):
        raise HTTPException(400, "Old password incorrect")
    user.password_hash = hash_password(payload.new_password)
    await db.commit()


# ────────── ADMIN ENDPOINTS ──────────
@router.get("/", response_model=list[UserOut], dependencies=[Depends(require_admin)])
async def list_users(
    db: AsyncSession = Depends(get_db)
):
    result = await db.scalars(select(User))
    return result.all()

@router.get("/{user_id}", response_model=UserOut, dependencies=[Depends(require_admin)])
async def get_user_admin(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.patch("/{user_id}", response_model=UserOut, dependencies=[Depends(require_admin)])
async def update_user_admin(
    user_id: str,
    data: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")

    for k, v in data.dict(exclude_unset=True).items():
        setattr(user, k, v)
    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=204, dependencies=[Depends(require_admin)])
async def delete_user_admin(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    await db.delete(user)
    await db.commit()
