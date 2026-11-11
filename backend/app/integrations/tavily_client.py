from tavily import TavilyClient
from app.config import settings

def search_web(query, start_date, end_date, max_results=8):
    if not settings.tavily_api_key:
        raise RuntimeError("TAVILY_API_KEY is missing in backend/.env")
    client = TavilyClient(api_key=settings.tavily_api_key)
    data = client.search(
        query=query, topic="news", search_depth="advanced",
        max_results=max_results, start_date=start_date, end_date=end_date,
        include_raw_content=True
    )
    return data.get("results", [])
