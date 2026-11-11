import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Circle,
  CircleHelp,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  List,
  LogIn,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserPlus,
  Video,
} from "lucide-react";

import scriblyst from "../assets/scriblyst.png";

const presets = [
  "Anthropic (Dario Amodei)",
  "Databricks (Ali Ghodsi)",
  "Stripe (Patrick Collison)",
];

const features = [
  {
    number: "01",
    tag: "TAVILY ENGINE",
    icon: "travel_explore",
    color: "text-[#c3c0ff] bg-[#4f46e5]/20 border-[#c3c0ff]/30",
    title: "30-Day Web Research via Tavily API",
    description:
      "Takes company or person input and autonomously gathers the past 30 days of verified news, hires, launches, and regulatory developments with live source links.",
    footer: "Strict T-30 temporal filter",
    footerIcon: "verified",
  },
  {
    number: "02",
    tag: "MULTI-FORMAT",
    icon: "tune",
    color: "text-[#4edea3] bg-[#006e4b]/20 border-[#4edea3]/30",
    title: "Concise Briefing & Format Switcher",
    description:
      "Toggle output dynamically between rapid Bullet List format and structured Paragraph narrative format to match your executive reading style in real time.",
    footer: "Bullets or Narrative prose",
    footerIcon: "swap_horiz",
  },
  {
    number: "03",
    tag: "CITATIONS & PROMPTS",
    icon: "quick_reference_all",
    color: "text-[#b4c5ff] bg-[#0053db]/20 border-[#b4c5ff]/30",
    title: "Source Attribution & Open Questions",
    description:
      "Verifiable citations for every factual claim, paired with auto-generated strategic open questions and high-impact talking points tailored for the scheduled meeting.",
    footer: "Hyperlinked source proofs",
    footerIcon: "quiz",
  },
  {
    number: "04",
    tag: "INTERACTIVE Q&A",
    icon: "forum",
    color: "text-[#c3c0ff] bg-[#4f46e5]/20 border-[#c3c0ff]/30",
    title: "Briefing Q&A Intel Bot",
    description:
      "Interactive AI assistant to ask instant clarifying questions directly against the generated briefing and synthesized 30-day web intelligence findings.",
    footer: "Context-aware conversational agent",
    footerIcon: "smart_toy",
  },
  {
    number: "05",
    tag: "ONE-CLICK EXPORT",
    icon: "description",
    color: "text-[#4edea3] bg-[#006e4b]/20 border-[#4edea3]/30",
    title: "Google Docs Export",
    description:
      "1-click export to automatically format and generate clean, structured research summaries in Google Docs ready to share with teams and executive stakeholders.",
    footer: "Direct Google Workspace sync",
    footerIcon: "download_done",
  },
  {
    number: "06",
    tag: "BIFROST & CALENDAR",
    icon: "video_camera_front",
    color: "text-[#b4c5ff] bg-[#0053db]/20 border-[#b4c5ff]/30",
    title: "Bifrost Integration & Calendar Sync",
    description:
      "Connects scheduled meetings via Google Calendar and bridges the briefing notes directly into Google Meet via the Bifrost companion.",
    footer: "Google Meet Integration",
    footerIcon: "sync_alt",
  },
];

const developments = [
  {
    icon: "verified",
    title: "Enterprise API Scale & Claude 3.5 Sonnet",
    date: "5 days ago",
    description:
      "Anthropic doubled Tier-4 enterprise throughput guarantees and announced zero data retention terms for regulated banking sectors.",
    source: "Bloomberg Technology",
    note: "Verified Oct 18",
  },
  {
    icon: "developer_board",
    title: "AWS & Trainium Compute Cluster Expansion",
    date: "12 days ago",
    description:
      "Amodei reiterated focus on lowering cross-region latency overhead with dedicated hardware commitments during private tech summit.",
    source: "TechCrunch Enterprise",
    note: "SEC Addendum",
  },
];

const iconMap = {
  neurology: BrainCircuit,
  arrow_forward: ArrowRight,
  person_add: UserPlus,
  login: LogIn,
  arrow_downward: ArrowDown,
  smart_toy: Bot,
  tune: SlidersHorizontal,
  business_center: BriefcaseBusiness,
  sync: RefreshCw,
  calendar_today: CalendarDays,
  format_list_bulleted: List,
  article: FileText,
  refresh: LoaderCircle,
  check: Check,
  travel_explore: Search,
  description: FileText,
  check_circle: BadgeCheck,
  verified: BadgeCheck,
  link: ExternalLink,
  help_center: CircleHelp,
  arrow_upward: ArrowUp,
  swap_horiz: ArrowLeftRight,
  quick_reference_all: BookOpenCheck,
  quiz: CircleHelp,
  forum: MessageCircle,
  developer_board: Cpu,
  download_done: Download,
  video_camera_front: Video,
  sync_alt: RefreshCw,
};

function Icon({ children, className = "" }) {
  const iconName = typeof children === "string" ? children.trim() : "";
  const LucideIcon = iconMap[iconName] || Circle;

  return (
    <LucideIcon
      className={`inline-block h-[1em] w-[1em] shrink-0 align-middle ${className}`}
      aria-hidden="true"
      strokeWidth={1.8}
    />
  );
}

export default function Home() {
  const [target, setTarget] = useState(presets[0]);
  const [format, setFormat] = useState("bullet");
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [question, setQuestion] = useState("");

  const runResearch = () => {
    if (!target.trim() || isResearching) return;
    setIsResearching(true);
    setResearchComplete(false);

    // Replace this demo timeout with your backend/Tavily API request.
    window.setTimeout(() => {
      setIsResearching(false);
      setResearchComplete(true);
    }, 800);
  };

  const previewName = target.trim() || "Custom Target";

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] antialiased">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#262a35]/70 bg-[#0f131d]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="/" className="group flex items-center gap-2">
            <span className="font-['Plus_Jakarta_Sans'] uppercase text-xl font-bold tracking-tight">
              Scriblyst
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-[#c7c4d8] md:flex">
            <a className="transition hover:text-white" href="#research-console">
              Console
            </a>
            <a className="transition hover:text-white" href="#core-features">
              Core Features
            </a>
            <a className="transition hover:text-white" href="#how-it-works">
              Architecture
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="rounded-lg px-4 py-2 text-sm text-[#c7c4d8] transition hover:bg-[#262a35] hover:text-white"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-[#dad7ff] shadow-lg shadow-indigo-900/30 transition hover:bg-[#4d44e3]"
            >
              Get Started Free <Icon className="text-base">arrow_forward</Icon>
            </NavLink>
          </div>
        </div>
      </header>

      <main className="bg-[#0f131d] pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#262a35]/60 px-5 py-16 lg:px-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 -z-0 h-[360px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#464555]/70 bg-[#262a35] px-3 py-1.5 font-mono text-[11px] text-[#c3c0ff]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4edea3]" />
              Autonomous Pre-Meeting Intelligence Engine
              <span className="text-[#918fa1]">•</span>
              <span className="text-[#c7c4d8]">
                T-30 Day Hard Temporal Filter
              </span>
            </div>
            <h1 className="mb-5 font-['Plus_Jakarta_Sans'] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              AI-Powered Pre-Meeting
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#c3c0ff] via-[#dad7ff] to-[#b4c5ff] bg-clip-text text-transparent">
                Research Agent
              </span>
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-7 text-[#c7c4d8] sm:text-lg">
              Input any{" "}
              <strong className="text-white">Company or Person</strong> and
              scheduled meeting time. Scriblyst autonomously gathers,
              cross-verifies, and synthesizes a{" "}
              <strong className="text-white">
                concise, source-backed 30-day briefing
              </strong>{" "}
              before you enter the room.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <NavLink
                to="/register"
                className="flex h-11 items-center gap-2 rounded-lg bg-[#4f46e5] px-6 text-sm font-semibold text-[#dad7ff] shadow-lg shadow-indigo-900/30 transition hover:bg-[#4d44e3]"
              >
                <Icon>person_add</Icon> Register Free
              </NavLink>
              <NavLink
                to="/login"
                className="flex h-11 items-center gap-2 rounded-lg bg-[#262a35] px-5 text-sm text-white transition hover:bg-[#353944]"
              >
                <Icon className="text-[#c3c0ff]">login</Icon> Log In
              </NavLink>
              <a
                href="#research-console"
                className="flex h-11 items-center gap-1 rounded-lg px-3 text-sm text-[#c7c4d8] transition hover:text-white"
              >
                Try Interactive Console{" "}
                <Icon className="text-base">arrow_downward</Icon>
              </a>
            </div>
          </div>
        </section>

        {/* Research console */}
        <section
          id="research-console"
          className="border-b border-[#262a35]/60 bg-[#0a0e18]/40 px-5 py-24 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-7">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div>
                <div className="mb-1 flex items-center gap-1.5 font-mono text-xs text-[#c3c0ff]">
                  <Icon className="text-base">smart_toy</Icon>
                  LIVE_DISCOVERY_CONSOLE // POWERED BY TAVILY
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold">
                  Target Input &amp; Briefing Generator
                </h2>
              </div>
              <p className="max-w-md text-xs leading-5 text-[#c7c4d8]">
                Test the research engine live. Configure target parameters,
                format preference, and trigger real-time 30-day reconnaissance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Inputs */}
              <div className="flex flex-col justify-between gap-6 rounded-xl border border-[#313540] bg-[#1c1f2a] p-6 shadow-xl lg:col-span-5">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[#313540] pb-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <Icon className="text-[#c3c0ff]">tune</Icon> Input
                      Parameters
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs text-[#4edea3]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3]" />{" "}
                      Tavily Connected
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="targetInput"
                      className="flex justify-between text-sm font-medium"
                    >
                      Target: Company or Person{" "}
                      <span className="font-mono text-xs text-[#918fa1]">
                        Required
                      </span>
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-3 text-lg text-[#918fa1]">
                        business_center
                      </Icon>
                      <input
                        id="targetInput"
                        value={target}
                        onChange={(e) => {
                          setTarget(e.target.value);
                          setResearchComplete(false);
                        }}
                        className="h-11 w-full rounded-lg border border-[#464555] bg-[#0a0e18] pl-10 pr-3 text-sm text-white outline-none transition focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff]"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-semibold text-[#918fa1]">
                        Quick Presets:
                      </span>
                      {presets.map((preset, index) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setTarget(preset);
                            setResearchComplete(false);
                          }}
                          className="rounded bg-[#262a35] px-2 py-1 font-mono text-[11px] text-[#c3c0ff] transition hover:bg-[#353944]"
                        >
                          {["Anthropic", "Databricks", "Stripe"][index]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="meetingTime"
                      className="flex justify-between text-sm font-medium"
                    >
                      Scheduled Meeting Time{" "}
                      <span className="flex items-center gap-1 font-mono text-xs text-[#4edea3]">
                        <Icon className="text-sm">sync</Icon> G-Cal Synced
                      </span>
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-3 text-lg text-[#918fa1]">
                        calendar_today
                      </Icon>
                      <input
                        id="meetingTime"
                        defaultValue="Today, 2:30 PM EST (in 1h 45m)"
                        className="h-11 w-full rounded-lg border border-[#464555] bg-[#0a0e18] pl-10 pr-3 text-sm text-white outline-none focus:border-[#c3c0ff] focus:ring-1 focus:ring-[#c3c0ff]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">
                      Output Format Selector
                    </span>
                    <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#464555] bg-[#0a0e18] p-1">
                      <button
                        type="button"
                        onClick={() => setFormat("bullet")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded text-sm transition ${format === "bullet" ? "bg-[#313540] font-semibold text-white shadow" : "text-[#c7c4d8] hover:text-white"}`}
                      >
                        <Icon className="text-base text-[#c3c0ff]">
                          format_list_bulleted
                        </Icon>{" "}
                        Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormat("paragraph")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded text-sm transition ${format === "paragraph" ? "bg-[#313540] font-semibold text-white shadow" : "text-[#c7c4d8] hover:text-white"}`}
                      >
                        <Icon className="text-base">article</Icon> Paragraph
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-[#313540] pt-5">
                  <button
                    type="button"
                    onClick={runResearch}
                    disabled={isResearching || !target.trim()}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] text-sm font-semibold text-[#dad7ff] shadow-lg shadow-indigo-900/25 transition hover:bg-[#4d44e3] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Icon className={isResearching ? "animate-spin" : ""}>
                      {isResearching
                        ? "refresh"
                        : researchComplete
                          ? "check"
                          : "travel_explore"}
                    </Icon>
                    {isResearching
                      ? "Gathering 30-Day Sources..."
                      : researchComplete
                        ? "Briefing Fresh & Grounded"
                        : "Run 30-Day Research (Tavily)"}
                  </button>
                  <div className="flex justify-between px-1 text-[10px] text-[#918fa1]">
                    <span>Hard cutoff: Past 30 days only</span>
                    <span className="text-[#4edea3]">
                      14 public sources indexed
                    </span>
                  </div>
                  {researchComplete && (
                    <p className="text-xs text-[#4edea3]" role="status">
                      Demo complete. Connect your backend to fetch live research
                      results.
                    </p>
                  )}
                </div>
              </div>

              {/* Briefing preview */}
              <div className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#313540] bg-[#1c1f2a] shadow-xl lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#464555] bg-[#262a35] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded border border-[#c3c0ff]/30 bg-[#4f46e5]/30 font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#c3c0ff]">
                      {previewName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{previewName}</h3>
                        <span className="rounded-full bg-[#1c1f2a] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#4edea3]">
                          T-30 Briefing
                        </span>
                      </div>
                      <p className="text-xs text-[#c7c4d8]">
                        Scheduled Call @ 2:30 PM EST • Generated via Tavily API
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 items-center gap-1.5 rounded border border-[#464555] bg-[#1c1f2a] px-2.5 text-xs transition hover:bg-[#353944]"
                  >
                    <Icon className="text-sm text-[#4edea3]">description</Icon>{" "}
                    Google Docs
                  </button>
                </div>

                <div className="max-h-[380px] flex-1 space-y-4 overflow-y-auto p-6">
                  {format === "bullet" ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#918fa1]">
                          Verified 30-Day Developments
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#4edea3]">
                          <Icon className="text-sm">check_circle</Icon> Zero
                          Hallucination Filter
                        </span>
                      </div>
                      {developments.map((item) => (
                        <article
                          key={item.title}
                          className="flex flex-col gap-2 rounded-lg border border-[#464555]/50 bg-[#171b26] p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <Icon className="text-lg text-[#c3c0ff]">
                                {item.icon}
                              </Icon>
                              {item.title}
                            </div>
                            <span className="font-mono text-[11px] text-[#918fa1]">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-[#c7c4d8]">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                            <span className="flex items-center gap-1 text-[#4edea3] underline">
                              <Icon className="text-xs">link</Icon>
                              {item.source}
                            </span>
                            <span className="text-[#918fa1]">
                              • {item.note}
                            </span>
                          </div>
                        </article>
                      ))}
                      <div className="flex flex-col gap-2 rounded-lg border border-[#c3c0ff]/20 bg-[#262a35] p-4">
                        <div className="flex items-center gap-1.5 font-semibold text-[#b4c5ff]">
                          <Icon>help_center</Icon> Strategic Open Questions for
                          Dario
                        </div>
                        <ol className="space-y-2 text-sm text-[#dfe2f1]">
                          <li className="flex gap-2">
                            <span className="font-bold text-[#c3c0ff]">1.</span>
                            <span>
                              "How do the recent zero-retention compliance tiers
                              affect latency benchmarks for custom agent
                              deployments?"
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold text-[#c3c0ff]">2.</span>
                            <span>
                              "Given your Trainium compute commitments, what
                              timeline should our infrastructure team anticipate
                              for multi-region failover?"
                            </span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#918fa1]">
                          Executive Narrative Flow
                        </span>
                        <span className="font-mono text-[11px] text-[#4edea3]">
                          Continuous Prose Synthesis
                        </span>
                      </div>
                      <div className="space-y-3 rounded-lg border border-[#464555]/50 bg-[#171b26] p-4 text-sm leading-7 text-[#c7c4d8]">
                        <p>
                          Across the preceding 30-day window,{" "}
                          <strong className="text-white">Anthropic</strong>{" "}
                          under CEO Dario Amodei has pivoted aggressively toward
                          enterprise-grade sovereignty guarantees. The company
                          expanded Tier-4 API throughput significantly while
                          introducing strict zero-retention compliance policies
                          targeted directly at Fortune 100 financial
                          institutions.
                        </p>
                        <p>
                          Simultaneously, infrastructure commitments around
                          secondary Trainium compute clusters have accelerated
                          to minimize cross-region latency. In discussions with
                          Dario, focus immediately on the architectural
                          implications of these zero-retention tiers and the
                          projected deployment roadmap for private enterprise
                          tenants.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (question.trim()) {
                      /* Connect this to your briefing Q&A endpoint. */ setQuestion(
                        "",
                      );
                    }
                  }}
                  className="flex items-center gap-2 border-t border-[#464555] bg-[#262a35] p-2"
                >
                  <Icon className="pl-1 text-lg text-[#c3c0ff]">smart_toy</Icon>
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask Intel Bot about recent comments..."
                    className="h-9 min-w-0 flex-1 rounded border border-[#464555] bg-[#0a0e18] px-3 text-xs text-white outline-none placeholder:text-[#918fa1] focus:border-[#c3c0ff]"
                  />
                  <button
                    type="submit"
                    className="flex h-9 items-center gap-1 rounded bg-[#4f46e5] px-3 text-xs font-semibold text-[#dad7ff] transition hover:bg-[#4d44e3]"
                  >
                    Ask <Icon className="text-sm">arrow_upward</Icon>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="core-features" className="px-5 py-16 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c3c0ff]">
                Zero Fluff Architecture
              </span>
              <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-2xl font-semibold">
                Core Intelligence Capabilities
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#c7c4d8]">
                Everything you need for authoritative pre-meeting intelligence,
                deterministically grounded in verified recent history.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className="group flex flex-col justify-between rounded-xl border border-[#313540] bg-[#1c1f2a] p-6 transition hover:border-[#c3c0ff]/40"
                >
                  <div className="flex flex-col gap-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${feature.color}`}
                    >
                      <Icon className="text-[26px]">{feature.icon}</Icon>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] text-[#4edea3]">
                        FEATURE {feature.number} // {feature.tag}
                      </span>
                      <h3 className="mb-2 mt-1 font-['Plus_Jakarta_Sans'] text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-6 text-[#c7c4d8]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[#313540] pt-4 text-[11px] font-semibold text-[#918fa1]">
                    <span>{feature.footer}</span>
                    <Icon className="text-lg text-[#c3c0ff]">
                      {feature.footerIcon}
                    </Icon>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section
          id="how-it-works"
          className="border-y border-[#262a35]/60 bg-[#0a0e18]/50 px-5 py-16 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-7">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c3c0ff]">
                  Linear Flow
                </span>
                <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-2xl font-semibold">
                  From Calendar Event to Grounded Briefing
                </h2>
              </div>
              <span className="font-mono text-xs text-[#c7c4d8]">
                Deterministic 3-Stage Pipeline
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                [
                  "01",
                  "Target Ingestion",
                  "Calendar event detects participant or company name 2 hours prior to scheduled meeting, or you input the target on-demand.",
                ],
                [
                  "02",
                  "Tavily 30-Day Crawl",
                  "Tavily autonomous search queries strictly query live web articles, press, and filings from the trailing 30 days, filtering out older rehashed news.",
                ],
                [
                  "03",
                  "Brief & Live Bridge",
                  "Synthesized briefing is exported to Google Docs or delivered via Bifrost companion alongside your video call for instant fact-checking.",
                ],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="flex flex-col gap-3 rounded-xl border border-[#313540] bg-[#1c1f2a] p-6"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f46e5] font-mono text-sm font-bold text-[#dad7ff]">
                    {number}
                  </div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm leading-6 text-[#c7c4d8]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#262a35]/60 px-5 py-16 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-2xl border border-[#313540] bg-[#1c1f2a] p-8 text-center shadow-xl md:p-10">
            <div className="flex h-24 w-24 items-center justify-center">
              <img
                src={scriblyst}
                alt="Scriblyst"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold">
                Ready to brief your next meeting?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#c7c4d8]">
                Get instant access to autonomous 30-day research powered by
                Tavily and Bifrost.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <NavLink
                to="/register"
                className="flex h-10 items-center gap-1.5 rounded-lg bg-[#4f46e5] px-5 text-sm font-semibold text-[#dad7ff] transition hover:bg-[#4d44e3]"
              >
                Register Free Account{" "}
                <Icon className="text-base">arrow_forward</Icon>
              </NavLink>
              <NavLink
                to="/login"
                className="flex h-10 items-center rounded-lg bg-[#262a35] px-4 text-sm transition hover:bg-[#353944]"
              >
                Log In
              </NavLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#262a35]/60 bg-[#0a0e18] px-5 py-7 text-[#c7c4d8] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center">
                <img
                  src={scriblyst}
                  alt="Scriblyst"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white uppercase">
                Scriblyst
              </span>
            </div>
            <span className="text-[#464555]">•</span>
            <span className="text-xs text-[#918fa1]">
              Autonomous Pre-Meeting Research
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <NavLink to="/login" className="transition hover:text-white">
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="text-[#c3c0ff] transition hover:text-white"
            >
              Register
            </NavLink>
            <span className="text-[#464555]">•</span>
            <a href="#" className="transition hover:text-white">
              API &amp; Tavily
            </a>
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
