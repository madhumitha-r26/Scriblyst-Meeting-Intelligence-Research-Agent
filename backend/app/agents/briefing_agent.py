def build_briefing(analysis: dict) -> dict:
    required = ["executive_summary", "developments", "meeting_insights",
                "discussion_questions", "caveats"]
    for key in ("meeting_insights", "discussion_questions"):
        values = analysis.get(key)
        if not isinstance(values, list) or not any(
            isinstance(value, str) and value.strip() for value in values
        ):
            raise ValueError(f"Briefing field '{key}' must contain at least one item.")
    return {key: analysis.get(key, []) for key in required}
