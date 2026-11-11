from openai import OpenAI
from app.config import settings

def get_client():
    if not settings.bifrost_api_key:
        raise RuntimeError("BIFROST_API_KEY is missing")
    return OpenAI(api_key=settings.bifrost_api_key,
                  base_url=settings.bifrost_base_url.rstrip("/") + "/")
