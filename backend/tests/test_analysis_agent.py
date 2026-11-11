import json
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import Mock, patch

from app.agents.analysis_agent import analyze
from app.agents.briefing_agent import build_briefing


SOURCE = {
    "source_id": "source_1",
    "title": "Quarterly expansion update",
    "url": "https://example.com/expansion",
    "published_date": "2026-11-01",
    "content": "The company is expanding its regional operations.",
    "score": 0.9,
}


def model_result(content):
    return SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=content))]
    )


class AnalysisAgentTests(unittest.TestCase):
    def test_no_sources_returns_explanatory_insight_and_questions(self):
        result = analyze(
            "Acme", "company", datetime.now(timezone.utc),
            "2026-10-01", "2026-11-01", "Discuss partnership", [],
        )

        self.assertTrue(result["meeting_insights"])
        self.assertIn("no usable sources", result["meeting_insights"][0])
        self.assertTrue(result["discussion_questions"])
        self.assertTrue(
            all("model returned" not in caveat for caveat in result["caveats"])
        )

    @patch("app.agents.analysis_agent.OpenAI")
    @patch("app.agents.analysis_agent.settings.bifrost_api_key", "test-key")
    def test_empty_model_fields_get_safe_fallbacks_and_caveats(self, openai_class):
        client = Mock()
        client.chat.completions.create.return_value = model_result(json.dumps({
            "executive_summary": ["Expansion is underway."],
            "developments": [],
            "meeting_insights": [],
            "discussion_questions": [],
            "caveats": [],
        }))
        openai_class.return_value = client

        result = analyze(
            "Acme", "company", datetime.now(timezone.utc),
            "2026-10-01", "2026-11-01", "Discuss partnership", [SOURCE],
        )

        self.assertTrue(result["meeting_insights"])
        self.assertTrue(result["discussion_questions"])
        self.assertIn("Quarterly expansion update", result["meeting_insights"][0])
        self.assertTrue(any("safe fallback prompts were used" in item for item in result["caveats"]))

    @patch("app.agents.analysis_agent.OpenAI")
    @patch("app.agents.analysis_agent.settings.bifrost_api_key", "test-key")
    def test_prompt_requires_nonempty_discussion_fields(self, openai_class):
        client = Mock()
        client.chat.completions.create.return_value = model_result(json.dumps({
            "executive_summary": ["Expansion is underway."],
            "developments": [],
            "meeting_insights": ["Discuss expansion [source_1]."],
            "discussion_questions": ["How will expansion affect operations?"],
            "caveats": [],
        }))
        openai_class.return_value = client

        analyze(
            "Acme", "company", datetime.now(timezone.utc),
            "2026-10-01", "2026-11-01", "Discuss partnership", [SOURCE],
        )

        system_prompt = client.chat.completions.create.call_args.kwargs[
            "messages"
        ][0]["content"]
        self.assertIn(
            "These arrays must not be empty",
            " ".join(system_prompt.split()),
        )

    def test_briefing_builder_rejects_empty_discussion_fields(self):
        with self.assertRaisesRegex(ValueError, "meeting_insights"):
            build_briefing({
                "executive_summary": ["Summary"],
                "developments": [],
                "meeting_insights": [],
                "discussion_questions": ["Question"],
                "caveats": [],
            })


if __name__ == "__main__":
    unittest.main()
