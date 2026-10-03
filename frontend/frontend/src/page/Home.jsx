import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import {
  FiTerminal,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiArrowRight,
  FiArrowDown,
  FiPlay,
  FiPlayCircle,
  FiBox,
  FiCode,
  FiAlertTriangle,
  FiEdit3,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
} from "react-icons/fi";

/* ------------------------------------------------------------------
   Python Visualizer – Landing page (black / white / yellow)

   Needs: react-router-dom, framer-motion, react-icons
   Fonts: Inter (UI) and JetBrains Mono (code), loaded in <GlobalStyles />
------------------------------------------------------------------- */

/* ---------- Typography system ---------- */
const type = {
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",

  h1: "break-words text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
  h2: "break-words text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl",
  h3: "text-lg font-semibold leading-snug tracking-tight",

  lead: "text-base leading-relaxed sm:text-lg md:text-xl",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",

  code: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-[13px] leading-6 sm:text-sm md:text-[15px] md:leading-7",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
};

// Shared page width and section spacing, so every section lines up.
const container = "mx-auto max-w-6xl px-4 sm:px-6";
const sectionSpace = "scroll-mt-16 py-16 sm:py-20 lg:py-24";

// Loads fonts and turns on smooth scrolling for the #anchor links.
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
      html { scroll-behavior: smooth; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    `}</style>
  );
}

/* ---------- Content ---------- */

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const features = [
  {
    title: "Step-by-Step Execution",
    text: "See how Python executes your code one line at a time.",
    Icon: FiPlayCircle,
    snippet: "line 3 of 4",
  },
  {
    title: "Variable Tracking",
    text: "Watch variables change as your program runs.",
    Icon: FiBox,
    snippet: "z = 30",
  },
  {
    title: "Function Visualization",
    text: "Understand function calls and how execution moves through your code.",
    Icon: FiCode,
    snippet: "add(2, 3) -> 5",
  },
  {
    title: "Error Visualization",
    text: "See where your program fails and understand the error.",
    Icon: FiAlertTriangle,
    snippet: "NameError on line 3",
  },
];

const howItWorks = [
  { label: "01", title: "Write Code", text: "Write or paste your Python program.", Icon: FiEdit3 },
  { label: "02", title: "Visualize", text: "Run the program and inspect its execution step by step.", Icon: FiPlay },
  { label: "03", title: "Understand", text: "Explore variables, output, function calls, and errors.", Icon: FiEye },
];

/* Sample programs for the preview mockups.
   Each code line is a list of [text, kind] pieces so we can color it.
   Each step says which line just ran, the variables, and the output.
   This is fixed demo data. No Python is executed. */
const tokenStyles = {
  name: "text-white",
  op: "text-white/45",
  num: "text-yellow-200",
  kw: "text-yellow-400",
  fn: "text-white",
};

const simpleProgram = {
  file: "main.py",
  label: "Preview of the Python Visualizer stepping through a short program that adds two numbers",
  lines: [
    [["x", "name"], [" = ", "op"], ["10", "num"]],
    [["y", "name"], [" = ", "op"], ["20", "num"]],
    [["z", "name"], [" = ", "op"], ["x", "name"], [" + ", "op"], ["y", "name"]],
    [["print", "fn"], ["(", "op"], ["z", "name"], [")", "op"]],
  ],
  steps: [
    { line: 1, vars: [["x", "10"]], changed: "x", output: "no output yet", note: "x is assigned the value 10." },
    { line: 2, vars: [["x", "10"], ["y", "20"]], changed: "y", output: "no output yet", note: "y is assigned the value 20." },
    { line: 3, vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: "z", output: "waiting for print(z)", note: "x + y is 30, so z is assigned 30." },
    { line: 4, vars: [["x", "10"], ["y", "20"], ["z", "30"]], changed: null, output: "30", done: true, note: "print(z) writes 30 to the output." },
  ],
};

const loopProgram = {
  file: "loop.py",
  label: "Interactive preview of the Python Visualizer stepping through a loop that adds up numbers",
  lines: [
    [["total", "name"], [" = ", "op"], ["0", "num"]],
    [["for", "kw"], [" i ", "name"], ["in", "kw"], [" ", "op"], ["range", "fn"], ["(", "op"], ["3", "num"], ["):", "op"]],
    [["    ", "op"], ["total", "name"], [" += ", "op"], ["i", "name"]],
    [["print", "fn"], ["(", "op"], ["total", "name"], [")", "op"]],
  ],
  steps: [
    { line: 1, vars: [["total", "0"]], changed: "total", output: "no output yet", note: "total starts at 0." },
    { line: 2, vars: [["total", "0"], ["i", "0"]], changed: "i", output: "no output yet", note: "The loop begins and i is set to 0." },
    { line: 3, vars: [["total", "0"], ["i", "0"]], changed: "total", output: "no output yet", note: "total += i adds 0, so total stays 0." },
    { line: 2, vars: [["total", "0"], ["i", "1"]], changed: "i", output: "no output yet", note: "The loop moves on and i becomes 1." },
    { line: 3, vars: [["total", "1"], ["i", "1"]], changed: "total", output: "no output yet", note: "total += i adds 1, so total becomes 1." },
    { line: 2, vars: [["total", "1"], ["i", "2"]], changed: "i", output: "no output yet", note: "i becomes 2, the last value in range(3)." },
    { line: 3, vars: [["total", "3"], ["i", "2"]], changed: "total", output: "waiting for print(total)", note: "total += i adds 2, so total becomes 3." },
    { line: 4, vars: [["total", "3"], ["i", "2"]], changed: null, output: "3", done: true, note: "print(total) writes 3 to the output." },
  ],
};

/* ---------- Animation helper ---------- */

// Fades an element in and slides it up slightly when it scrolls into view.
function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

/* ---------- Small reusable pieces ---------- */

// Links starting with "/" use React Router (no page reload).
// Everything else (#sections, "#") is a normal anchor.
function Button({ href = "#", variant = "primary", icon: Icon, children }) {
  const base =
    "inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 md:min-h-0 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const styles = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300",
    secondary: "border border-white/25 text-white hover:border-yellow-400 hover:text-yellow-400",
    ghost: "text-white/75 hover:text-white hover:bg-white/10",
    dark: "bg-black text-yellow-400 hover:bg-neutral-900",
  };
  const className = `${base} ${styles[variant]}`;
  const content = (
    <>
      {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
      {children}
    </>
  );

  return (
    <motion.span
      className="inline-flex"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {href.startsWith("/") ? (
        <Link to={href} className={className}>{content}</Link>
      ) : (
        <a href={href} className={className}>{content}</a>
      )}
    </motion.span>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <h2 className={`${type.h2} text-white`}>{title}</h2>
      {subtitle && <p className={`${type.lead} mt-4 text-white/65`}>{subtitle}</p>}
    </Reveal>
  );
}

/* ---------- Navbar ---------- */

// Nav link with a thin yellow underline that slides in on hover.
function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="group relative rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      {children}
      <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-yellow-400 transition-transform duration-200 group-hover:scale-x-100" />
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur">
      <nav className={`${container} flex items-center justify-between py-3`} aria-label="Main navigation">
        <a href="#home" className="flex items-center gap-2.5 font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-black">
            <FiTerminal aria-hidden="true" className="h-4 w-4" />
          </span>
          Python Visualizer
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="/Login" variant="ghost" icon={FiLogIn}>Login</Button>
          <Button href="/Register" icon={FiUserPlus}>Sign Up</Button>
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2.5 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu: height and opacity animate together */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden border-t border-white/10 bg-black md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-4 pb-5 pt-2">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`${type.body} block rounded-md px-3 py-3 font-medium text-white/80 hover:bg-white/10 hover:text-white`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <Button href="#" variant="secondary" icon={FiLogIn}>Login</Button>
                <Button href="#" icon={FiUserPlus}>Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Visualizer preview ---------- */

// Back / Next button. In the hero it is only decorative (a <span>),
// in the interactive section it is a real <button>.
function StepButton({ interactive, onClick, disabled, primary, children }) {
  const base = `${type.label} inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
    interactive ? "min-h-[44px] md:min-h-0" : ""
  }`;
  const look = primary ? "bg-yellow-400 text-black" : "border border-white/20 text-white/70";

  if (!interactive) return <span className={`${base} ${look}`}>{children}</span>;

  const hover = primary
    ? "enabled:hover:bg-yellow-300"
    : "enabled:hover:border-yellow-400 enabled:hover:text-yellow-400";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${look} ${hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

// Mock developer tool. It only displays the step it is given.
function VisualizerPreview({ program, step, interactive = false, onBack, onNext }) {
  const uid = useId(); // keeps the moving highlight separate per preview
  const total = program.steps.length;
  const current = program.steps[step];
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const maxVars = Math.max(...program.steps.map((s) => s.vars.length));

  // A decorative preview is described as one image; an interactive one is not.
  const wrapperProps = interactive ? {} : { role: "img", "aria-label": program.label };

  return (
    <div
      {...wrapperProps}
      className="overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/10"
    >
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        </div>
        <span className={`${type.label} text-white/60`}>{program.file}</span>
        <span className={`${type.label} text-white/60`}>Step {step + 1} of {total}</span>
      </div>

      <div className="grid md:grid-cols-5">
        {/* Code + explanation */}
        <div className="flex flex-col bg-black md:col-span-3">
          {/* Long lines scroll inside the editor instead of widening the page */}
          <div className={`${type.code} overflow-x-auto py-4 md:py-5`}>
            <div className="w-max min-w-full">
            {program.lines.map((tokens, index) => {
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
                  <span className="relative w-10 shrink-0 select-none pr-3 text-right text-white/30 sm:w-12 sm:pr-4">{lineNumber}</span>
                  <span className="relative whitespace-pre">
                    {tokens.map(([text, kind], i) => (
                      <span key={i} className={tokenStyles[kind]}>{text}</span>
                    ))}
                  </span>
                  {isCurrent && (
                    <span className={`${type.label} relative ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap pl-3 text-yellow-400`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 motion-safe:animate-pulse" />
                      running
                    </span>
                  )}
                </div>
              );
            })}
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 px-4 py-3">
            <p className={`${type.label} text-white/50`}>What happened</p>
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              aria-live={interactive ? "polite" : undefined}
              className={`${type.small} mt-1 min-h-[3rem] text-white/80`}
            >
              {current.note}
            </motion.p>
          </div>
        </div>

        {/* Execution panel */}
        <div className="border-t border-white/10 p-4 sm:p-5 md:col-span-2 md:border-l md:border-t-0">
          <p className={`${type.label} text-white/50`}>Execution</p>
          <p className={`${type.code} mt-1 text-white`}>
            Current line: <span className="font-semibold text-yellow-400">{current.line}</span>
          </p>

          <p className={`${type.label} mt-5 text-white/50`}>Variables</p>
          <dl
            className={`${type.code} mt-2 divide-y divide-white/10 rounded-lg border border-white/10`}
            style={{ minHeight: `${maxVars * 2.25}rem` }}
          >
            <AnimatePresence initial={false}>
              {current.vars.map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between px-3 py-1"
                >
                  <dt className="text-white/60">{name}</dt>
                  <motion.dd
                    key={value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={
                      name === current.changed
                        ? "rounded bg-yellow-400 px-1.5 font-semibold text-black"
                        : "text-white"
                    }
                  >
                    {value}
                  </motion.dd>
                </motion.div>
              ))}
            </AnimatePresence>
          </dl>

          <p className={`${type.label} mt-5 text-white/50`}>Output</p>
          <div
            className={`${type.code} mt-2 rounded-lg border px-3 py-1 ${
              current.done
                ? "border-yellow-400/40 bg-yellow-400/10 font-semibold text-yellow-400"
                : "border-dashed border-white/20 text-white/40"
            }`}
          >
            {current.output}
          </div>
        </div>
      </div>

      {/* Step controls */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 sm:gap-3">
        <StepButton interactive={interactive} onClick={onBack} disabled={isFirst}>
          <FiChevronLeft aria-hidden="true" /> Back
        </StepButton>

        <div className="flex min-w-0 flex-1 gap-1 sm:gap-1.5" aria-hidden="true">
          {program.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-yellow-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <StepButton interactive={interactive} onClick={onNext} primary>
          {interactive && isLast ? (
            <>
              <FiRotateCcw aria-hidden="true" /> Restart
            </>
          ) : (
            <>
              Next <FiChevronRight aria-hidden="true" />
            </>
          )}
        </StepButton>
      </div>
    </div>
  );
}

// Hero version: steps forward by itself every couple of seconds.
// Starts on step 3 to match the example, and stays still if the visitor
// prefers reduced motion.
function AutoPreview() {
  const [step, setStep] = useState(2);
  const reduceMotion = useReducedMotion();
  const total = simpleProgram.steps.length;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(() => setStep((s) => (s + 1) % total), 2400);
    return () => clearInterval(timer);
  }, [reduceMotion, total]);

  return <VisualizerPreview program={simpleProgram} step={step} />;
}

/* ---------- Sections ---------- */

function Hero() {
  return (
    <section id="home" className="relative scroll-mt-16 overflow-hidden">
      {/* Faint grid and a soft yellow glow behind the preview */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl"
      />

      <div className={`${container} relative pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20`}>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className={`${type.h1} text-white`}>Understand Python by Seeing It Execute</h1>
          <p className={`${type.lead} mx-auto mt-6 max-w-2xl text-white/65`}>
            Write Python code and watch how variables, loops, functions, and program execution change step by step.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-9 md:max-w-none md:flex-row md:justify-center">
            <Button href="/visualizer" icon={FiArrowRight}>Start Visualizing</Button>
            <Button href="#features" variant="secondary">Explore Features</Button>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-4xl sm:mt-14"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <AutoPreview />
        </motion.div>
      </div>
    </section>
  );
}

function ProductStatement() {
  return (
    <section aria-label="Summary" className="border-y border-white/10">
      <Reveal className={`${container} flex flex-col items-center justify-center gap-2 py-8 text-center sm:flex-row sm:gap-5`}>
        <p className="text-xl font-medium tracking-tight text-white/50 sm:text-2xl">From code you read</p>
        <FiArrowRight aria-hidden="true" className="h-5 w-5 rotate-90 text-yellow-400 sm:rotate-0" />
        <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">to execution you understand</p>
      </Reveal>
    </section>
  );
}

function FeatureCard({ title, text, Icon, snippet, delay }) {
  return (
    <motion.article
      className="flex flex-col rounded-xl border border-white/10 bg-black p-5 transition-colors sm:p-6 hover:border-yellow-400/60"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <h3 className={`${type.h3} mt-5 text-white`}>{title}</h3>
      <p className={`${type.body} mt-2 text-white/65`}>{text}</p>
      <div className="mt-auto pt-6">
        <code className={`${type.label} inline-block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/70`}>
          {snippet}
        </code>
      </div>
    </motion.article>
  );
}

function Features() {
  return (
    <section id="features" className={`${sectionSpace} border-b border-white/10 bg-neutral-950`}>
      <div className={container}>
        <SectionHeading title="Learn Python by Seeing What Happens" />
        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Bigger preview with working Back / Next buttons.
// It only moves between the fixed demo steps. No Python runs here.
function InteractivePreview() {
  const [step, setStep] = useState(2);
  const total = loopProgram.steps.length;

  return (
    <section id="preview" className={sectionSpace}>
      <div className={container}>
        <SectionHeading
          title="See What Your Code Is Doing"
          subtitle="Python Visualizer turns program execution into something you can see and explore."
        />
        <Reveal className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <VisualizerPreview
            program={loopProgram}
            step={step}
            interactive
            onBack={() => setStep((s) => Math.max(0, s - 1))}
            onNext={() => setStep((s) => (s === total - 1 ? 0 : s + 1))}
          />
          <p className={`${type.label} mt-4 text-center text-white/40`}>
            Demo with a fixed example. No code is executed on this page.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className={`${sectionSpace} border-y border-white/10 bg-neutral-950`}>
      <div className={container}>
        <SectionHeading title="How It Works" />

        <ol className="relative mt-12 grid gap-12 sm:mt-14 md:grid-cols-3 md:gap-8">
          {/* Connector: vertical on mobile, horizontal from md up */}
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px bg-white/15 md:hidden">
            <motion.span
              className="block h-full w-full origin-top bg-yellow-400"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
            />
          </span>
          <span aria-hidden="true" className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px bg-white/15 md:block">
            <motion.span
              className="block h-full origin-left bg-yellow-400"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
            />
          </span>

          {howItWorks.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 0.1}
              className="relative flex gap-5 md:flex-col md:items-center md:text-center"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-yellow-400/50 bg-neutral-950 text-yellow-400">
                <step.Icon aria-hidden="true" className="h-5 w-5" />
              </span>

              <div className="min-w-0 pt-1.5 md:mt-5 md:pt-0">
                {/* Mobile: "01 -> Write Code" on one line. Desktop: number above title. */}
                <div className="flex items-center gap-2 md:flex-col md:gap-1">
                  <span className={`${type.label} text-yellow-400`}>{step.label}</span>
                  <FiArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/40 md:hidden" />
                  <h3 className={`${type.h3} text-white`}>{step.title}</h3>
                </div>
                <p className={`${type.body} mt-2 text-white/65 md:mx-auto md:max-w-xs`}>{step.text}</p>
              </div>

              {/* Mobile only: arrow pointing down to the next step */}
              {index < howItWorks.length - 1 && (
                <FiArrowDown
                  aria-hidden="true"
                  className="absolute left-6 top-full z-10 mt-6 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 text-yellow-400 md:hidden"
                />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className={sectionSpace}>
      <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <Reveal>
          <h2 className={`${type.h2} text-white`}>Built to Make Python Execution Visible</h2>
          <p className={`${type.lead} mt-5 max-w-xl text-white/65`}>
            Reading source code only tells you what a program says. Python Visualizer shows what actually happens when it runs: which line executes next, how each variable changes, and where things go wrong.
          </p>
          <p className={`${type.body} mt-4 max-w-xl text-white/55`}>
            It is made for learners and developers who want to understand how Python works inside, not just what the syntax looks like.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-5 sm:p-6">
              <p className={`${type.label} text-white/50`}>Reading the code</p>
              <code className={`${type.code} mt-4 block overflow-x-auto whitespace-nowrap text-white`}>total += i</code>
              <p className={`${type.small} mt-3 text-white/55`}>One line of source code.</p>
            </div>
            <div className="p-5 sm:p-6">
              <p className={`${type.label} text-white/50`}>Watching it run</p>
              <code className={`${type.code} mt-4 block overflow-x-auto whitespace-nowrap text-yellow-400`}>total: 0 &rarr; 1 &rarr; 3</code>
              <p className={`${type.small} mt-3 text-white/55`}>What it does, one step at a time.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
      <Reveal className="mx-auto max-w-6xl rounded-2xl bg-yellow-400 px-5 py-12 text-center sm:px-12 sm:py-14">
        <h2 className={`${type.h2} mx-auto max-w-2xl text-black`}>
          Ready to See Your Python Code Differently?
        </h2>
        <p className={`${type.lead} mx-auto mt-4 max-w-xl text-black/75`}>
          Start visualizing your Python programs and understand what happens behind the code.
        </p>
        <div className="mx-auto mt-8 flex max-w-xs flex-col md:max-w-none md:items-center">
          <Button href="/visualizer" variant="dark" icon={FiArrowRight}>Start Visualizing</Button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const footerLinks = [...navLinks, { label: "Login", href: "#" }, { label: "Sign Up", href: "#" }];

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className={`${container} py-10`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-semibold tracking-tight text-white">
              <FiTerminal aria-hidden="true" className="text-yellow-400" />
              Python Visualizer
            </p>
            <p className={`${type.small} mt-2 text-white/60`}>
              A step-by-step visual tool that helps beginners and developers understand how Python code runs.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className={`${type.small} flex flex-col font-medium text-white/60 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2`}>
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="block py-2.5 transition-colors hover:text-yellow-400 md:py-0">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={`${type.small} mt-8 border-t border-white/10 pt-6 text-white/40`}>
          &copy; {new Date().getFullYear()} Python Visualizer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  return (
    // reducedMotion="user" turns animations off for visitors who ask for it.
    <MotionConfig reducedMotion="user">
      <GlobalStyles />
      <div
        className={`${type.sans} min-h-screen overflow-x-clip bg-black text-base text-white antialiased [font-feature-settings:'cv11','ss01']`}
      >
        <Navbar />
        <main>
          <Hero />
          <ProductStatement />
          <Features />
          <InteractivePreview />
          <HowItWorks />
          <About />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}