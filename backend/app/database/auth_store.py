
from datetime import datetime, timezone
from functools import lru_cache

from bson import ObjectId
from cryptography.fernet import Fernet
from pymongo import MongoClient, ReturnDocument

from app.config import settings


@lru_cache
def get_users_collection():

    if not settings.mongodb_uri:
        raise RuntimeError(
            "MONGODB_URI is not configured in the .env file"
        )

    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=5000
    )

    database = client[settings.mongodb_database]
    users = database["users"]

    # Ensure email addresses are unique.
    users.create_index("email", unique=True)

    return users


def get_token_cipher():

    key = settings.google_token_encryption_key

    if not key:
        raise RuntimeError(
            "GOOGLE_TOKEN_ENCRYPTION_KEY is not configured."
        )

    try:
        return Fernet(key.encode("utf-8"))
    except Exception as exc:
        raise RuntimeError(
            "GOOGLE_TOKEN_ENCRYPTION_KEY is invalid."
        ) from exc


def store_google_oauth_state(
    user_id: str,
    state: str,
    expires_at: datetime,
    code_verifier: str
):
    users = get_users_collection()

    result = users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "google_oauth_state": state,
            "google_oauth_state_expires_at": expires_at,
            "google_oauth_code_verifier": code_verifier
        }}
    )

    if result.matched_count == 0:
        raise ValueError("Application user was not found.")


def consume_google_oauth_state(state: str):
    users = get_users_collection()
    now = datetime.now(timezone.utc)

    user = users.find_one_and_update(
        {
            "google_oauth_state": state,
            "google_oauth_state_expires_at": {"$gt": now}
        },
        {
            "$unset": {
                "google_oauth_state": "",
                "google_oauth_state_expires_at": "",
                "google_oauth_code_verifier": ""
            }
        },
        return_document=ReturnDocument.BEFORE
    )

    return user


def save_google_credentials(
    user_id: str,
    credentials_json: str
):

    cipher = get_token_cipher()

    encrypted_credentials = cipher.encrypt(
        credentials_json.encode("utf-8")
    ).decode("utf-8")

    result = get_users_collection().update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "google_credentials_encrypted": encrypted_credentials,
                "google_connected_at": datetime.now(timezone.utc)
            }
        }
    )

    if result.matched_count == 0:
        raise ValueError("Application user was not found.")


def get_google_credentials(user_id: str):

    user = get_users_collection().find_one(
        {"_id": ObjectId(user_id)},
        {"google_credentials_encrypted": 1}
    )

    if not user:
        return None

    encrypted_credentials = user.get(
        "google_credentials_encrypted"
    )

    if not encrypted_credentials:
        return None

    cipher = get_token_cipher()

    try:
        decrypted = cipher.decrypt(
            encrypted_credentials.encode("utf-8")
        )

        return decrypted.decode("utf-8")

    except Exception as exc:
        raise RuntimeError(
            "Unable to decrypt Google credentials. "
            "Check your encryption key."
        ) from exc


def remove_google_credentials(user_id: str):

    get_users_collection().update_one(
        {"_id": ObjectId(user_id)},
        {
            "$unset": {
                "google_credentials_encrypted": "",
                "google_connected_at": ""
            }
        }
    )
