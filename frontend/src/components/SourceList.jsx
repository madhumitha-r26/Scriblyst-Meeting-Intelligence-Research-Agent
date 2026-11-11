import { ExternalLink } from "lucide-react";

export default function SourceList({ sources = [] }) {
  if (!sources.length) {
    return <p className="text-xs leading-5 text-muted">No sources available.</p>;
  }

  return (
    <ol className="space-y-2">
      {sources.map((source) => (
        <li
          key={source.source_id}
          className="rounded-md border border-white/[0.06] bg-[#0e131f] px-3 py-2.5"
        >
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-start gap-2 text-xs font-medium leading-5 text-primary-light transition-colors hover:text-white"
          >
            <span>{source.title}</span>
            <ExternalLink
              size={12}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
          </a>
          <small className="mt-1 block text-[10px] text-muted">
            {source.published_date || "Date unavailable"} · {source.source_id}
          </small>
        </li>
      ))}
    </ol>
  );
}
