
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Query
)
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field

from app.config import settings
from app.routes.auth import get_current_user

from app.database.auth_store import (
    store_google_oauth_state,
    consume_google_oauth_state,
    remove_google_credentials
)

from app.integrations.calendar_client import (
    create_oauth_flow,
    get_authorization_url,
    save_credentials,
    get_credentials,
    create_calendar_event,
    list_calendar_events
)

import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/calendar",
    tags=["Google Calendar"]
)


class CalendarEventRequest(BaseModel):

    title: str
    description: str = ""

    start_time: datetime
    end_time: datetime

    timezone: str = "Asia/Kolkata"

    attendees: list[EmailStr] = Field(default_factory=list)

    create_meet_link: bool = True


@router.get("/auth-url")
def calendar_auth_url(
    current_user=Depends(get_current_user)
):

    try:

        authorization_url, state, code_verifier = get_authorization_url()

        # OAuth state expires after 10 minutes.
        expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=10
        )

        store_google_oauth_state(
            user_id=str(current_user["_id"]),
            state=state,
            expires_at=expires_at,
            code_verifier=code_verifier
        )

        return {
            "authorization_url": authorization_url
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail="Unable to start Google Calendar authorization."
        ) from error


@router.get("/callback")
def calendar_callback(
    request: Request,
    code: Optional[str] = None,
    state: Optional[str] = None,
    error: Optional[str] = None
):

    if not state:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth state."
        )

    # Find the user who initiated this OAuth flow.
    # The state can only be consumed once.
    user = consume_google_oauth_state(state)

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid, expired, or already-used OAuth state."
        )

    if error:
        return RedirectResponse(
            url=f"{settings.frontend_url}/?calendar=denied"
        )

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Google authorization code is missing."
        )

    try:

        flow = create_oauth_flow(state=state)

        code_verifier = user.get("google_oauth_code_verifier")

        if not code_verifier:
            raise ValueError("OAuth PKCE code verifier is missing.")

        flow.code_verifier = code_verifier

        flow.fetch_token(
            authorization_response=str(request.url)
        )

        save_credentials(
            user_id=str(user["_id"]),
            credentials=flow.credentials
        )

        return RedirectResponse(
            url=f"{settings.frontend_url}/?calendar=connected"
        )

    except Exception as exc:

        logger.exception("Google OAuth callback failed")

        raise HTTPException(
            status_code=400,
            detail=(
                f"Google authorization failed: "
                f"{type(exc).__name__}: {str(exc)}"
            )
        ) from exc


@router.get("/status")
def calendar_status(
    current_user=Depends(get_current_user)
):

    user_id = str(current_user["_id"])

    try:

        get_credentials(user_id)

        return {
            "connected": True
        }

    except ValueError:

        return {
            "connected": False
        }


@router.delete("/disconnect")
def disconnect_calendar(
    current_user=Depends(get_current_user)
):

    user_id = str(current_user["_id"])

    remove_google_credentials(user_id)

    return {
        "success": True,
        "message": "Google Calendar disconnected."
    }


@router.get("/events")
def get_calendar_events(
    max_results: int = Query(default=20, ge=1, le=100),
    current_user=Depends(get_current_user)
):

    user_id = str(current_user["_id"])

    try:

        events = list_calendar_events(
            user_id=user_id,
            max_results=max_results
        )

        return {
            "success": True,
            "events": events
        }

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve Google Calendar events."
        ) from error


@router.post("/events")
def schedule_calendar_event(
    event: CalendarEventRequest,
    current_user=Depends(get_current_user)
):

    if event.end_time <= event.start_time:

        raise HTTPException(
            status_code=400,
            detail="Meeting end time must be after start time."
        )

    user_id = str(current_user["_id"])

    try:

        created_event = create_calendar_event(
            user_id=user_id,
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            timezone=event.timezone,
            attendees=[
                str(email)
                for email in event.attendees
            ],
            create_meet_link=event.create_meet_link
        )

        conference_data = created_event.get(
            "conferenceData", {}
        )

        meet_link = created_event.get("hangoutLink")

        # Fallback in case the Meet link is returned
        # inside conference entry points.
        if not meet_link:

            for entry_point in conference_data.get(
                "entryPoints", []
            ):

                if entry_point.get("entryPointType") == "video":
                    meet_link = entry_point.get("uri")
                    break

        return {
            "success": True,
            "message": "Meeting scheduled successfully.",
            "event_id": created_event.get("id"),
            "event_link": created_event.get("htmlLink"),
            "meet_link": meet_link,
            "conference_status": conference_data.get(
                "createRequest", {}
            ).get("status", {}).get("statusCode")
        }

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=502,
            detail="Unable to create the Google Calendar event."
        ) from error
