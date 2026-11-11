from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    entity_name: str = Field(min_length=2, max_length=160)
    entity_type: Literal["company", "person"]
    meeting_datetime: datetime
    timezone: str = "UTC"
    meeting_context: str = ""


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)


class ExportRequest(BaseModel):
    title: str | None = None
