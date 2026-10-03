import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { FiTerminal, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";


const type = {
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
};

const container = "mx-auto max-w-6xl px-4 sm:px-6";


function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    `}</style>
  );
}

/* ---------- Header (same logo as the landing page navbar) ---------- */

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

/* ---------- Form pieces ---------- */

const inputClasses =
  "block min-h-[44px] w-full rounded-lg border border-white/15 bg-black px-3.5 py-2.5 text-base text-white placeholder:text-white/35 transition-colors focus:border-yellow-400 focus:outline-none";

// The glow around a focused input is animated by Framer Motion.
const focusGlow = { boxShadow: "0 0 0 3px rgba(250, 204, 21, 0.25)" };

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ---------- Page ---------- */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI only: stop the browser from reloading the page. No request is sent.
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    // reducedMotion="user" turns animations off for visitors who ask for it.
    <MotionConfig reducedMotion="user">
      <GlobalStyles />
      <div
        className={`${type.sans} flex min-h-screen min-h-[100dvh] flex-col overflow-x-clip bg-black text-base text-white antialiased [font-feature-settings:'cv11','ss01']`}
      >
        <Header />

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
          {/* Same faint grid and soft yellow glow as the landing page hero */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[32rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl"
          />

          <motion.section
            aria-labelledby="login-heading"
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Window bar, like the visualizer preview */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              </div>
              <span className={`${type.label} text-white/60`}>sign-in</span>
            </div>

            <div className="p-5 sm:p-8">
              <div className="text-center">
                <h1
                  id="login-heading"
                  className="break-words text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl"
                >
                  Welcome Back
                </h1>
                <p className={`${type.body} mt-2 text-white/65`}>
                  Sign in to continue to your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5 sm:mt-8">
                <Field id="email" label="Email">
                  <motion.input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                    whileFocus={focusGlow}
                    transition={{ duration: 0.15 }}
                  />
                </Field>

                <div>
                  <Field id="password" label="Password">
                    <div className="relative">
                      <motion.input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClasses} pr-12`}
                        whileFocus={focusGlow}
                        transition={{ duration: 0.15 }}
                      />
                      {/* 44px tap target inside the input's right edge */}
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        className="absolute right-0 top-0 flex h-full min-h-[44px] w-11 items-center justify-center rounded-r-lg text-white/60 transition-colors hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={showPassword ? "hide" : "show"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.12 }}
                            className="flex"
                          >
                            {showPassword ? (
                              <FiEyeOff aria-hidden="true" className="h-5 w-5" />
                            ) : (
                              <FiEye aria-hidden="true" className="h-5 w-5" />
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </Field>

                  <a
                    href="#"
                    className={`${type.small} -ml-1 mt-1 inline-flex min-h-[44px] items-center rounded-md px-1 font-medium text-white/65 transition-colors hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Same primary button as "Start Visualizing" */}
                <motion.button
                  type="submit"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold tracking-tight text-black transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  <FiLogIn aria-hidden="true" className="h-4 w-4" />
                  Login
                </motion.button>
              </form>

              <div className={`${type.small} mt-6 flex flex-wrap items-center justify-center gap-x-1.5 border-t border-white/10 pt-5 text-white/65`}>
                <span>Don&apos;t have an account?</span>
                <Link
                  to="/register"
                  className="inline-flex min-h-[44px] items-center rounded-md px-1 font-semibold text-yellow-400 transition-colors hover:text-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </MotionConfig>
  );
}

export default Login;