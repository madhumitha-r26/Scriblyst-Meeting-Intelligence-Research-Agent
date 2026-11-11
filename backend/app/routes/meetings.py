
from datetime import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import APIRouter, Depends, HTTPException, Query
from googleapiclient.errors import HttpError
from pydantic import BaseModel, Field

from app.routes.auth import get_current_user
from app.integrations.calendar_client import (
    list_calendar_events,
    create_calendar_event
)

router = APIRouter(
    prefix="/api/meetings",
    tags=["meetings"]
)


# Request body for creating a meeting.
class CreateMeetingRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    start_time: datetime
    end_time: datetime
    timezone: str = "Asia/Kolkata"
    attendees: list[str] = Field(default_factory=list)
    create_meet_link: bool = True


# GET: Retrieve upcoming Google Meet meetings.
@router.get("")
def meetings(
    max_results: int = Query(default=20, ge=1, le=100),
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    try:
        events = list_calendar_events(
            user_id=user_id,
            max_results=max_results
        )

        meeting_list = []

        for event in events:
            conference_data = event.get("conferenceData", {})
            meet_link = event.get("hangoutLink")

            if not meet_link:
                for entry in conference_data.get("entryPoints", []):
                    if entry.get("entryPointType") == "video":
                        meet_link = entry.get("uri")
                        break

            # Only include events with Google Meet links.
            if not meet_link:
                continue

            meeting_list.append({
                "event_id": event.get("id"),
                "title": event.get("summary", "Untitled meeting"),
                "description": event.get("description", ""),
                "start_time": event.get("start", {}).get(
                    "dateTime",
                    event.get("start", {}).get("date")
                ),
                "end_time": event.get("end", {}).get(
                    "dateTime",
                    event.get("end", {}).get("date")
                ),
                "meet_link": meet_link,
                "calendar_link": event.get("htmlLink"),
                "attendees": [
                    attendee.get("email")
                    for attendee in event.get("attendees", [])
                ]
            })

        return {
            "connected": True,
            "provider": "google",
            "meetings": meeting_list,
            "message": "Google Meet meetings retrieved successfully."
        }

    except ValueError:
        return {
            "connected": False,
            "meetings": [],
            "message": "Connect your Google account first."
        }

    except HttpError as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve Google Calendar meetings."
        ) from exc


# POST: Create a Google Calendar event with a Google Meet link.
@router.post("/create")
def create_meeting(
    meeting: CreateMeetingRequest,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    # Validate the requested timezone.
    try:
        meeting_timezone = ZoneInfo(meeting.timezone)
    except ZoneInfoNotFoundError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid timezone. Example: Asia/Kolkata"
        ) from exc

    # Convert supplied dates to the requested timezone.
    start_time = meeting.start_time
    end_time = meeting.end_time

    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=meeting_timezone)
    else:
        start_time = start_time.astimezone(meeting_timezone)

    if end_time.tzinfo is None:
        end_time = end_time.replace(tzinfo=meeting_timezone)
    else:
        end_time = end_time.astimezone(meeting_timezone)

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be later than start time."
        )

    try:
        created_event = create_calendar_event(
            user_id=user_id,
            title=meeting.title,
            description=meeting.description,
            start_time=start_time,
            end_time=end_time,
            timezone=meeting.timezone,
            attendees=meeting.attendees,
            create_meet_link=meeting.create_meet_link
        )

        conference_data = created_event.get("conferenceData", {})
        meet_link = created_event.get("hangoutLink")

        if not meet_link:
            for entry in conference_data.get("entryPoints", []):
                if entry.get("entryPointType") == "video":
                    meet_link = entry.get("uri")
                    break

        conference_status = (
            conference_data
            .get("createRequest", {})
            .get("status", {})
            .get("statusCode")
        )

        return {
            "success": True,
            "event_id": created_event.get("id"),
            "title": created_event.get("summary"),
            "meet_link": meet_link,
            "calendar_link": created_event.get("htmlLink"),
            "conference_status": conference_status,
            "message": (
                "Meeting created successfully."
                if meet_link
                else "Calendar event created. Google Meet link may still be processing."
            )
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail="Google Calendar is not connected. Please reconnect your Google account."
        ) from exc

    except HttpError as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to create the Google Calendar meeting."
        ) from exc
