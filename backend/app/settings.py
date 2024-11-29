from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    MONGODB_URL: str
    MONGODB_NAME: str
    FRONTEND_URLS: List[str]
    OPENAI_API_KEY: str
    MODEL_NAME: str = "gpt-3.5-turbo"
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    VECTOR_DB_PATH: str = "vector_db"

    class Config:
        env_file = ".env"

settings = Settings()