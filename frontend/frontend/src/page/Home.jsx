import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  FiTerminal,
  FiMenu,
  FiX,
  FiLogIn,
  FiUserPlus,
  FiArrowRight,
  FiPlay,
  FiPlayCircle,
  FiBox,
  FiCode,
  FiAlertTriangle,
  FiEdit3,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";




const type = {
  // Font families
  sans: "font-[family-name:Inter,ui-sans-serif,system-ui,sans-serif]",
  mono: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace]",

  
  h1: "text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl",
  h2: "text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
  h3: "text-lg font-semibold leading-snug tracking-tight",

 
  lead: "text-lg leading-relaxed sm:text-xl",
  body: "text-base leading-relaxed",
  small: "text-sm leading-relaxed",

  
  code: "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-sm leading-6",
  label:
    "font-[family-name:'JetBrains_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium",
};


function FontStyles() {
  return (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');`}</style>
  );
}

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
  },
  {
    title: "Variable Tracking",
    text: "Watch variables change as your program runs.",
    Icon: FiBox,
  },
  {
    title: "Function Visualization",
    text: "Understand function calls and how execution moves through your code.",
    Icon: FiCode,
  },
  {
    title: "Error Visualization",
    text: "See where your program fails and understand the error.",
    Icon: FiAlertTriangle,
  },
];

const steps = [
  { title: "Write Code", text: "Write or paste your Python program.", Icon: FiEdit3 },
  { title: "Visualize", text: "Run the program and inspect its execution step by step.", Icon: FiPlay },
  { title: "Understand", text: "Explore variables, output, function calls, and errors.", Icon: FiEye },
];

const codeLines = ["x = 10", "y = 20", "z = x + y", "print(z)"];
const currentLine = 3;
const variables = [
  { name: "x", value: "10" },
  { name: "y", value: "20" },
  { name: "z", value: "30" },
];

/* ---------- Animation helpers ---------- */

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

function Button({ href = "#", variant = "primary", icon: Icon, children }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  const styles = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300",
    secondary: "border border-white/25 text-white hover:border-yellow-400 hover:text-yellow-400",
    ghost: "text-white/75 hover:text-white hover:bg-white/10",
    dark: "bg-black text-yellow-400 hover:bg-neutral-900",
  };
  return (
    <motion.a
      href={href}
      className={`${base} ${styles[variant]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
      {children}
    </motion.a>
  );
}

function SectionHeading({ title }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <h2 className={`${type.h2} text-white`}>{title}</h2>
    </Reveal>
  );
}

/* ---------- Navbar ---------- */

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        <a href="#home" className="flex items-center gap-2 font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-black">
            <FiTerminal aria-hidden="true" className="h-4 w-4" />
          </span>
          Python Visualizer
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Button href={link.href} variant="ghost">
                {link.label}
              </Button>
            </li>
          ))}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button href="#" variant="ghost" icon={FiLogIn}>Login</Button>
          <Button href="#" icon={FiUserPlus}>Sign Up</Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-white/10 bg-black px-4 pb-4 pt-2 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`${type.body} block rounded-md px-3 py-2 font-medium text-white/80 hover:bg-white/10 hover:text-white`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <Button href="#" variant="secondary" icon={FiLogIn}>Login</Button>
              <Button href="#" icon={FiUserPlus}>Sign Up</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Visualizer preview (static mock of the real tool) ---------- */

function VisualizerPreview() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-white/15 bg-neutral-900 shadow-2xl shadow-yellow-400/5"
      role="img"
      aria-label="Preview of the Python Visualizer showing line 3 executing and the variables x, y and z"
    >
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        </div>
        <span className={`${type.label} text-white/60`}>main.py</span>
        <span className={`${type.label} text-white/60`}>Step 3 of 4</span>
      </div>

      <div className="grid sm:grid-cols-5">
        {/* Code editor */}
        <div className={`${type.code} bg-black py-4 sm:col-span-3`}>
          {codeLines.map((line, index) => {
            const lineNumber = index + 1;
            const isCurrent = lineNumber === currentLine;
            return (
              <div
                key={line}
                className={`flex items-center pr-4 ${
                  isCurrent
                    ? "border-l-2 border-yellow-400 bg-yellow-400/10"
                    : "border-l-2 border-transparent"
                }`}
              >
                <span className="w-10 select-none pr-3 text-right text-white/30">{lineNumber}</span>
                <span className={isCurrent ? "text-white" : "text-white/70"}>{line}</span>
                {isCurrent && (
                  <span className={`${type.label} ml-auto pl-3 text-yellow-400`}>running</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Execution panel */}
        <div className="border-t border-white/10 p-4 sm:col-span-2 sm:border-l sm:border-t-0">
          <p className={`${type.label} text-white/60`}>
            Current Line: <span className="font-semibold text-yellow-400">{currentLine}</span>
          </p>

          <h3 className={`${type.small} mt-4 font-semibold text-white`}>Variables</h3>
          <dl className={`${type.code} mt-2 divide-y divide-white/10 rounded-lg border border-white/10`}>
            {variables.map((v) => (
              <div key={v.name} className="flex items-center justify-between px-3 py-1">
                <dt className="text-white/60">{v.name}</dt>
                <dd
                  className={
                    v.name === "z"
                      ? "rounded bg-yellow-400 px-1.5 font-semibold text-black"
                      : "text-white"
                  }
                >
                  {v.value}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className={`${type.small} mt-4 font-semibold text-white`}>Output</h3>
          <div className={`${type.code} mt-2 rounded-lg border border-dashed border-white/20 px-3 py-1 text-white/40`}>
            waiting for print(z)
          </div>
        </div>
      </div>

      {/* Step controls (visual only) */}
      <div className={`${type.label} flex items-center justify-between border-t border-white/10 px-4 py-2`}>
        <span className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-white/70">
          <FiChevronLeft aria-hidden="true" /> Back
        </span>
        <div className="mx-4 h-1.5 flex-1 rounded-full bg-white/10">
          <div className="h-1.5 w-3/4 rounded-full bg-yellow-400" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-400 px-2 py-1 text-black">
          Next <FiChevronRight aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className={`${type.h1} text-white`}>Understand Python by Seeing It Execute</h1>
          <p className={`${type.lead} mt-5 max-w-xl text-white/65`}>
            Write Python code and watch how variables, loops, functions, and program execution change step by step.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/visualizer" icon={FiArrowRight}>Start Visualizing</Button>
            <Button href="#features" variant="secondary">Explore Features</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <VisualizerPreview />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ title, text, Icon, delay }) {
  return (
    <motion.article
      className="rounded-xl border border-white/10 bg-black p-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4, borderColor: "rgba(250, 204, 21, 0.6)" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <h3 className={`${type.h3} mt-4 text-white`}>{title}</h3>
      <p className={`${type.body} mt-2 text-white/65`}>{text}</p>
    </motion.article>
  );
}

function Features() {
  return (
    <section id="features" className="border-y border-white/10 bg-neutral-950 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title="Learn Python by Seeing What Happens" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading title="How It Works" />
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={index * 0.08} className="border-t border-white/20 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                <step.Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className={`${type.label} text-yellow-400`}>Step {index + 1}</span>
            </div>
            <h3 className={`${type.h3} mt-3 text-white`}>{step.title}</h3>
            <p className={`${type.body} mt-2 text-white/65`}>{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <Reveal className="mx-auto max-w-6xl rounded-2xl bg-yellow-400 px-6 py-14 text-center sm:px-12">
        <h2 className={`${type.h2} mx-auto max-w-2xl text-black`}>
          Ready to See Your Python Code Differently?
        </h2>
        <p className={`${type.lead} mx-auto mt-4 max-w-xl text-black/75`}>
          Start visualizing your Python programs and understand what happens behind the code.
        </p>
        <div className="mt-8 flex justify-center">
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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
            <ul className={`${type.small} flex flex-wrap gap-x-6 gap-y-2 font-medium text-white/60`}>
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-yellow-400">
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
    
    <MotionConfig reducedMotion="user">
      <FontStyles />
     
      <div
        className={`${type.sans} min-h-screen scroll-smooth bg-black text-base text-white antialiased [font-feature-settings:'cv11','ss01']`}
      >
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}