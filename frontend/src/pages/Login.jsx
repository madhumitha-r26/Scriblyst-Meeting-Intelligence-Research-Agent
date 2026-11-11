import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Verified,
} from "lucide-react";

/**
 * Scriblyst Login page.
 *
 * Tailwind CSS and lucide-react are required.
 * Pass an onLogin callback to connect this form to your authentication API.
 */
export default function Login({
  onLogin,
  backHref = "/",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!onLogin) {
      setError("Login is not available right now. Please try again later.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await onLogin({
        email,
        password,
        rememberDevice,
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error?.message || "Login failed.");
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
        <section className="relative flex min-h-[calc(100vh-8rem)] w-full items-center justify-center overflow-hidden px-5 py-8 sm:px-8 sm:py-12">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#4f46e5]/20 via-[#0053db]/10 to-transparent blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-[420px] w-[420px] rounded-full bg-[#006e4b]/10 blur-[140px]" />
          <div className="pointer-events-none absolute -left-20 top-1/3 h-[380px] w-[380px] rounded-full bg-[#c3c0ff]/5 blur-[100px]" />

          <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col items-center justify-center">
            <div className="flex w-full flex-col justify-between rounded-xl bg-[#1c1f2a] p-6 shadow-2xl sm:p-8">
              <div className="flex flex-col gap-6">
                {/* Sign-in / create-account switch */}
                <div className="flex w-full items-center justify-center gap-3">
                  <div className="inline-flex rounded-lg bg-[#0a0e18] p-1">
                    <span className="rounded-md bg-[#4f46e5] px-4 py-2 font-['Inter'] text-xs font-semibold text-[#dad7ff] shadow-sm">
                      Sign In
                    </span>
                    <NavLink
                      to="/register"
                      className="rounded-md px-4 py-2 font-['Inter'] text-xs font-medium text-[#c7c4d8] transition-all hover:text-[#dfe2f1]"
                    >
                      Create Account
                    </NavLink>
                  </div>
                </div>

                {/* Heading */}
                <div className="flex flex-col gap-1">
                  <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold tracking-tight text-[#dfe2f1]">
                    Authenticate Workspace
                  </h1>
                  <p className="font-['Inter'] text-xs leading-[18px] text-[#c7c4d8]">
                    Select enterprise federated identity or credentials.
                  </p>
                </div>

                {error && (
                  <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="work-email"
                      className="flex items-center justify-between gap-2 font-['Inter'] text-[11px] font-semibold text-[#dfe2f1]"
                    >
                      <span>Email Address</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 text-[#c7c4d8]"
                        aria-hidden="true"
                      />
                      <input
                        id="work-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@company.com"
                        className="w-full rounded-lg bg-[#0a0e18] py-3 pl-11 pr-4 font-['Inter'] text-sm text-[#dfe2f1] shadow-sm outline-none transition-all placeholder:text-[#918fa1] focus:bg-[#171b26] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="password"
                      className="font-['Inter'] text-[11px] font-semibold text-[#dfe2f1]"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 text-[#c7c4d8]"
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-lg bg-[#0a0e18] py-3 pl-11 pr-12 font-['Inter'] text-sm text-[#dfe2f1] shadow-sm outline-none transition-all placeholder:text-[#918fa1] focus:bg-[#171b26] focus:ring-1 focus:ring-[#4f46e5]/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="absolute right-3 rounded p-1 text-[#c7c4d8] transition-colors hover:text-[#dfe2f1] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-6 py-3.5 font-['Plus_Jakarta_Sans'] text-base font-bold text-white shadow-lg transition-all hover:bg-[#4d44e3] hover:shadow-[#4f46e5]/40 focus:outline-none focus:ring-2 focus:ring-[#c3c0ff] focus:ring-offset-2 focus:ring-offset-[#1c1f2a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span>
                      {isSubmitting ? "Signing In..." : "Sign In to Workspace"}
                    </span>
                    {!isSubmitting && <ArrowRight size={20} />}
                  </button>
                </form>

                {/* Registration and session notes */}
                <span className="font-['Inter'] text-xs text-center leading-5 text-[#c7c4d8]">
                  Don’t have an enterprise account?{" "}
                  <NavLink
                    to="/register"
                    className="font-semibold text-[#c3c0ff] transition-colors hover:text-[#dad7ff]"
                  >
                    Register Free
                  </NavLink>
                </span>
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
