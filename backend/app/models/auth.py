
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):

    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(
        alias="fullName",
        min_length=2,
        max_length=100
    )

    email: EmailStr

    company: str = Field(
        min_length=2,
        max_length=150
    )

    role: Literal[
        "cso",
        "corp_dev",
        "executive",
        "managing_director",
        "chief_staff",
        "other"
    ]

    password: str = Field(
        min_length=8,
        max_length=128
    )

    accept_terms: bool = Field(alias="acceptTerms")

    connect_calendar: bool = Field(
        default=False,
        alias="connectCalendar"
    )


class LoginRequest(BaseModel):

    model_config = ConfigDict(populate_by_name=True)

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    remember_device: bool = Field(
        default=False,
        alias="rememberDevice"
    )

