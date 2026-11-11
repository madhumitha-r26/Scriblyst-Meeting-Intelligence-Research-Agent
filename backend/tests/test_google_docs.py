import unittest
from unittest.mock import Mock, patch

from app.integrations.google_docs import create_google_doc


class GoogleDocsTests(unittest.TestCase):
    @patch("app.integrations.google_docs.build")
    def test_applies_text_styles_with_google_docs_utf16_indices(self, build):
        service = Mock()
        build.return_value = service
        service.documents.return_value.create.return_value.execute.return_value = {
            "documentId": "doc-id"
        }

        create_google_doc(
            credentials=object(),
            title="Briefing",
            text_content="A🔥B",
            formatting=[
                {
                    "start": 1,
                    "end": 2,
                    "text_style": {"bold": True},
                },
                {
                    "start": 2,
                    "end": 3,
                    "text_style": {
                        "link": {"url": "https://example.com"},
                        "underline": True,
                    },
                },
            ],
        )

        requests = service.documents.return_value.batchUpdate.call_args.kwargs[
            "body"
        ]["requests"]
        self.assertEqual(requests[0]["insertText"]["location"]["index"], 1)
        self.assertEqual(requests[0]["insertText"]["text"], "A🔥B")
        self.assertEqual(
            requests[1]["updateTextStyle"]["range"],
            {"startIndex": 2, "endIndex": 4},
        )
        self.assertEqual(
            requests[1]["updateTextStyle"]["textStyle"],
            {"bold": True},
        )
        self.assertEqual(
            requests[2]["updateTextStyle"]["range"],
            {"startIndex": 4, "endIndex": 5},
        )
        self.assertEqual(
            requests[2]["updateTextStyle"]["textStyle"],
            {
                "link": {"url": "https://example.com"},
                "underline": True,
            },
        )


if __name__ == "__main__":
    unittest.main()
