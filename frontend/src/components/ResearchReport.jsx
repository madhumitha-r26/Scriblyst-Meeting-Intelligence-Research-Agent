import { useState } from "react";
import {
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";
import FormatToggle from "./FormatToggle";
import SourceList from "./SourceList";
import { exportResearch } from "../services/api";

export default function ResearchReport({ report }) {
  const [format, setFormat] = useState("bullet");
  const [err, setErr] = useState("");
  const b = report.briefing || {};
  const meetingInsights = b.meeting_insights?.length
    ? b.meeting_insights
    : ["No meeting insights were returned. Generate a new briefing to retry."];
  const discussionQuestions = b.discussion_questions?.length
    ? b.discussion_questions
    : ["No discussion questions were returned. Generate a new briefing to retry."];

  const items = (values) =>
    format === "bullet" ? (
      <ul className="list-disc space-y-2 pl-5 marker:text-primary-light">
        {(values || []).map((value, i) => (
          <li key={i}>{value}</li>
        ))}
      </ul>
    ) : (
      <div className="space-y-3">
        {(values || []).map((value, i) => (
          <p key={i}>{value}</p>
        ))}
      </div>
    );

  async function exportDoc() {
    setErr("");
    try {
      const r = await exportResearch(report.research_id, {});
      window.open(r.document_url, "_blank", "noopener");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <article className="rounded-lg border border-white/[0.08] bg-panel p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary-light">
            MEETING BRIEF
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-[30px]">
            {report.entity_name}
          </h2>
          <p className="mt-1 text-xs capitalize text-muted">
            {report.entity_type} <span className="px-1.5 text-muted/50">·</span>
            {new Date(report.meeting_datetime).toLocaleString()}
          </p>
        </div>
        <FormatToggle value={format} onChange={setFormat} />
      </div>

      <div className="flex flex-wrap items-center gap-2 py-4">
        <span className="rounded-full border border-link-blue/20 bg-link-blue/10 px-3 py-1.5 text-[11px] font-medium text-link-blue">
          Research window
        </span>
        <span className="text-xs text-muted">
          {report.research_period.start} — {report.research_period.end}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-verified/20 bg-verified/10 px-2.5 py-1 text-[10px] font-medium text-verified">
          <ShieldCheck size={12} aria-hidden="true" />
          Source-backed
        </span>
      </div>

      <section className="border-t border-white/[0.08] pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">
          Executive summary
        </h3>
        <div className="space-y-3 text-sm leading-6 text-muted">
          {items(b.executive_summary)}
        </div>
      </section>

      <section className="mt-6 border-t border-white/[0.08] pt-5">
        <h3 className="mb-2 font-display text-sm font-semibold text-ink">
          Recent developments
        </h3>
        {(b.developments || []).map((d, i) => (
          <div
            className="border-b border-white/[0.06] py-4 last:border-b-0"
            key={i}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold capitalize tracking-wide text-primary-light">
                {d.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] capitalize text-muted">
                {d.importance}
              </span>
            </div>
            <h4 className="mt-2 font-display text-sm font-semibold leading-5 text-ink">
              {d.headline}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted">{d.summary}</p>
            {d.meeting_relevance && (
              <p className="mt-2 rounded-md border-l-2 border-primary/60 bg-white/[0.025] px-3 py-2 text-xs leading-5 text-ink/80">
                <span className="font-semibold text-primary-light">
                  Meeting relevance
                </span>
                <span className="px-1.5 text-muted/50">·</span>
                {d.meeting_relevance}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted">
              <span>Sources</span>
              {(d.source_ids || []).map((id) => {
                const source = report.sources.find((item) => item.source_id === id);
                return source ? (
                  <a
                    key={id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-verified/20 bg-verified/10 px-2 py-1 text-verified transition-colors hover:border-verified/40"
                  >
                    {id}
                    <ExternalLink size={10} aria-hidden="true" />
                  </a>
                ) : (
                  <span key={id}>{id}</span>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 border-t border-white/[0.08] pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">
          Meeting insights
        </h3>
        <div className="space-y-3 text-sm leading-6 text-muted">
          {items(meetingInsights)}
        </div>
      </section>

      <section className="mt-6 border-t border-white/[0.08] pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">
          Open questions
        </h3>
        <div className="space-y-3 text-sm leading-6 text-muted">
          {items(discussionQuestions)}
        </div>
      </section>

      {b.caveats?.length > 0 && (
        <section className="mt-6 border-t border-white/[0.08] pt-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink">
            Research caveats
          </h3>
          <div className="space-y-3 text-sm leading-6 text-muted">
            {items(b.caveats)}
          </div>
        </section>
      )}

      <section className="mt-6 border-t border-white/[0.08] pt-5">
        <h3 className="mb-3 font-display text-sm font-semibold text-ink">
          Sources
        </h3>
        <SourceList sources={report.sources} />
      </section>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.08] pt-5">
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
          onClick={exportDoc}
        >
          <FileText size={14} aria-hidden="true" />
          Export Google Doc
        </button>
      </div>
      {err && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-red-400/20 bg-red-400/[0.08] p-3 text-xs leading-5 text-red-200"
        >
          {err}
        </p>
      )}
    </article>
  );
}
