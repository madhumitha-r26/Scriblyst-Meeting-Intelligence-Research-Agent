
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from googleapiclient.errors import HttpError

from app.routes.auth import get_current_user
from app.integrations.calendar_client import get_credentials
from app.integrations.google_docs import create_google_doc


router = APIRouter(
    prefix="/api/documents",
    tags=["Google Docs"]
)


class CreateDocumentRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)


@router.get("/status")
def document_status(
    current_user=Depends(get_current_user)
):
    try:
        get_credentials(str(current_user["_id"]))
        return {"google_docs": "credentials_available"}

    except ValueError:
        return {"google_docs": "not_connected"}


@router.post("/create")
def create_document(
    data: CreateDocumentRequest,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    try:
        credentials = get_credentials(user_id)

        result = create_google_doc(
            credentials=credentials,
            title=data.title,
            text_content=data.content
        )

        return {
            "success": True,
            "message": "Google Doc created successfully",
            **result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    except HttpError as error:
        raise HTTPException(
            status_code=502,
            detail="Google Docs API failed. Check your Google permissions."
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to create Google document."
        ) from error
