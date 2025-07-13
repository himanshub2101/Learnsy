from fastapi import FastAPI
from app.routers import auth, user, course, enrollment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()  # <- THIS was missing
app.include_router(user.router, prefix="/api/v1")
app.include_router(course.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(enrollment.router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",        # local dev
        "http://www.learnsy.in",        # http version
        "https://www.learnsy.in",       # https version (for production SSL)
        "http://learnsy.in",            # bare domain
        "https://learnsy.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
