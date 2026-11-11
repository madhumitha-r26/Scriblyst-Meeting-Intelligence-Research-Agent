
import json
import secrets
from datetime import datetime, timezone
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.config import settings
from app.database.auth_store import (
    save_google_credentials,
    get_google_credentials
)
import os

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Permissions required for Calendar events and Google Docs.
SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/documents"
]

def create_oauth_flow(state=None):

    credentials_file = settings.google_credentials_path

    if not credentials_file.exists():
        raise FileNotFoundError(
            f"Google credentials file not found: {credentials_file}"
        )

    flow = Flow.from_client_secrets_file(
    str(credentials_file),
    scopes=SCOPES,
    state=state,
    autogenerate_code_verifier=True)
    flow.redirect_uri = settings.google_redirect_uri

    return flow


def get_authorization_url():
    flow = create_oauth_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )

    return authorization_url, state, flow.code_verifier


def save_credentials(user_id: str, credentials: Credentials):

    save_google_credentials(
        user_id=user_id,
        credentials_json=credentials.to_json()
    )


def get_credentials(user_id: str):

    credentials_json = get_google_credentials(user_id)

    if not credentials_json:
        raise ValueError(
            "Google Calendar is not connected for this user."
        )

    credentials_info = json.loads(credentials_json)

    credentials = Credentials.from_authorized_user_info(
        credentials_info,
        SCOPES
    )

    # Refresh expired credentials when possible.
    if credentials.expired and credentials.refresh_token:

        credentials.refresh(Request())

        # Store the refreshed credentials securely.
        save_credentials(user_id, credentials)

    if not credentials.valid:
        raise ValueError(
            "Google credentials are invalid or expired. "
            "Please reconnect Google Calendar."
        )

    return credentials


def get_calendar_service(user_id: str):

    credentials = get_credentials(user_id)

    return build(
        "calendar",
        "v3",
        credentials=credentials,
        cache_discovery=False
    )

def create_meet_event(
    credentials,
    title,
    description,
    start_time,
    end_time,
    attendees=None
):
    service = build(
        "calendar",
        "v3",
        credentials=credentials,
        cache_discovery=False
    )

    event = {
        "summary": title,
        "description": description,

        "start": {
            "dateTime": start_time,
            "timeZone": "Asia/Kolkata"
        },

        "end": {
            "dateTime": end_time,
            "timeZone": "Asia/Kolkata"
        },

        "conferenceData": {
            "createRequest": {
                "requestId": str(uuid.uuid4()),
                "conferenceSolutionKey": {
                    "type": "hangoutsMeet"
                }
            }
        }
    }

    if attendees:
        event["attendees"] = [
            {"email": email}
            for email in attendees
        ]

    created_event = service.events().insert(
        calendarId="primary",
        body=event,
        conferenceDataVersion=1,
        sendUpdates="all"
    ).execute()

    meet_link = created_event.get("hangoutLink")

    return {
        "event_id": created_event["id"],
        "title": created_event.get("summary"),
        "meet_link": meet_link,
        "calendar_link": created_event.get("htmlLink"),
        "conference_status": (
            created_event.get("conferenceData", {})
            .get("createRequest", {})
            .get("status", {})
            .get("statusCode")
        )
    }

def list_calendar_events(
    user_id: str,
    max_results: int = 20
):

    service = get_calendar_service(user_id)

    events_result = service.events().list(
        calendarId="primary",
        maxResults=max_results,
        singleEvents=True,
        orderBy="startTime",
        timeMin=datetime.now(timezone.utc).isoformat()
    ).execute()

    return events_result.get("items", [])


def create_calendar_event(
    user_id: str,
    title: str,
    description: str,
    start_time,
    end_time,
    timezone: str,
    attendees=None,
    create_meet_link: bool = True
):

    service = get_calendar_service(user_id)

    event = {
        "summary": title,
        "description": description,
        "start": {
            "dateTime": start_time.isoformat(),
            "timeZone": timezone
        },
        "end": {
            "dateTime": end_time.isoformat(),
            "timeZone": timezone
        },
        "attendees": [
            {"email": email}
            for email in (attendees or [])
        ]
    }

    if create_meet_link:

        event["conferenceData"] = {
            "createRequest": {
                "requestId": secrets.token_urlsafe(16),
                "conferenceSolutionKey": {
                    "type": "hangoutsMeet"
                }
            }
        }

    created_event = service.events().insert(
        calendarId="primary",
        body=event,
        sendUpdates="all",
        conferenceDataVersion=1 if create_meet_link else 0
    ).execute()

    return created_event
