import { useState } from "react";
import { Bot, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askResearch } from "../services/api";

const markdownComponents = {
  a({ href, children }) {
    if (!/^https?:\/\//i.test(href || "")) return <>{children}</>;
    return (
      <a
        className="text-link-blue underline hover:text-primary-light"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-2 border-l-2 border-primary/50 pl-3 text-muted">
        {children}
      </blockquote>
    );
  },
  h1({ children }) {
    return <h1 className="my-2 text-sm font-bold text-ink">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="my-2 text-sm font-semibold text-ink">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="my-2 text-xs font-semibold text-ink">{children}</h3>;
  },
  li({ children }) {
    return <li className="pl-0.5">{children}</li>;
  },
  ol({ children }) {
    return <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>;
  },
  p({ children }) {
    return <p className="my-2 whitespace-pre-wrap last:mb-0">{children}</p>;
  },
  pre({ children }) {
    return (
      <pre className="my-2 overflow-x-auto rounded bg-black/20 p-2 text-[11px]">
        {children}
      </pre>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-ink">{children}</strong>;
  },
  ul({ children }) {
    return <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>;
  },
};

export default function ChatAssistant({ researchId }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!q.trim() || busy) return;
    const question = q.trim();
    setQ("");
    setItems((previous) => [...previous, { role: "You", text: question }]);
    setBusy(true);
    try {
      const result = await askResearch(researchId, question);
      setItems((previous) => [
        ...previous,
        { role: "Assistant", text: result.answer, sources: result.sources },
      ]);
    } catch (err) {
      setItems((previous) => [
        ...previous,
        { role: "Assistant", text: err.message },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-5 rounded-lg border border-white/[0.08] bg-panel p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
        <Bot size={16} className="text-primary-light" aria-hidden="true" />
        RAG research assistant
      </h3>
      <p className="mt-1 text-xs leading-5 text-muted">
        Ask follow-up questions about your meeting briefing.
      </p>
      <div className="mt-4 max-h-64 space-y-2 overflow-auto">
        {items.map((message, i) => (
          <div
            className="rounded-md border border-white/[0.06] bg-[#0e131f] p-3"
            key={i}
          >
            <b className="text-[10px] font-semibold text-primary-light">
              {message.role}
            </b>
            <div className="mt-1 text-xs leading-5 text-ink/80">
              {message.role === "Assistant" ? (
                <ReactMarkdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
            {message.sources?.length > 0 && (
              <div className="mt-3 space-y-1 border-t border-white/[0.06] pt-2">
                <span className="block text-[10px] font-semibold text-muted">
                  Sources used
                </span>
                {message.sources.map((source) =>
                  /^https?:\/\//i.test(source.url) ? (
                    <a
                      className="block text-[11px] leading-5 text-link-blue hover:underline"
                      href={source.url}
                      key={source.source_id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      [{source.source_id}] {source.title}
                    </a>
                  ) : (
                    <span
                      className="block text-[11px] leading-5 text-muted"
                      key={source.source_id}
                    >
                      [{source.source_id}] {source.title}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <p className="text-xs text-muted" role="status">
            Thinking...
          </p>
        )}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={submit}>
        <input
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-[#0e131f] px-3 py-2.5 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Ask a question about this research"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busy || !q.trim()}
          aria-label="Send question"
        >
          <Send size={14} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
