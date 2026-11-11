
from datetime import datetime, timedelta, timezone

import jwt

from pwdlib import PasswordHash
from app.config import settings


password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:

    return password_hasher.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    return password_hasher.verify(
        password,
        hashed_password
    )


def create_access_token(
    user_id: str,
    remember_device: bool = False
):

    if remember_device:

        expires_delta = timedelta(
            days=settings.remember_me_expire_days
        )

    else:

        expires_delta = timedelta(
            hours=settings.access_token_expire_hours
        )

    now = datetime.now(timezone.utc)

    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + expires_delta
    }

    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )

    return token
