from urllib.parse import urlparse
from app.agents.query_generator import generate_queries
from app.integrations.tavily_client import search_web

def conduct_research(entity, entity_type, start_date, end_date, context=""):
    unique = {}
    for query in generate_queries(entity, entity_type, context):
        for item in search_web(query, start_date, end_date):
            url = (item.get("url") or "").strip()
            if not url or not urlparse(url).scheme:
                continue
            key = url.rstrip("/").lower()
            if key not in unique or (item.get("score") or 0) > (unique[key].get("score") or 0):
                unique[key] = item
    return list(unique.values())
