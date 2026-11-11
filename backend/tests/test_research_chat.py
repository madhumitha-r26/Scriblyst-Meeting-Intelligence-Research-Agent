import json
import unittest
from unittest.mock import Mock, patch
from types import SimpleNamespace

from app.models import ChatRequest
from app.routes.research import chat


REPORT = {
    "sources": [
        {
            "source_id": "source_1",
            "title": "Quarterly results",
            "url": "https://example.com/results",
            "content": "Revenue increased by 12 percent over the year.",
        },
        {
            "source_id": "source_2",
            "title": "Funding announcement",
            "url": "https://example.com/funding",
            "content": "The company closed a Series C funding round led by Acme Ventures.",
        },
    ]
}


class ResearchChatTests(unittest.TestCase):
    @patch("app.routes.research.get_client")
    @patch("app.routes.research.get_report", return_value=REPORT)
    def test_does_not_call_model_when_no_source_matches(
        self, _get_report, get_client
    ):
        result = chat("research-id", ChatRequest(question="Where is the new office?"))

        self.assertEqual(
            result["answer"],
            "I couldn't find relevant information in this briefing's sources.",
        )
        self.assertEqual(result["sources"], [])
        get_client.assert_not_called()

    @patch("app.routes.research.get_report", return_value=REPORT)
    def test_sends_matching_excerpts_and_returns_citations(self, _get_report):
        response = SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(
                        content="Acme Ventures led the Series C round. [source_2]"
                    )
                )
            ]
        )
        client = Mock()
        client.chat.completions.create.return_value = response

        with patch("app.routes.research.get_client", return_value=client):
            result = chat(
                "research-id",
                ChatRequest(question="Who led the Series C funding round?"),
            )

        request = client.chat.completions.create.call_args.kwargs
        provided_context = json.loads(request["messages"][1]["content"])
        self.assertEqual(len(provided_context["sources"]), 1)
        self.assertEqual(
            provided_context["sources"][0]["source_id"], "source_2"
        )
        self.assertIn("Acme Ventures", provided_context["sources"][0]["excerpt"])
        self.assertEqual(
            result["sources"],
            [{
                "source_id": "source_2",
                "title": "Funding announcement",
                "url": "https://example.com/funding",
            }],
        )
        self.assertEqual(result["answer"], response.choices[0].message.content)


if __name__ == "__main__":
    unittest.main()
