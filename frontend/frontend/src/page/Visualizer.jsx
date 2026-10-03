import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  FiTerminal,
  FiHome,
  FiLogIn,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiRotateCcw,
  FiCheck,
  FiCheckCircle,
  FiCode,
  FiActivity,
  FiBox,
  FiAlertTriangle,
} from "react-icons/fi";

/* ------------------------------------------------------------------
   Python Visualizer – Visualizer workspace (UI only)

   Same design system as Home, Login, Register and VerifyEmail:
   black background, white text, yellow accent,
   Inter for UI text, JetBrains Mono for code.

   Everything on this page is fixed demo data. Python is NOT executed:
   no eval, no exec, no API calls. The controls only change which demo
   step is highlighted.
------------------------------------------------------------------- */

/* ---------- Same type styles as the other pages ---------- */
const type = {
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  code: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-[13px] leading-6 sm:text-sm md:text-[15px] md:leading-7",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
};

const container = "mx-auto max-w-7xl px-4 sm:px-6";

// Same font import as the other pages. If you later move the fonts
// into index.html, delete this component and its use in <Visualizer />.
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    `}</style>
  );
}

/* ---------- Demo data ---------- */

const tokenStyles = {
  name: "text-white",
  op: "text-white/45",
  num: "text-yellow-200",
  fn: "text-white",
};

// Each code line is a list of [text, kind] pieces so it can be colored.
const codeLines = [
  [["x", "name"], [" = ", "op"], ["10", "num"]],
  [["y", "name"], [" = ", "op"], ["20", "num"]],
  [["z", "name"], [" = ", "op"], ["x", "name"], [" + ", "op"], ["y", "name"]],
  [],
  [["print", "fn"], ["(", "op"], ["z", "name"], [")", "op"]],
];

// "line" is the code line that step highlights in the editor.
const steps = [
  { line: 1, label: "x = 10", vars: [["x", "10"]], changed: "x", output: null },
  { line: 2, label: "y = 20", vars: [["x", "10"], ["y", "20"]], changed: "y", output: null },
  { line: 3, label: "z = x + y", vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: "z", output: null },
  { line: 5, label: "print(z)", vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: null, output: "30" },
];
const lastStep = steps.length - 1;

/* ---------- Header ---------- */

// Icon-only on phones (44px tap target), icon + text from sm up.
function HeaderLink({ to, Icon, children, primary = false }) {
  const look = primary
    ? "bg-yellow-400 text-black hover:bg-yellow-300"
    : "text-white/75 hover:bg-white/10 hover:text-white";
  return (
    <Link
      to={to}
      aria-label={children}
      className={`inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:h-10 ${look}`}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className={`${container} flex items-center justify-between gap-3 py-3`}>
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md font-semibold tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-yellow-400 text-black">
            <FiTerminal aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="truncate">Python Visualizer</span>
        </Link>

        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          <HeaderLink to="/" Icon={FiHome}>Home</HeaderLink>
          <HeaderLink to="/login" Icon={FiLogIn} primary>Login</HeaderLink>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Small shared pieces ---------- */

// Card with a title bar. Used for Execution, Variables, Output and Errors.
function Panel({ title, Icon, meta, className = "", children }) {
  return (
    <section
      aria-label={title}
      className={`flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
          <Icon aria-hidden="true" className="h-4 w-4 text-yellow-400" />
          {title}
        </h2>
        {meta && <span className={`${type.label} text-white/50`}>{meta}</span>}
      </div>
      {children}
    </section>
  );
}

// Run / Reset buttons under the editor.
function ActionButton({ onClick, variant = "primary", pressed, icon: Icon, children }) {
  const looks = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300",
    pressed: "border border-yellow-400/60 bg-yellow-400/15 text-yellow-400",
    secondary: "border border-white/25 text-white hover:border-yellow-400 hover:text-yellow-400",
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 sm:w-auto ${looks[variant]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {children}
    </motion.button>
  );
}

/* ---------- Left: code editor ---------- */

function CodeEditor({ currentLine, ran, onRun, onReset }) {
  const uid = useId(); // keeps the moving highlight unique

  return (
    <section
      aria-label="Python Code"
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/10"
    >
      {/* Window bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          </div>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
            <FiCode aria-hidden="true" className="h-4 w-4 text-yellow-400" />
            Python Code
          </h2>
        </div>
        <span className={`${type.label} text-white/50`}>main.py</span>
      </div>

      {/* Code. Long lines scroll inside the editor, not the page. */}
      <div className={`${type.code} overflow-x-auto bg-black py-4 md:py-5`}>
        <div className="w-max min-w-full">
          {codeLines.map((tokens, index) => {
            const lineNumber = index + 1;
            const isCurrent = lineNumber === currentLine;
            return (
              <div key={lineNumber} className="relative flex items-center pr-4">
                {isCurrent && (
                  <motion.span
                    layoutId={`line-${uid}`}
                    className="absolute inset-0 border-l-2 border-yellow-400 bg-yellow-400/10"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span aria-hidden="true" className="relative w-10 shrink-0 select-none pr-3 text-right text-white/30 sm:w-12 sm:pr-4">
                  {lineNumber}
                </span>
                <span className="relative whitespace-pre">
                  {tokens.length === 0
                    ? " "
                    : tokens.map(([text, kind], i) => (
                        <span key={i} className={tokenStyles[kind]}>{text}</span>
                      ))}
                </span>
                {isCurrent && (
                  <span className={`${type.label} relative ml-auto shrink-0 whitespace-nowrap pl-3 text-yellow-400`}>
                    current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Run / Reset (UI only) */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton onClick={onRun} variant={ran ? "pressed" : "primary"} pressed={ran} icon={ran ? FiCheck : FiPlay}>
            Run
          </ActionButton>
          <ActionButton onClick={onReset} variant="secondary" icon={FiRotateCcw}>
            Reset
          </ActionButton>
        </div>
        <p className={`${type.label} text-white/40 sm:ml-auto sm:text-right`}>
          UI preview only. Code is not executed.
        </p>
      </div>
    </section>
  );
}

/* ---------- Right: execution, controls, variables, output, errors ---------- */

function ExecutionSteps({ step, onSelect }) {
  return (
    <Panel title="Execution" Icon={FiActivity} meta={`Step ${step + 1} of ${steps.length}`} className="order-1">
      <ol className="space-y-2 p-3 sm:p-4">
        {steps.map((s, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "step" : undefined}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  isActive
                    ? "border-yellow-400/60 bg-yellow-400/10"
                    : "border-white/10 hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <span
                  className={`${type.label} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isActive
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : isDone
                      ? "border-yellow-400/40 text-yellow-400"
                      : "border-white/20 text-white/50"
                  }`}
                >
                  {isDone ? <FiCheck aria-hidden="true" className="h-4 w-4" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${type.label} block ${isActive ? "text-yellow-400" : "text-white/50"}`}>
                    Step {index + 1}
                  </span>
                  <span className={`${type.code} block truncate ${isActive ? "text-white" : "text-white/70"}`}>
                    {s.label}
                  </span>
                </span>
                {isActive && (
                  <span className={`${type.label} hidden shrink-0 text-yellow-400 sm:inline`}>current</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

function ControlButton({ label, shortLabel, onClick, disabled, primary, flex = "flex-1", children }) {
  const look = primary
    ? "bg-yellow-400 text-black enabled:hover:bg-yellow-300"
    : "border border-white/20 text-white/80 enabled:hover:border-yellow-400 enabled:hover:text-yellow-400";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`${flex} inline-flex min-h-[48px] min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 ${look}`}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {children}
      <span className="hidden sm:inline">{shortLabel}</span>
    </motion.button>
  );
}

// Sticks to the bottom of the screen on phones so it stays reachable.
function Controls({ step, playing, onPrev, onNext, onPlayPause, onReset }) {
  return (
    <section
      aria-label="Visualizer controls"
      className="order-last sticky bottom-3 z-20 rounded-xl border border-white/15 bg-neutral-900/95 p-3 shadow-lg shadow-black/60 backdrop-blur sm:p-4 lg:static lg:order-2 lg:shadow-none"
    >
      <div className="mb-3 flex gap-1.5" aria-hidden="true">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-yellow-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <ControlButton label="Previous step" shortLabel="Previous" onClick={onPrev} disabled={step === 0}>
          <FiSkipBack aria-hidden="true" className="h-4 w-4 shrink-0" />
        </ControlButton>
        <ControlButton
          label={playing ? "Pause" : "Play"}
          shortLabel={playing ? "Pause" : "Play"}
          onClick={onPlayPause}
          primary
          flex="flex-[1.3]"
        >
          {playing ? (
            <FiPause aria-hidden="true" className="h-4 w-4 shrink-0" />
          ) : (
            <FiPlay aria-hidden="true" className="h-4 w-4 shrink-0" />
          )}
        </ControlButton>
        <ControlButton label="Next step" shortLabel="Next" onClick={onNext} disabled={step === lastStep}>
          <FiSkipForward aria-hidden="true" className="h-4 w-4 shrink-0" />
        </ControlButton>
        <ControlButton label="Reset" shortLabel="Reset" onClick={onReset}>
          <FiRotateCcw aria-hidden="true" className="h-4 w-4 shrink-0" />
        </ControlButton>
      </div>
    </section>
  );
}

function VariablesPanel({ current }) {
  return (
    <Panel title="Variables" Icon={FiBox}>
      <div className="min-h-[10rem] p-3 sm:p-4">
        <table className={`${type.code} w-full`}>
          <thead>
            <tr className={`${type.label} text-left text-white/50`}>
              <th scope="col" className="pb-2 font-medium">Variable</th>
              <th scope="col" className="pb-2 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {current.vars.map(([name, value]) => {
                const changed = name === current.changed;
                return (
                  <motion.tr
                    key={name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10"
                  >
                    <th scope="row" className="py-1.5 text-left font-normal text-white/70">{name}</th>
                    <td className="py-1.5 text-right">
                      <motion.span
                        key={value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={
                          changed
                            ? "inline-block rounded bg-yellow-400 px-2 font-semibold text-black"
                            : "inline-block px-2 text-white"
                        }
                      >
                        {value}
                        {changed && <span className="sr-only"> (just changed)</span>}
                      </motion.span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function OutputPanel({ output }) {
  return (
    <Panel title="Output" Icon={FiTerminal}>
      <div className={`${type.code} min-h-[10rem] flex-1 bg-black p-4`}>
        <p className="text-white/40">$ python main.py</p>
        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={output ?? "waiting"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={output ? "mt-1 font-semibold text-white" : "mt-1 text-white/30"}
            >
              {output ?? "waiting for print(z)"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

// Reserved space for the future error display.
function ErrorPanel() {
  return (
    <Panel title="Errors" Icon={FiAlertTriangle} className="order-4">
      <div className="flex items-start gap-3 p-4">
        <FiCheckCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
        <div>
          <p className={`${type.code} text-white/80`}>No errors</p>
          <p className={`${type.small} mt-1 text-white/50`}>
            If your program fails, the error and the line it happened on will appear here.
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* ---------- Page ---------- */

function Visualizer() {
  const [step, setStep] = useState(2); // starts on Step 3, like the landing page
  const [playing, setPlaying] = useState(false);
  const [ran, setRan] = useState(false);

  const current = steps[step];

  // "Play" only moves the highlighted demo step forward every ~1.4s.
  useEffect(() => {
    if (!playing) return undefined;
    if (step >= lastStep) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 1400);
    return () => clearTimeout(timer);
  }, [playing, step]);

  const goTo = (index) => {
    setPlaying(false);
    setStep(index);
  };

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === lastStep) setStep(0); // replay from the start
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    setStep(0);
    setRan(false);
  };

  // Visual only: marks Run as pressed and returns to Step 1. Nothing executes.
  const handleRun = () => {
    setPlaying(false);
    setStep(0);
    setRan(true);
  };

  return (
    // reducedMotion="user" turns animations off for visitors who ask for it.
    <MotionConfig reducedMotion="user">
      <GlobalStyles />
      <div
        className={`${type.sans} flex min-h-screen min-h-[100dvh] flex-col overflow-x-clip bg-black text-base text-white antialiased [font-feature-settings:'cv11','ss01']`}
      >
        <Header />

        <main className="relative flex-1">
          {/* Same faint grid and soft yellow glow as the other pages */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at top, black 15%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse at top, black 15%, transparent 70%)",
              }}
            />
            <div className="absolute left-1/2 top-24 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          </div>

          <div className={`${container} relative py-6 sm:py-8`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:mb-8">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Visualizer</h1>
                <p className={`${type.small} mt-1 text-white/65`}>
                  Step through a Python program and watch how it runs.
                </p>
              </div>
              <span className={`${type.label} rounded-md border border-white/15 px-2 py-1 text-white/50`}>
                static demo
              </span>
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
              {/* Left column */}
              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <CodeEditor currentLine={current.line} ran={ran} onRun={handleRun} onReset={handleReset} />
              </motion.div>

              {/* Right column. "order-*" keeps Controls last on mobile
                  but right under the steps on desktop. */}
              <motion.div
                className="flex min-w-0 flex-col gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                <ExecutionSteps step={step} onSelect={goTo} />

                <Controls
                  step={step}
                  playing={playing}
                  onPrev={() => goTo(Math.max(0, step - 1))}
                  onNext={() => goTo(Math.min(lastStep, step + 1))}
                  onPlayPause={handlePlayPause}
                  onReset={handleReset}
                />

                <div className="order-3 grid gap-4 md:grid-cols-2">
                  <VariablesPanel current={current} />
                  <OutputPanel output={current.output} />
                </div>

                <ErrorPanel />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}

export default Visualizer;