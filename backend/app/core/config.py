from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    alchemy_rpc: str
    backend_wallet_pk: str
    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()
