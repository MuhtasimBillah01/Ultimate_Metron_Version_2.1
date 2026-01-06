from pydantic_settings import BaseSettings
from pydantic import computed_field
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Metron Trading Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database Config
    POSTGRES_USER: str = "user"
    POSTGRES_PASSWORD: str = "pass"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "metron"
    
    REDIS_URL: str = "redis://localhost:6379"

    # AI & Trading Config
    GEMINI_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    EXCHANGE_TYPE: str = "crypto"
    EXCHANGE_NAME: str = "Binance"
    RISK_LIMIT: float = 2.0
    MAX_DRAWDOWN: float = 20.0
    STRATEGY_MODE: str = "hybrid"

    @computed_field
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
