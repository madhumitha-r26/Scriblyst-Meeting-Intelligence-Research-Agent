
from googleapiclient.discovery import build


def _docs_index(text: str) -> int:
    return len(text.encode("utf-16-le")) // 2


def create_google_doc(
    credentials,
    title: str,
    text_content: str,
    formatting: list[dict] | None = None,
):
    """
    Create a Google Doc and insert meeting content.

    credentials: authenticated Google Credentials object
    """

    docs_service = build(
        "docs",
        "v1",
        credentials=credentials,
        cache_discovery=False
    )

    document = docs_service.documents().create(
        body={"title": title}
    ).execute()

    document_id = document["documentId"]
    requests = [{
        "insertText": {
            "location": {"index": 1},
            "text": text_content
        }
    }]

    for item in formatting or []:
        start_index = _docs_index(text_content[:item["start"]]) + 1
        end_index = _docs_index(text_content[:item["end"]]) + 1
        text_range = {
            "startIndex": start_index,
            "endIndex": end_index,
        }

        if item.get("text_style"):
            requests.append({
                "updateTextStyle": {
                    "range": text_range,
                    "textStyle": item["text_style"],
                    "fields": ",".join(item["text_style"]),
                }
            })

        if item.get("paragraph_style"):
            requests.append({
                "updateParagraphStyle": {
                    "range": text_range,
                    "paragraphStyle": item["paragraph_style"],
                    "fields": ",".join(item["paragraph_style"]),
                }
            })

    docs_service.documents().batchUpdate(
        documentId=document_id,
        body={"requests": requests}
    ).execute()

    return {
        "document_id": document_id,
        "document_url": (
            f"https://docs.google.com/document/d/{document_id}/edit"
        ),
        "title": title
    }
