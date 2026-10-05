import { Fragment, useEffect, useId, useState } from "react";
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
  FiArrowRight,
  FiCode,
  FiActivity,
  FiBox,
} from "react-icons/fi";


const type = {
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",
  code: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-[13px] leading-6 sm:text-sm md:text-[15px] md:leading-7",
  
  editor:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-[13px] leading-6 sm:text-sm md:text-[15px] md:leading-7 lg:text-[17px] lg:leading-9",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
};

const container = "mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8";


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
// "trail" shows how that line is evaluated, ending with where the value goes.
const steps = [
  { line: 1, label: "x = 10", trail: ["10", "x"], vars: [["x", "10"]], changed: "x", output: null, note: "x is assigned the value 10." },
  { line: 2, label: "y = 20", trail: ["20", "y"], vars: [["x", "10"], ["y", "20"]], changed: "y", output: null, note: "y is assigned the value 20." },
  { line: 3, label: "z = x + y", trail: ["x + y", "10 + 20", "30", "z"], vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: "z", output: null, note: "x + y is 30, so z is assigned 30." },
  { line: 5, label: "print(z)", trail: ["z", "30", "output"], vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: null, output: "30", note: "print(z) writes 30 to the output." },
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
      <div className={`${container} flex items-center justify-between gap-3 py-2.5`}>
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

// Compact title row above the workspace.
function PageHeader({ playing }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:mb-5">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Python Visualizer</h1>
        <p className={`${type.small} text-white/65`}>
          Understand your code by watching it execute step by step.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`${type.label} rounded-md border border-white/15 px-2.5 py-1.5 text-white/60`}>
          Demo Program
        </span>
        <span
          className={`${type.label} inline-flex items-center gap-2 rounded-md border border-yellow-400/40 bg-yellow-400/10 px-2.5 py-1.5 text-yellow-400`}
        >
          <span className={`h-1.5 w-1.5 rounded-full bg-yellow-400 ${playing ? "motion-safe:animate-pulse" : ""}`} />
          {playing ? "Playing" : "Ready"}
        </span>
      </div>
    </div>
  );
}

/* ---------- Shared pieces ---------- */

// Title row used by every section inside the workspace.
function SectionHeader({ title, Icon, meta }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
      <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
        <Icon aria-hidden="true" className="h-4 w-4 text-yellow-400" />
        {title}
      </h2>
      {meta && <span className={`${type.label} text-white/50`}>{meta}</span>}
    </div>
  );
}

// Run / Reset buttons in the editor footer.
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
      className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 sm:w-auto md:min-h-[40px] ${looks[variant]}`}
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

function CodeEditor({ current, ran, onRun, onReset }) {
  const uid = useId(); // keeps the moving highlight unique

  return (
    <section aria-label="Code editor" className="flex min-w-0 flex-col">
      {/* Window bar with the file tab */}
      <div className="flex items-stretch justify-between border-b border-white/10 bg-neutral-950">
        <div className="flex items-center gap-4 pl-4">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          </div>
          <h2 className={`${type.label} flex items-center gap-2 border-b-2 border-yellow-400 px-1 py-3 text-white`}>
            <FiCode aria-hidden="true" className="h-3.5 w-3.5 text-yellow-400" />
            main.py
          </h2>
        </div>
        <span className={`${type.label} flex items-center pr-4 text-white/40`}>Python Code</span>
      </div>

      {/* Editor body. The line-number strip runs the full height, like a real
          editor, and long lines scroll inside it instead of widening the page. */}
      <div className="relative flex-1 bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-10 border-r border-white/10 bg-white/[0.03] sm:w-12 lg:w-14"
        />
        <div className={`${type.editor} relative overflow-x-auto py-4 lg:py-6`}>
          <div className="w-max min-w-full">
            {codeLines.map((tokens, index) => {
              const lineNumber = index + 1;
              const isCurrent = lineNumber === current.line;
              return (
                <div key={lineNumber} className="relative flex items-center pr-4">
                  {isCurrent && (
                    <motion.span
                      layoutId={`line-${uid}`}
                      className="absolute inset-0 border-l-2 border-yellow-400 bg-yellow-400/10"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span aria-hidden="true" className="relative w-10 shrink-0 select-none pr-3 text-right text-white/30 sm:w-12 sm:pr-4 lg:w-14">
                    {lineNumber}
                  </span>
                  <span className="relative whitespace-pre pl-4">
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
      </div>

      {/* How the current line is evaluated */}
      <div className="border-t border-white/10 bg-neutral-900 px-4 py-3">
        <p className={`${type.label} text-white/50`}>Line {current.line} evaluation</p>
        <motion.div
          key={current.line + current.label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          aria-live="polite"
        >
          <div className={`${type.code} mt-2 flex min-h-[3.5rem] flex-wrap content-start items-center gap-x-2 gap-y-1 sm:min-h-[1.75rem]`}>
            {current.trail.map((part, i) => {
              const isLast = i === current.trail.length - 1;
              return (
                <Fragment key={part}>
                  <span className={isLast ? "rounded bg-yellow-400/15 px-1.5 font-semibold text-yellow-400" : "text-white"}>
                    {part}
                  </span>
                  {!isLast && <FiArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/40" />}
                </Fragment>
              );
            })}
          </div>
          <p className={`${type.small} mt-1 min-h-[3rem] text-white/65 sm:min-h-[1.5rem]`}>{current.note}</p>
        </motion.div>
      </div>

      {/* Run / Reset (UI only) + editor info */}
      <div className="flex flex-col gap-3 border-t border-white/10 bg-neutral-950 px-4 py-3 sm:flex-row sm:items-center">
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <ActionButton onClick={onRun} variant={ran ? "pressed" : "primary"} pressed={ran} icon={ran ? FiCheck : FiPlay}>
            Run
          </ActionButton>
          <ActionButton onClick={onReset} variant="secondary" icon={FiRotateCcw}>
            Reset
          </ActionButton>
        </div>
        <p className={`${type.label} text-white/40 sm:ml-auto sm:text-right`}>
          Ln {current.line} <span aria-hidden="true">&middot;</span> UI preview, code is not executed
        </p>
      </div>
    </section>
  );
}

/* ---------- Right: trace, variables, output ---------- */

// Steps joined by a vertical line that fills in yellow as you move forward.
function ExecutionTrace({ step, onSelect }) {
  const progress = (step / lastStep) * 100;

  return (
    <section aria-label="Execution Trace">
      <SectionHeader title="Execution Trace" Icon={FiActivity} meta={`Step ${step + 1} of ${steps.length}`} />
      <div className="relative p-3">
        {/* Connector line (rows are 48px tall, so badge centers line up) */}
        <div aria-hidden="true" className="absolute bottom-9 left-[41px] top-9 w-px bg-white/15">
          <div className="w-full bg-yellow-400 transition-[height] duration-300" style={{ height: `${progress}%` }} />
        </div>

        <ol>
          {steps.map((s, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <li key={s.label} className="flex h-12 items-center">
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={`relative z-10 flex min-h-[44px] w-full items-center gap-3 rounded-lg border px-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    isActive
                      ? "border-yellow-400/60 bg-yellow-400/10"
                      : "border-transparent hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`${type.label} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isActive
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : isDone
                        ? "border-yellow-400/50 bg-neutral-900 text-yellow-400"
                        : "border-white/20 bg-neutral-900 text-white/50"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={`${type.code} min-w-0 flex-1 truncate ${isActive ? "text-white" : "text-white/70"}`}>
                    {s.label}
                  </span>
                  {isActive && (
                    <span className={`${type.label} shrink-0 rounded border border-yellow-400/50 px-1.5 py-0.5 text-yellow-400`}>
                      current
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function VariablesSection({ current }) {
  return (
    <section aria-label="Variables" className="border-t border-white/10">
      <SectionHeader title="Variables" Icon={FiBox} meta={`${current.vars.length} defined`} />
      <dl className={`${type.code} min-h-[7.5rem] py-1`}>
        <AnimatePresence initial={false}>
          {current.vars.map(([name, value]) => {
            const changed = name === current.changed;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex min-h-[2.5rem] items-center justify-between gap-3 px-4 ${
                  changed ? "bg-yellow-400/10" : ""
                }`}
              >
                <dt className={changed ? "font-semibold text-white" : "text-white/70"}>{name}</dt>
                <dd className="flex items-center gap-3">
                  {changed && (
                    <span className={`${type.label} text-yellow-400`}>
                      <span aria-hidden="true">&larr; </span>changed
                    </span>
                  )}
                  <motion.span
                    key={value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={
                      changed
                        ? "rounded bg-yellow-400 px-2 font-semibold text-black"
                        : "px-2 text-white"
                    }
                  >
                    {value}
                  </motion.span>
                </dd>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </dl>
    </section>
  );
}

// Terminal-style output, with the (static) error status under it.
function OutputSection({ output }) {
  return (
    <section aria-label="Output" className="flex flex-1 flex-col border-t border-white/10">
      <SectionHeader title="Output" Icon={FiTerminal} />
      <div className={`${type.code} flex-1 bg-black px-4 py-3`}>
        <p className="text-white/40">$ python main.py</p>
        <div aria-live="polite" className="mt-2 min-h-[1.75rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={output ?? "waiting"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={output ? "font-semibold text-white" : "text-white/30"}
            >
              {output ?? "waiting for print(z)"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      {/* Compact status. Real errors will replace this later. */}
      <div className={`${type.label} flex items-center gap-2 border-t border-white/10 bg-neutral-950 px-4 py-2.5 text-white/70`}>
        <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-yellow-400" />
        No runtime errors
      </div>
    </section>
  );
}

/* ---------- Bottom: timeline + controls ---------- */

// Horizontal timeline: ●────●────●────●  with step numbers underneath.
function Timeline({ step, onSelect }) {
  return (
    <ol className="flex w-full" aria-label="Execution timeline">
      {steps.map((s, index) => {
        const isActive = index === step;
        const isReached = index <= step;
        return (
          <li key={s.label} className="relative flex flex-1 flex-col items-center">
            {/* Line to the next dot */}
            {index < lastStep && (
              <span aria-hidden="true" className="absolute left-1/2 top-[15px] h-0.5 w-full bg-white/15">
                <span
                  className={`block h-full origin-left bg-yellow-400 transition-transform duration-300 ${
                    index < step ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Go to step ${index + 1}: ${s.label}`}
              aria-current={isActive ? "step" : undefined}
              className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  isActive
                    ? "h-4 w-4 bg-yellow-400 ring-4 ring-yellow-400/25"
                    : isReached
                    ? "h-3 w-3 bg-yellow-400"
                    : "h-3 w-3 border-2 border-white/30 bg-neutral-950"
                }`}
              />
            </button>
            <span className={`${type.label} mt-0.5 ${isActive ? "text-yellow-400" : "text-white/50"}`}>
              {index + 1}
            </span>
            {/* Takes up space on every step so nothing jumps */}
            <span className={`${type.label} hidden h-4 text-yellow-400 sm:block ${isActive ? "" : "invisible"}`}>
              <span aria-hidden="true">&uarr; </span>current
            </span>
          </li>
        );
      })}
    </ol>
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
      className={`${flex} inline-flex min-h-[48px] min-w-0 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 ${look}`}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {children}
      <span className="hidden sm:inline">{shortLabel}</span>
    </motion.button>
  );
}

// Stays at the bottom of the screen while the workspace is in view.
function ControlBar({ step, playing, onSelect, onPrev, onNext, onPlayPause, onReset }) {
  return (
    <div className="sticky bottom-0 z-20 flex flex-col gap-3 border-t border-white/15 bg-neutral-950/95 px-4 py-3 backdrop-blur lg:flex-row lg:items-center lg:gap-8 lg:px-6">
      <div className="min-w-0 lg:flex-1">
        <Timeline step={step} onSelect={onSelect} />
      </div>

      <div className="flex gap-2 lg:order-first lg:w-[28rem] lg:shrink-0">
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
    </div>
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
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden">
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
            <div className="absolute left-1/2 top-20 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          </div>

          <div className={`${container} relative pb-6 pt-5 sm:pb-8 sm:pt-6`}>
            <PageHeader playing={playing} />

            {/* One workspace. overflow-clip rounds the corners and, unlike
                overflow-hidden, still lets the control bar stick. */}
            <motion.div
              className="overflow-clip rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="grid md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:min-h-[34rem]">
                <CodeEditor current={current} ran={ran} onRun={handleRun} onReset={handleReset} />

                <div className="flex min-w-0 flex-col border-t border-white/10 md:border-l md:border-t-0">
                  <ExecutionTrace step={step} onSelect={goTo} />
                  <div className="flex flex-1 flex-col">
                    <VariablesSection current={current} />
                    <OutputSection output={current.output} />
                  </div>
                </div>
              </div>

              <ControlBar
                step={step}
                playing={playing}
                onSelect={goTo}
                onPrev={() => goTo(Math.max(0, step - 1))}
                onNext={() => goTo(Math.min(lastStep, step + 1))}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}

export default Visualizer;