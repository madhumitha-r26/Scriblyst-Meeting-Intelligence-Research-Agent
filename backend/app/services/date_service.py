from datetime import timedelta, timezone

def research_window(meeting_datetime):
    if meeting_datetime.tzinfo is None:
        raise ValueError("meeting_datetime must include a timezone offset")
    return meeting_datetime - timedelta(days=30), meeting_datetime

def tavily_date(value):
    return value.astimezone(timezone.utc).date().isoformat()
