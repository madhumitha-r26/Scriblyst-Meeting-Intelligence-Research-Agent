
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

from app.routes import auth, calendar, meetings, research, documents

app = FastAPI(
    title="Meeting Intelligence Agent",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Existing application routes
app.include_router(research.router)
app.include_router(meetings.router)
app.include_router(documents.router)
app.include_router(auth.router)

# Google Calendar routes
app.include_router(calendar.router)


@app.get("/")
def home():
    return {
        "message": "meeting-intelligence-agent is running"
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }
