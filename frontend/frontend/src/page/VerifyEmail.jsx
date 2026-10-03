import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { FiTerminal, FiMail, FiRefreshCw } from "react-icons/fi";

const type = {
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
  code: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-[13px] leading-6 sm:text-sm",
};

const container = "mx-auto max-w-6xl px-4 sm:px-6";

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    `}</style>
  );
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-black/85 backdrop-blur">
      <div className={`${container} flex items-center py-3`}>
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-black">
            <FiTerminal aria-hidden="true" className="h-4 w-4" />
          </span>

          Python Visualizer
        </Link>
      </div>
    </header>
  );
}

function VerifyEmail() {
  const email = "user@example.com";

  return (
    <MotionConfig reducedMotion="user">
      <GlobalStyles />

      <div
        className={`${type.sans} flex min-h-screen min-h-[100dvh] flex-col overflow-x-clip bg-black text-base text-white antialiased`}
      >
        <Header />

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">

          {/* Background grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at center, black 10%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 10%, transparent 70%)",
            }}
          />

          {/* Yellow glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[32rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
          />

          <motion.section
            aria-labelledby="verify-heading"
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Window bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
              <div
                className="hidden items-center gap-1.5 sm:flex"
                aria-hidden="true"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              </div>

              <span className={`${type.label} text-white/60`}>
                verify-email
              </span>
            </div>

            <div className="p-5 text-center sm:p-8">

              {/* Email icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                <FiMail aria-hidden="true" className="h-7 w-7" />
              </div>

              <h1
                id="verify-heading"
                className="mt-5 break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
              >
                Check Your Email
              </h1>

              <p className={`${type.body} mt-3 text-white/65`}>
                Thanks for signing up! We've sent a verification link to your
                email address.
              </p>

              {/* Email address */}
              <p
                className={`${type.code} mx-auto mt-5 max-w-full break-all rounded-lg border border-white/15 bg-black px-4 py-3 font-semibold text-yellow-400`}
              >
                {email}
              </p>

              <p className={`${type.body} mt-5 text-white/65`}>
                Open your email and click the verification link to activate
                your account.
              </p>

              {/* Resend button */}
              <div className="mt-7">
                <button
                  type="button"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold tracking-tight text-black transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                >
                  <FiRefreshCw aria-hidden="true" className="h-4 w-4" />
                  Resend Verification Email
                </button>
              </div>

              <p className={`${type.small} mt-4 text-white/50`}>
                Didn't receive the email? Check your spam or junk folder.
              </p>

              {/* Login */}
              <div
                className={`${type.small} mt-6 flex flex-wrap items-center justify-center gap-x-1.5 border-t border-white/10 pt-5 text-white/65`}
              >
                <span>Already verified?</span>

                <Link
                  to="/login"
                  className="inline-flex min-h-[44px] items-center rounded-md px-1 font-semibold text-yellow-400 transition-colors hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </MotionConfig>
  );
}

export default VerifyEmail;