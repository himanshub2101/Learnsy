from fastapi import FastAPI
from app.routers import auth, user, course, enrollment


app = FastAPI()  # <- THIS was missing
app.include_router(user.router, prefix="/api/v1")
app.include_router(course.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(enrollment.router, prefix="/api/v1")

