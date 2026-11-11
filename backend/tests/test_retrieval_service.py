import unittest

from app.services.retrieval_service import retrieve_relevant_sources


class RetrieveRelevantSourcesTests(unittest.TestCase):
    def test_returns_matching_passage_and_source_metadata(self):
        report = {
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

        results = retrieve_relevant_sources(
            report, "Who led the Series C funding round?"
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["source_id"], "source_2")
        self.assertIn("Acme Ventures", results[0]["content"])
        self.assertEqual(results[0]["url"], "https://example.com/funding")

    def test_returns_no_sources_when_question_does_not_match(self):
        report = {
            "sources": [
                {
                    "source_id": "source_1",
                    "title": "Quarterly results",
                    "url": "https://example.com/results",
                    "content": "Revenue increased by 12 percent over the year.",
                }
            ]
        }

        self.assertEqual(
            retrieve_relevant_sources(report, "Where is the new office?"),
            [],
        )

    def test_deduplicates_multiple_matching_chunks_from_one_source(self):
        report = {
            "sources": [
                {
                    "source_id": "source_1",
                    "title": "Company update",
                    "url": "https://example.com/update",
                    "content": (
                        "Background information. " * 100
                        + "The company announced its fusion reactor prototype "
                        "and plans to begin testing in December."
                    ),
                }
            ]
        }

        results = retrieve_relevant_sources(
            report, "When will the fusion reactor begin testing?"
        )

        self.assertEqual(len(results), 1)
        self.assertIn("fusion reactor", results[0]["content"])


if __name__ == "__main__":
    unittest.main()
