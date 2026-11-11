import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";
import {
  connectGoogleCalendar,
  getCalendarStatus,
  scheduleCalendarEvent,
  startMeetingResearch,
} from "../services/api";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-white/10 bg-[#0e131f] px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none";
const labelClass = "block text-xs font-medium text-ink";

export default function CalendarScheduler() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [form, setForm] = useState({
    title: "",
    entity: "",
    description: "",
    start_time: "",
    end_time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    attendees: "",
  });

  useEffect(() => {
    checkConnection();
    const params = new URLSearchParams(window.location.search);
    if (params.get("calendar") === "connected") {
      setMessage("Google Calendar connected successfully.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function checkConnection() {
    try {
      const result = await getCalendarStatus();
      setConnected(result.connected);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleConnect() {
    setMessage("");
    try {
      await connectGoogleCalendar();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setEventLink("");
    setMeetLink("");

    try {
      if (!connected) {
        throw new Error("Connect your Google Calendar first.");
      }

      const meetingTime = new Date(form.start_time);
      const endTime = new Date(form.end_time);
      if (
        Number.isNaN(meetingTime.getTime()) ||
        Number.isNaN(endTime.getTime()) ||
        endTime <= meetingTime
      ) {
        throw new Error("Please enter valid meeting times.");
      }

      const eventResult = await scheduleCalendarEvent({
        title: form.title,
        description: `${form.description}\n\nResearch subject: ${form.entity}`,
        start_time: `${form.start_time}:00`,
        end_time: `${form.end_time}:00`,
        timezone: form.timezone,
        attendees: form.attendees
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
      });
      setEventLink(eventResult.calendar_link || "");
      setMeetLink(eventResult.meet_link || "");

      await startMeetingResearch({
        entity_name: form.entity,
        entity_type: "company",
        meeting_datetime: meetingTime.toISOString(),
        timezone: form.timezone,
        meeting_context: [form.title, form.description].filter(Boolean).join("\n\n"),
      });
      setMessage("Meeting scheduled and research started successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-white/[0.08] bg-panel p-5 sm:p-7">
      <div className="mb-5 flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-primary-light">
            <CalendarDays size={14} aria-hidden="true" />
            CALENDAR INTEGRATION
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            Schedule a meeting
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Add the event to Google Calendar and start meeting research.
          </p>
        </div>
        {!connected ? (
          <button
            type="button"
            onClick={handleConnect}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-panel-raised px-4 text-xs font-semibold text-ink transition-colors hover:border-primary/50 hover:bg-white/[0.06]"
          >
            Connect Google Calendar
          </button>
        ) : (
          <span className="inline-flex min-h-9 items-center gap-2 self-start rounded-full border border-verified/20 bg-verified/10 px-3 text-xs font-medium text-verified">
            <span className="size-1.5 rounded-full bg-verified" />
            Calendar connected
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="calendar-title">
              Meeting title
            </label>
            <input
              id="calendar-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Product Strategy Discussion"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="calendar-entity">
              Company or person to research
            </label>
            <input
              id="calendar-entity"
              name="entity"
              value={form.entity}
              onChange={handleChange}
              placeholder="e.g. Microsoft or Satya Nadella"
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="calendar-description">
            Meeting description
          </label>
          <textarea
            id="calendar-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add meeting agenda or context..."
            className={`${fieldClass} resize-y`}
            rows="3"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="calendar-start">
              Start time
            </label>
            <input
              id="calendar-start"
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="calendar-end">
              End time
            </label>
            <input
              id="calendar-end"
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="calendar-timezone">
              Time zone
            </label>
            <input
              id="calendar-timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="calendar-attendees">
              Attendees&apos; email addresses
            </label>
            <input
              id="calendar-attendees"
              name="attendees"
              value={form.attendees}
              onChange={handleChange}
              placeholder="person@example.com, team@example.com"
              className={fieldClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!connected || loading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Scheduling and starting research..."
            : "Schedule meeting & start research"}
        </button>
      </form>

      {message && (
        <div
          role="status"
          className={`mt-4 rounded-md border p-3 text-xs leading-5 ${
            message.toLowerCase().includes("successfully")
              ? "border-verified/20 bg-verified/10 text-verified"
              : "border-white/10 bg-panel-raised text-ink/80"
          }`}
        >
          {message}
        </div>
      )}

      {meetLink && (
  <a
    href={meetLink}
    target="_blank"
    rel="noreferrer"
    className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
  >
    Join Google Meet
    <ExternalLink size={13} aria-hidden="true" />
  </a>
)}

    {eventLink && (
      <a
        href={eventLink}
        target="_blank"
        rel="noreferrer"
        className="mt-3 ml-3 inline-flex items-center gap-2 text-xs font-medium text-primary-light hover:text-white"
      >
        View Google Calendar event
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    )}
    </div>
  );
}
