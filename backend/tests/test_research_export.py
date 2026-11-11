import unittest
from unittest.mock import patch

from fastapi import HTTPException

from app.models import ExportRequest
from app.routes.research import build_research_document, export


REPORT = {
    "entity_name": "Acme",
    "meeting_datetime": "2026-11-12T10:00:00",
    "research_period": {"start": "2026-10-13", "end": "2026-11-12"},
    "briefing": {
        "executive_summary": ["Revenue increased."],
        "developments": [{
            "headline": "New product launched",
            "summary": "The company announced a new product.",
            "source_ids": ["source_1"],
        }],
        "meeting_insights": ["Ask about growth."],
        "discussion_questions": ["What is next?"],
    },
    "sources": [
        {
            "source_id": "source_1",
            "title": "Quarterly results",
            "url": "https://example.com/results",
        }
    ],
}


class ResearchExportTests(unittest.TestCase):
    @patch(
        "app.routes.research.create_google_doc",
        return_value={"document_id": "doc-id", "document_url": "https://docs.google.com/document/d/doc-id/edit"},
    )
    @patch("app.routes.research.get_credentials")
    @patch("app.routes.research.get_report", return_value=REPORT)
    def test_exports_using_the_signed_in_users_google_credentials(
        self, _get_report, get_credentials, create_google_doc
    ):
        credentials = object()
        get_credentials.return_value = credentials

        result = export(
            "research-id",
            ExportRequest(),
            current_user={"_id": "user-id"},
        )

        _get_report.assert_called_once_with("research-id")
        self.assertEqual(
            result,
            {"document_url": "https://docs.google.com/document/d/doc-id/edit"},
        )
        get_credentials.assert_called_once_with("user-id")
        create_google_doc.assert_called_once()
        self.assertIs(create_google_doc.call_args.args[0], credentials)
        self.assertEqual(
            create_google_doc.call_args.args[1],
            "Meeting Briefing - Acme",
        )
        content, formatting = create_google_doc.call_args.args[2:]
        self.assertIn("MEETING BRIEFING: Acme", content)
        self.assertIn("New product launched", content)
        self.assertIn("[source_1] Quarterly results", content)
        self.assertIn({
            "start": content.index("Quarterly results"),
            "end": content.index("Quarterly results") + len("Quarterly results"),
            "text_style": {
                "link": {"url": "https://example.com/results"},
                "underline": True,
            },
        }, formatting)
        self.assertIn({
            "start": content.index("MEETING BRIEFING: Acme"),
            "end": content.index("MEETING BRIEFING: Acme") + len("MEETING BRIEFING: Acme"),
            "text_style": {
                "bold": True,
                "fontSize": {"magnitude": 20, "unit": "PT"},
            },
        }, formatting)
        self.assertIn({
            "start": content.index("EXECUTIVE SUMMARY"),
            "end": content.index("EXECUTIVE SUMMARY") + len("EXECUTIVE SUMMARY") + 1,
            "paragraph_style": {"namedStyleType": "HEADING_1"},
        }, formatting)

    def test_build_research_document_links_cited_source_ids(self):
        content, formatting = build_research_document(REPORT)
        citation_offset = content.index("source_1", content.index("Sources:"))

        self.assertEqual(content[citation_offset:citation_offset + len("source_1")], "source_1")
        self.assertIn({
            "start": citation_offset,
            "end": citation_offset + len("source_1"),
            "text_style": {
                "link": {"url": "https://example.com/results"},
                "underline": True,
            },
        }, formatting)

    @patch(
        "app.routes.research.get_credentials",
        side_effect=ValueError("Google Calendar is not connected."),
    )
    @patch("app.routes.research.get_report", return_value=REPORT)
    def test_requires_a_google_connection_for_export(
        self, _get_report, _get_credentials
    ):
        with self.assertRaises(HTTPException) as raised:
            export(
                "research-id",
                ExportRequest(),
                current_user={"_id": "user-id"},
            )

        _get_report.assert_called_once_with("research-id")
        _get_credentials.assert_called_once_with("user-id")
        self.assertEqual(raised.exception.status_code, 401)
        self.assertEqual(
            raised.exception.detail,
            "Connect Google Calendar before exporting to Google Docs.",
        )

    @patch("app.routes.research.get_report", return_value=None)
    def test_returns_not_found_without_attempting_google_auth(self, _get_report):
        with patch("app.routes.research.get_credentials") as get_credentials:
            with self.assertRaises(HTTPException) as raised:
                export(
                    "missing-id",
                    ExportRequest(),
                    current_user={"_id": "user-id"},
                )

        _get_report.assert_called_once_with("missing-id")
        self.assertEqual(raised.exception.status_code, 404)
        get_credentials.assert_not_called()


if __name__ == "__main__":
    unittest.main()
