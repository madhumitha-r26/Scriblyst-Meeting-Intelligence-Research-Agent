import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MeetingForm from "../components/MeetingForm";
import ChatAssistant from "../components/ChatAssistant";
import ResearchReport from "../components/ResearchReport";
import { createResearch } from "../services/api";
import { logoutUser } from "../services/auth";
import CalendarScheduler from "../components/CalendarScheduler";


export default function Dashboard() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);

  async function run(payload) {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      setReport(await createResearch(payload));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <header className="flex min-h-[76px] items-center gap-3 border-b border-white/[0.08]">
          
          <div>
            <p className="font-display text-[15px] font-bold tracking-tight uppercase text-ink">
              Scriblyst
            </p>
            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.16em] text-muted">
             AI MEETING INTELLIGENCE
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-verified/20 bg-verified/10 px-3 py-1.5 text-xs font-medium text-verified sm:flex">
             
              Source-backed research
            </div>

            

           
            <button
              type="button"
              onClick={() => {
                logoutUser();
                navigate("/login", { replace: true });
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-panel-raised px-3 text-xs font-semibold text-ink transition-colors hover:border-primary/50 hover:bg-white/[0.06] sm:px-4"
            >
              <LogOut size={15} aria-hidden="true" />
              <span>Logout</span>
            </button>


          </div>
        </header>

        {showScheduler && (
          <section className="border-b border-white/[0.08] py-6 sm:py-8">
            <CalendarScheduler />
          </section>
        )}

        <main className="pb-10">
          <section className="flex flex-col gap-5 py-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-primary-light">
                <span className="size-1.5 rounded-full bg-primary-light" />
                MEETING PREPARATION WORKSPACE
              </div>
              <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.04em] text-ink sm:text-[40px]">
                Walk in{" "}
                <span className="text-primary-light">well informed.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                Turn recent company and people developments into a focused,
                source-backed briefing for your next conversation.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted">
              <FileText size={15} className="text-link-blue" aria-hidden="true" />
              Research window: 30 days
            </div>

             <button
              type="button"
              onClick={() => setShowScheduler((shown) => !shown)}
              aria-expanded={showScheduler}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-panel-raised px-3 text-xs font-semibold text-ink transition-colors hover:border-primary/50 hover:bg-white/[0.06] sm:px-4"
            >
              <CalendarDays size={15} aria-hidden="true" />
              <span className="hidden sm:inline">
                {showScheduler ? "Close scheduler" : "Schedule meeting"}
              </span>
              <span className="sm:hidden">Schedule</span>
            </button>
          </div>
          </section>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">
            <aside className="lg:col-span-4 xl:col-span-4">
              <MeetingForm onSubmit={run} loading={loading} />
              {report && !loading && (
                <ChatAssistant
                  key={report.research_id}
                  researchId={report.research_id}
                />
              )}
            </aside>

            <section
              className="min-w-0 lg:col-span-8 xl:col-span-8"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading && (
                <div className="flex min-h-[480px] flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-panel px-6 text-center">
                  <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary-light">
                    <span className="size-6 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-primary-light/20 border-t-primary-light" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-link-blue">
                    RESEARCH IN PROGRESS
                  </span>
                  <h2 className="mt-3 font-display text-xl font-semibold text-ink">
                    Building your briefing
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                    Searching recent developments and preparing a source-backed
                    summary. This may take a moment.
                  </p>
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-400/20 bg-red-400/[0.08] p-4 text-sm leading-6 text-red-200"
                >
                  {error}
                </div>
              )}
              {!loading && !error && !report && (
                <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.08] bg-panel p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border border-primary/10"
                  >
                    <div className="absolute inset-8 rounded-full border border-primary/10" />
                    <div className="absolute inset-16 rounded-full border border-primary/10" />
                  </div>
                  <div className="relative max-w-lg">
                    <div className="mb-6 grid size-12 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary-light">
                      <Sparkles size={22} aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-muted">
                      EXECUTIVE BRIEFING
                    </span>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[28px]">
                      Your meeting context, all in one place.
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                      Add who you&apos;re meeting and when. Your briefing will
                      bring together recent developments, useful questions, and
                      the sources behind them.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-verified/20 bg-verified/10 px-3 py-1.5 text-[11px] font-medium text-verified">
                      <span className="size-1.5 rounded-full bg-verified" />
                      Sources included with every brief
                    </div>
                  </div>
                  <div className="relative mt-10 grid gap-3 border-t border-white/[0.08] pt-5 sm:grid-cols-3">
                    {[
                      ["01", "Recent developments"],
                      ["02", "Meeting insights"],
                      ["03", "Cited sources"],
                    ].map(([number, label]) => (
                      <div key={number} className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-primary-light">
                          {number}
                        </span>
                        <span className="text-xs text-muted">{label}</span>
                        <ArrowUpRight
                          size={13}
                          className="ml-auto text-muted/60"
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report && !loading && <ResearchReport report={report} />}
            </section>
          </div>
        </main>

        <footer className="flex flex-col gap-2 border-t border-white/[0.08] py-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Scriblyst · Meeting Intelligence Agent</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-verified" aria-hidden="true" />
            Research with source context
          </span>
        </footer>
      </div>
    </div>
  );
}
