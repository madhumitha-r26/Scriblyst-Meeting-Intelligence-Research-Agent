import { AlignLeft, List } from "lucide-react";

export default function FormatToggle({ value, onChange }) {
  return (
    <div
      className="flex w-fit gap-1 rounded-md border border-white/[0.08] bg-[#0e131f] p-1"
      aria-label="Brief display format"
    >
      <button
        type="button"
        aria-pressed={value === "bullet"}
        className={`inline-flex min-h-8 items-center gap-1.5 rounded px-2.5 text-[11px] font-medium transition-colors ${
          value === "bullet"
            ? "bg-panel-raised text-primary-light"
            : "text-muted hover:text-ink"
        }`}
        onClick={() => onChange("bullet")}
      >
        <List size={14} aria-hidden="true" />
        Bullets
      </button>
      <button
        type="button"
        aria-pressed={value === "paragraph"}
        className={`inline-flex min-h-8 items-center gap-1.5 rounded px-2.5 text-[11px] font-medium transition-colors ${
          value === "paragraph"
            ? "bg-panel-raised text-primary-light"
            : "text-muted hover:text-ink"
        }`}
        onClick={() => onChange("paragraph")}
      >
        <AlignLeft size={14} aria-hidden="true" />
        Paragraphs
      </button>
    </div>
  );
}
