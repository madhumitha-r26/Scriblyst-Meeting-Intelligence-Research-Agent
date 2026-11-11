import { useState } from "react";
import { Building2, Search, UserRound } from "lucide-react";

const fieldClass =
  "mt-2 w-full rounded-md border border-white/10 bg-[#0e131f] px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none";
const labelClass = "block text-xs font-medium text-ink";

export default function MeetingForm({ onSubmit, loading }) {
  const [v, setV] = useState({
    entity_name: "",
    entity_type: "company",
    meeting_datetime: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    meeting_context: "",
  });
  const set = (k, x) => setV((p) => ({ ...p, [k]: x }));

  function submit(e) {
    e.preventDefault();
    if (!v.meeting_datetime) return;
    onSubmit({
      ...v,
      meeting_datetime: new Date(v.meeting_datetime).toISOString(),
    });
  }

  return (
    <form
      className="rounded-lg border border-white/[0.08] bg-panel p-5 sm:p-6"
      onSubmit={submit}
    >
      <div className="mb-5 border-b border-white/[0.08] pb-5">
        <span className="text-[10px] font-bold tracking-[0.15em] text-primary-light">
          NEW RESEARCH
        </span>
        <h2 className="mt-2 font-display text-lg font-semibold text-ink">
          Prepare for a meeting
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted">
          Recent intelligence, ready before you meet.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="entity-name">
            Meeting Title
          </label>
          <input 
            id="entity-name"
            className={fieldClass}
            required
            minLength="2"
            placeholder="Company or person's name"
            value={v.entity_name}
            onChange={(e) => set("entity_name", e.target.value)}
          />
        </div>

        {/* <fieldset>
          <legend className={labelClass}>Entity type</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={v.entity_type === "company"}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors ${
                v.entity_type === "company"
                  ? "border-primary/60 bg-primary/15 text-primary-light"
                  : "border-white/10 bg-[#0e131f] text-muted hover:border-white/20 hover:text-ink"
              }`}
              onClick={() => set("entity_type", "company")}
            >
              <Building2 size={15} aria-hidden="true" />
              Company
            </button>
            <button
              type="button"
              aria-pressed={v.entity_type === "person"}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors ${
                v.entity_type === "person"
                  ? "border-primary/60 bg-primary/15 text-primary-light"
                  : "border-white/10 bg-[#0e131f] text-muted hover:border-white/20 hover:text-ink"
              }`}
              onClick={() => set("entity_type", "person")}
            >
              <UserRound size={15} aria-hidden="true" />
              Person
            </button>
          </div>
        </fieldset> */}

        <div>
          <label className={labelClass} htmlFor="meeting-datetime">
            Meeting Date and Time
          </label>
          <input
            id="meeting-datetime"
            className={fieldClass}
            type="datetime-local"
            required
            value={v.meeting_datetime}
            onChange={(e) => set("meeting_datetime", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="meeting-timezone">
            Time zone
          </label>
          <input
            id="meeting-timezone"
            className={fieldClass}
            required
            value={v.timezone}
            onChange={(e) => set("timezone", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="meeting-context">
            Meeting objective <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="meeting-context"
            className={`${fieldClass} resize-y`}
            rows="3"
            placeholder="Partnership discussion, investor meeting..."
            value={v.meeting_context}
            onChange={(e) => set("meeting_context", e.target.value)}
          />
        </div>
      </div>

      <button
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        <Search size={16} aria-hidden="true" />
        {loading ? "Researching..." : "Generate briefing"}
      </button>
      <p className="mt-3 text-center text-[10px] leading-4 text-muted">
        Research covers the 30 days ending at your scheduled meeting time.
      </p>
    </form>
  );
}
