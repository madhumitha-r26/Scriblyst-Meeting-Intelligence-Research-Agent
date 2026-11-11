def generate_queries(entity, entity_type, context=""):
    if entity_type == "company":
        topics = [
            "latest news announcements", "product launches",
            "leadership changes executive appointments", "senior executive hires",
            "partnerships acquisitions investments", "business strategy developments",
            "technology and industry developments"
        ]
    else:
        topics = [
            "professional news public announcements", "interviews articles publications",
            "leadership appointments career developments", "speeches events public activities",
            "business partnerships and projects"
        ]
    queries = [f'"{entity}" {topic}' for topic in topics]
    if context.strip():
        queries.append(f'"{entity}" {context.strip()}')
    return queries
