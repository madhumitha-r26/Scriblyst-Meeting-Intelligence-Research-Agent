import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  ChevronDown,
  Circle,
  Eye,
  EyeOff,
  UserRound,
  ShieldCheck,
} from "lucide-react";

/**
 * Scriblyst registration page.
 *
 * Tailwind CSS and lucide-react are required.
 * Pass an onRegister callback to connect the form to your registration API.
 */
export default function Register({ onRegister, backHref = "/" }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [connectCalendar, setConnectCalendar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordRules = useMemo(
    () => ({
      hasLength: password.length >= 8,
      hasSpecialAndNumber:
        /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passwordStrength =
    (password.length > 0 ? 20 : 0) +
    (passwordRules.hasLength ? 40 : 0) +
    (passwordRules.hasSpecialAndNumber ? 40 : 0);

  const strengthColor =
    passwordStrength <= 30
      ? "bg-[#ffb4ab]"
      : passwordStrength <= 70
        ? "bg-[#b4c5ff]"
        : "bg-[#4edea3]";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!acceptTerms) return;

    if (!onRegister) {
      setError(
        "Registration is not available right now. Please try again later.",
      );
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await onRegister({
        fullName,
        email,
        company,
        role,
        password,
        acceptTerms,
        connectCalendar,
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] antialiased selection:bg-[#4f46e5] selection:text-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.04] bg-[#0f131d]/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
          <NavLink
            to="/"
            className="group flex items-center gap-2"
            aria-label="Scriblyst home"
          >
           
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold uppercase tracking-tight text-[#dfe2f1]">
              Scriblyst
            </span>
          </NavLink>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden items-center gap-2 rounded-full bg-[#171b26] px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4edea3]" />
              <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider text-[#c7c4d8]">
                Bifrost Engine Online
              </span>
            </div>
            <NavLink
              to={backHref}
              className="flex items-center gap-2 font-['Inter'] text-xs font-medium text-[#c7c4d8] transition-colors hover:text-[#dfe2f1]"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Back to Platform</span>
              <span className="sm:hidden">Back</span>
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex min-h-screen w-full flex-col justify-between bg-[#0f131d] pt-16">
        <section className="relative flex w-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4f46e5]/20 via-[#0053db]/10 to-transparent blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-[420px] w-[420px] rounded-full bg-[#006e4b]/10 blur-[140px]" />
          <div className="pointer-events-none absolute -left-20 top-1/3 h-[380px] w-[380px] rounded-full bg-[#c3c0ff]/5 blur-[100px]" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:gap-10">
            {/* Registration card */}
            <div className="w-full max-w-xl">
              <div className="flex flex-col gap-6 rounded-xl bg-[#171b26] p-5 shadow-xl sm:p-7">
                <div className="flex flex-col gap-1">
                  <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-[#dfe2f1]">
                    Create Your Scriblyst Account
                  </h1>
                  <p className="font-['Inter'] text-xs leading-5 text-[#c7c4d8]">
                    Begin preparing for executive meetings with autonomous
                    30-day verified intelligence.
                  </p>
                </div>

                {/* SSO quick actions are omitted because the source did not provide action details. */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#313540]" />
                  <span className="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider text-[#918fa1]">
                    Account details
                  </span>
                  <div className="h-px flex-1 bg-[#313540]" />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Full name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="reg-name"
                      className="font-['Inter'] text-xs font-medium text-[#dfe2f1]"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="reg-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Evelyn Vance"
                        className="h-11 w-full rounded-lg bg-[#1c1f2a] px-4 pr-11 font-['Inter'] text-sm text-[#dfe2f1] outline-none transition-colors placeholder:text-[#c7c4d8]/60 focus:bg-[#262a35] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                      <UserRound
                        size={20}
                        className="pointer-events-none absolute right-3 top-2.5 text-[#c7c4d8]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="reg-email"
                        className="font-['Inter'] text-xs font-medium text-[#dfe2f1]"
                      >
                        Email Address
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="evelyn@company.com"
                        className="h-11 w-full rounded-lg bg-[#1c1f2a] px-4 pr-11 font-['Inter'] text-sm text-[#dfe2f1] outline-none transition-colors placeholder:text-[#c7c4d8]/60 focus:bg-[#262a35] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                      <AtSign
                        size={20}
                        className="pointer-events-none absolute right-3 top-2.5 text-[#c7c4d8]"
                      />
                    </div>
                  </div>

                  {/* Company and role */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="reg-company"
                        className="font-['Inter'] text-xs font-medium text-[#dfe2f1]"
                      >
                        Organization Name
                      </label>
                      <input
                        id="reg-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        required
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        placeholder="Anthropic, Databricks..."
                        className="h-11 w-full rounded-lg bg-[#1c1f2a] px-4 font-['Inter'] text-sm text-[#dfe2f1] outline-none transition-colors placeholder:text-[#c7c4d8]/60 focus:bg-[#262a35] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="reg-role"
                        className="font-['Inter'] text-xs font-medium text-[#dfe2f1]"
                      >
                        Job Role / Title
                      </label>
                      <div className="relative">
                        <select
                          id="reg-role"
                          name="role"
                          required
                          value={role}
                          onChange={(event) => setRole(event.target.value)}
                          className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-[#1c1f2a] px-4 pr-10 font-['Inter'] text-sm text-[#dfe2f1] outline-none transition-colors focus:bg-[#262a35] focus:ring-1 focus:ring-[#4f46e5]/60"
                        >
                          <option value="" disabled>
                            Select role...
                          </option>
                          <option value="cso">Chief Strategy Officer</option>
                          <option value="corp_dev">
                            VP Product / Corp Dev
                          </option>
                          <option value="executive">Executive / Founder</option>
                          <option value="managing_director">
                            Managing Director / Partner
                          </option>
                          <option value="chief_staff">Chief of Staff</option>
                          <option value="other">
                            Other Senior Strategic Role
                          </option>
                        </select>
                        <ChevronDown
                          size={19}
                          className="pointer-events-none absolute right-3 top-3 text-[#c7c4d8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password and strength meter */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="reg-pwd"
                      className="font-['Inter'] text-xs font-medium text-[#dfe2f1]"
                    >
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-pwd"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••••••"
                        className="h-11 w-full rounded-lg bg-[#1c1f2a] px-4 pr-12 font-['Inter'] text-sm text-[#dfe2f1] outline-none transition-colors placeholder:text-[#c7c4d8]/60 focus:bg-[#262a35] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="absolute right-3 top-2.5 rounded text-[#c7c4d8] transition-colors hover:text-[#dfe2f1] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div
                        className="h-1 w-full overflow-hidden rounded-full bg-[#313540]"
                        role="progressbar"
                        aria-label="Password strength"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={passwordStrength}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <PasswordRequirement met={passwordRules.hasLength}>
                          8+ characters
                        </PasswordRequirement>
                        <PasswordRequirement
                          met={passwordRules.hasSpecialAndNumber}
                        >
                          Special character &amp; number
                        </PasswordRequirement>
                      </div>
                    </div>
                  </div>

                  {/* Terms and calendar preferences */}
                  <div className="flex flex-col gap-3 pt-1">
                    <label className="group flex cursor-pointer select-none items-start gap-2.5">
                      <input
                        id="terms-check"
                        name="acceptTerms"
                        type="checkbox"
                        required
                        checked={acceptTerms}
                        onChange={(event) =>
                          setAcceptTerms(event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#464555] bg-[#1c1f2a] accent-[#4f46e5] focus:ring-[#4f46e5]"
                      />
                      <span className="font-['Inter'] text-xs leading-5 text-[#c7c4d8] transition-colors group-hover:text-[#dfe2f1]">
                        I agree to Scriblyst&apos;s{" "}
                        <span className="text-[#c3c0ff] hover:underline">
                          Terms of Service {" "}
                        </span> and  {" "}
                        <span className="text-[#c3c0ff] hover:underline">
                           Privacy Policy
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer select-none items-start gap-2.5 rounded-lg bg-[#1c1f2a]/60 p-3">
                      <input
                        id="cal-check"
                        name="connectCalendar"
                        type="checkbox"
                        checked={connectCalendar}
                        onChange={(event) =>
                          setConnectCalendar(event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#464555] bg-[#1c1f2a] accent-[#4f46e5] focus:ring-[#4f46e5]"
                      />
                      <span className="flex flex-col">
                        <span className="flex flex-wrap items-center gap-2 font-['Inter'] text-xs font-medium text-[#dfe2f1]">
                          Connect Google Calendar automatically
                          <span className="rounded bg-[#0053db] px-1.5 py-0.5 text-[10px] font-semibold text-[#cdd7ff]">
                            Recommended
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !acceptTerms}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#dad7ff] shadow-lg transition-all hover:opacity-95 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#c3c0ff] focus:ring-offset-2 focus:ring-offset-[#171b26] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? "Creating Account..."
                        : "Create Account & Start Briefing"}
                    </span>
                    {!isSubmitting && <ArrowRight size={20} />}
                  </button>
                </form>

                <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
                  <span className="font-['Inter'] text-xs text-[#c7c4d8]">
                    Already have a Scriblyst account?
                  </span>
                  <NavLink
                    to="/login"
                    className="flex items-center gap-0.5 font-['Inter'] text-xs font-semibold text-[#c3c0ff] hover:underline"
                  >
                    <span>Log in to Workspace</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-[#0a0e18]/80 py-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex w-full flex-col items-center justify-between gap-5 px-5 sm:px-8 md:flex-row lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#171b26] px-3 py-1.5 text-[#c7c4d8]">
                <span className="font-['Inter'] text-[10px] font-semibold">
                  TAVILY
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#171b26] px-3 py-1.5 text-[#c7c4d8]">
                <span className="font-['Inter'] text-[10px] font-semibold">
                  BIFROST
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 font-['Inter'] text-[11px] text-[#c7c4d8] sm:gap-5">
              <span>© 2025 Scriblyst AI Systems</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function PasswordRequirement({ met, children }) {
  return (
    <div
      className={`flex items-center gap-1 font-['Inter'] text-[11px] transition-colors ${met ? "text-[#4edea3]" : "text-[#c7c4d8]"}`}
    >
      {met ? <Check size={14} /> : <Circle size={14} />}
      <span>{children}</span>
    </div>
  );
}

function TrustBadge({ icon, children }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#171b26] px-3 py-1.5 text-[#c7c4d8]">
      <span className="text-[#4edea3]">{icon}</span>
      <span className="font-['Inter'] text-[10px] font-semibold">
        {children}
      </span>
    </div>
  );
}
