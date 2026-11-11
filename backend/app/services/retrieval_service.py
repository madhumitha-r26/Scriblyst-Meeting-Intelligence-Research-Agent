import math
import re


CHUNK_SIZE = 1400
CHUNK_OVERLAP = 200
MAX_PASSAGES = 4
MAX_PASSAGE_CHARS = 1800
STOP_WORDS = {
    "a", "about", "an", "and", "are", "as", "at", "be", "been", "but",
    "by", "can", "could", "did", "do", "does", "for", "from", "get",
    "give", "has", "have", "how", "i", "in", "is", "it", "its", "me",
    "my", "of", "on", "or", "our", "please", "tell", "that", "the",
    "their", "them", "there", "these", "this", "to", "us", "was", "we",
    "what", "when", "where", "which", "who", "why", "will", "with",
    "would", "you", "your",
}


def _tokens(text):
    return [
        token
        for token in re.findall(r"[^\W_]+", text.lower(), flags=re.UNICODE)
        if len(token) > 1 and token not in STOP_WORDS
    ]


def _chunks(text):
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        if end < len(text):
            boundary = text.rfind(" ", start + CHUNK_SIZE // 2, end)
            if boundary > start:
                end = boundary
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == len(text):
            break
        start = max(start + 1, end - CHUNK_OVERLAP)
    return chunks


def retrieve_relevant_sources(report, question, limit=MAX_PASSAGES):
    query_terms = set(_tokens(question))
    if not query_terms:
        return []

    passages = []
    for source in report.get("sources", []):
        title = source.get("title") or ""
        content = source.get("content") or ""
        for chunk in _chunks(content) or ([title] if title else []):
            title_tokens = _tokens(title)
            content_tokens = _tokens(chunk)
            terms = title_tokens * 2 + content_tokens
            if terms:
                passages.append({
                    "source": source,
                    "content": chunk[:MAX_PASSAGE_CHARS],
                    "terms": terms,
                })

    if not passages:
        return []

    document_frequency = {}
    for passage in passages:
        for term in set(passage["terms"]):
            document_frequency[term] = document_frequency.get(term, 0) + 1

    average_length = sum(len(passage["terms"]) for passage in passages) / len(passages)
    total_documents = len(passages)
    ranked = []
    for passage in passages:
        term_counts = {}
        for term in passage["terms"]:
            term_counts[term] = term_counts.get(term, 0) + 1

        length = len(passage["terms"])
        score = 0.0
        for term in query_terms:
            frequency = term_counts.get(term, 0)
            if not frequency:
                continue
            df = document_frequency[term]
            inverse_frequency = math.log(
                1 + (total_documents - df + 0.5) / (df + 0.5)
            )
            denominator = frequency + 1.5 * (
                1 - 0.75 + 0.75 * length / average_length
            )
            score += inverse_frequency * frequency * 2.5 / denominator
        if score > 0:
            ranked.append((score, passage))

    ranked.sort(key=lambda result: result[0], reverse=True)

    selected = []
    seen_sources = set()
    for score, passage in ranked:
        source = passage["source"]
        source_id = source.get("source_id")
        if source_id in seen_sources:
            continue
        seen_sources.add(source_id)
        selected.append({
            "source_id": source_id,
            "title": source.get("title") or "Untitled source",
            "url": source.get("url") or "",
            "content": passage["content"],
            "score": score,
        })
        if len(selected) >= limit:
            break
    return selected
