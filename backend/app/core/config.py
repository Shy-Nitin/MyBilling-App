import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "MyBilling ERP"
    API_V1_STR: str = "/api/v1"
    
    # Primary database URL: defaults to SQLite for immediate out-of-the-box local execution,
    # and can be overridden by DATABASE_URL environment variable for PostgreSQL.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./mybilling.db"
    )
    
    # Server configs
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"]
    
    class Config:
        case_sensitive = True

settings = Settings()
