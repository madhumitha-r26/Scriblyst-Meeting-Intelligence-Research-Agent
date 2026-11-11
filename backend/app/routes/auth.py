
import re
from datetime import datetime, timezone

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm
)
import jwt
from jwt.exceptions import InvalidTokenError

from app.config import settings
from app.database.auth_store import get_users_collection
from app.models.auth import (
    LoginRequest,
    RegisterRequest,
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


def validate_password(password: str) -> None:
    if len(password) < 8 or not re.search(r"[0-9]", password) or not re.search(
        r"[^A-Za-z0-9]", password
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least 8 characters and contain "
                "a number and a special character."
            )
        )


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)

def public_user(user):

    return {
        "id": str(user["_id"]),
        "fullName": user["full_name"],
        "email": user["email"],
        "company": user["company"],
        "role": user["role"],
        "connectCalendar": user.get(
            "connect_calendar", False
        )
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest):

    if not data.accept_terms:
        raise HTTPException(
            status_code=400,
            detail="You must accept the Terms of Service."
        )

    validate_password(data.password)

    users = get_users_collection()

    email = str(data.email).strip().lower()

    user_document = {
        "full_name": data.full_name.strip(),
        "email": email,
        "company": data.company.strip(),
        "role": data.role,
        "password_hash": hash_password(data.password),
        "connect_calendar": data.connect_calendar,
        "created_at": datetime.now(timezone.utc),
        "is_active": True
    }

    try:

        result = users.insert_one(user_document)

    except DuplicateKeyError:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    user_document["_id"] = result.inserted_id

    token = create_access_token(
        str(result.inserted_id),
        remember_device=False
    )

    return {
        "message": "Account created successfully.",
        "access_token": token,
        "token_type": "bearer",
        "user": public_user(user_document)
    }


@router.post("/login")
def login(data: LoginRequest):

    users = get_users_collection()

    email = str(data.email).strip().lower()

    user = users.find_one({
        "email": email
    })

    if not user or not verify_password(
        data.password,
        user["password_hash"]
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.get("is_active", True):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been disabled."
        )

    token = create_access_token(
        str(user["_id"]),
        remember_device=data.remember_device
    )

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer",
        "user": public_user(user)
    }

@router.post("/token")
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    users = get_users_collection()

    # Swagger sends the email in the username field
    email = form_data.username.strip().lower()

    user = users.find_one({
        "email": email
    })

    if not user or not verify_password(
        form_data.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been disabled."
        )

    token = create_access_token(
        str(user["_id"]),
        remember_device=False
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def get_current_user(token: str = Depends(oauth2_scheme)):

    try:

        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise InvalidTokenError("Missing subject")

        user = get_users_collection().find_one({
            "_id": ObjectId(user_id)
        })

        if not user or not user.get("is_active", True):
            raise InvalidTokenError("User not found or inactive")

        return user

    except (InvalidTokenError, ValueError, TypeError):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )


@router.get("/me")
def get_profile(user=Depends(get_current_user)):

    return {
        "user": public_user(user)
    }
