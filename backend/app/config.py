
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# backend/ directory
BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):

    # Frontend
    frontend_origin: str = "http://localhost:5173"
    frontend_url: str = "http://localhost:5173"

    # AI / Bifrost
    bifrost_base_url: str = "http://localhost:8080/v1"
    bifrost_api_key: str = ""
    bifrost_model: str = "groq/openai/gpt-oss-120b"

    # Tavily
    tavily_api_key: str = ""

    # MongoDB
    mongodb_uri: str = ""
    mongodb_database: str = "meeting_intelligence"

    # JWT authentication
    jwt_secret_key: str = ""
    jwt_algorithm: str = "HS256"
    access_token_expire_hours: int = 24
    remember_me_expire_days: int = 30

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    google_client_secret_file: str = "credentials.json"

    google_redirect_uri: str = (
        "http://localhost:8000/api/calendar/callback"
    )

    # Used to encrypt Google user tokens before MongoDB storage
    google_token_encryption_key: str = ""

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def google_credentials_path(self) -> Path:
        path = Path(self.google_client_secret_file)

        if not path.is_absolute():
            path = BACKEND_DIR / path

        return path.resolve()


settings = Settings()
