from datetime import datetime, timezone
from uuid import uuid4
from app.services.date_service import research_window, tavily_date
from app.agents.research_agent import conduct_research
from app.agents.analysis_agent import analyze
from app.agents.briefing_agent import build_briefing

def create_report(request):
    start, end = research_window(request.meeting_datetime)
    start_s, end_s = tavily_date(start), tavily_date(end)
    raw = conduct_research(request.entity_name, request.entity_type,
                           start_s, end_s, request.meeting_context)
    sources = []
    for i, item in enumerate(raw, 1):
        sources.append({
            "source_id": f"source_{i}",
            "title": item.get("title") or "Untitled source",
            "url": item.get("url", ""),
            "content": item.get("raw_content") or item.get("content") or "",
            "published_date": item.get("published_date"),
            "score": item.get("score"),
            "date_status": "provider_date" if item.get("published_date") else "unknown"
        })
    analysis = analyze(request.entity_name, request.entity_type,
                       request.meeting_datetime, start_s, end_s,
                       request.meeting_context, sources)
    return {
        "research_id": str(uuid4()),
        "entity_name": request.entity_name,
        "entity_type": request.entity_type,
        "meeting_datetime": request.meeting_datetime.isoformat(),
        "timezone": request.timezone,
        "research_period": {"start": start_s, "end": end_s},
        "meeting_context": request.meeting_context,
        "briefing": build_briefing(analysis),
        "sources": sources,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
