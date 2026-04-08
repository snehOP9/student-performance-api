import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  Layers3,
  Quote,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { NeuralHeroScene } from '../components/three/NeuralHeroScene'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

const heroPhrases = [
  'Predict risk before it compounds.',
  'Turn uncertainty into action.',
  'Design interventions with AI precision.',
]

const heroStats = [
  { label: 'Predictions generated', value: 13840, suffix: '+' },
  { label: 'Average confidence', value: 82, suffix: '%' },
  { label: 'Institutions onboarded', value: 94, suffix: '+' },
  { label: 'Intervention lift', value: 27, suffix: '%' },
]

const featureCards = [
  {
    title: 'Cinematic prediction workflows',
    description: 'A flagship product experience with depth, glow, 3D motion, and decision-ready clarity.',
    icon: BrainCircuit,
  },
  {
    title: 'Confidence-aware forecasting',
    description: 'Risk is paired with uncertainty so teams can act boldly without acting blindly.',
    icon: ShieldCheck,
  },
  {
    title: 'Personalized recommendations',
    description: 'The model transforms raw signals into interventions, timelines, and weekly action plans.',
    icon: WandSparkles,
  },
  {
    title: 'Institutional intelligence',
    description: 'Teacher, admin, and student views stay in sync across cohorts, classes, and individual journeys.',
    icon: Layers3,
  },
]

const testimonials = [
  'The product feels like a mission-control layer for academic success. It changed how our teachers intervene.',
  'Students finally understand what to do next instead of just seeing a scary score.',
  'The confidence layer gave our leadership team the clarity to trust the model in real planning cycles.',
]

const faqItems = [
  {
    question: 'What makes the prediction trustworthy?',
    answer:
      'The model combines engagement, attendance, sleep, study behavior, and context variables, then pairs the result with uncertainty to show how stable that forecast really is.',
  },
  {
    question: 'Who is this product for?',
    answer:
      'Students, teachers, counselors, and institution leaders all get tailored interfaces built on the same prediction core.',
  },
  {
    question: 'Does it still work when the API is offline?',
    answer:
      'Yes. The interface falls back to seeded demo data so teams can keep exploring the product experience without interruption.',
  },
]

function TypingHeroLine() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let timeout = 0
    const phrase = heroPhrases[phraseIndex]

    if (typed.length < phrase.length) {
      timeout = window.setTimeout(() => setTyped(phrase.slice(0, typed.length + 1)), 48)
    } else {
      timeout = window.setTimeout(() => {
        setTyped('')
        setPhraseIndex((current) => (current + 1) % heroPhrases.length)
      }, 1800)
    }

    return () => window.clearTimeout(timeout)
  }, [phraseIndex, typed])

  return (
    <div className="flex min-h-6 items-center gap-2 text-cyan-100">
      <Sparkles className="size-4 text-cyan-300" />
      <span>{typed}</span>
    </div>
  )
}

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <div className="min-h-screen overflow-x-hidden text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_25%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_32%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-[1320px] items-center justify-between px-4 py-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-cyan-300/80">
              Student Performance Predictor Pro
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Premium academic intelligence for the next generation of schools.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 pb-16 pt-10">
        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <Badge>Immersive AI forecasting platform</Badge>
            <h1 className="mt-5 text-5xl font-bold leading-[0.95] md:text-7xl">
              Build an
              <span className="aurora-text block">intervention engine</span>
              for every student.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
              Student Performance Predictor Pro blends machine learning, elegant motion, and 3D storytelling into a
              product experience that feels fundable, futuristic, and ready for real educational teams.
            </p>
            <div className="mt-6">
              <TypingHeroLine />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/onboarding">
                <Button size="lg">
                  Start guided onboarding
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Explore live product
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                >
                  <Card className="h-full">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                      <AnimatedCounter value={item.value} suffix={item.suffix} />
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 32 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-cyan-400/10 blur-3xl" />
            <NeuralHeroScene className="min-h-[35rem] lg:min-h-[38rem]" />
            <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-cyan-300/20 bg-slate-950/55 px-4 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-cyan-100/80 backdrop-blur-xl">
              Neural field active
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 max-w-[17rem] rounded-[1.35rem] border border-white/10 bg-slate-950/58 p-4 backdrop-blur-xl">
              <p className="text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">Live AI layer</p>
              <p className="mt-3 text-sm leading-6 text-slate-100">
                Confidence-aware signals, intervention mapping, and predictive orbit visuals are running in real time.
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 grid gap-2">
              {[
                ['Risk mapping', 'online'],
                ['Uncertainty band', 'stable'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.15rem] border border-white/10 bg-slate-950/58 px-4 py-3 text-right backdrop-blur-xl"
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm text-cyan-100">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={title}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <Card className="h-full">
                <div className="rounded-[1.25rem] border border-cyan-300/25 bg-cyan-400/10 p-3 text-cyan-100 w-fit">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-18 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.92),rgba(8,15,34,0.68),rgba(168,85,247,0.08))]">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">AI visualization layer</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Not a dashboard. A cinematic command center.</h2>
            <p className="mt-4 text-slate-300">
              The interface uses depth, motion, and subtle 3D environments to make predictive analytics feel intuitive,
              alive, and premium instead of static and spreadsheet-like.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                '3D neural hero scenes with pointer-reactive motion',
                'Glow-based risk language that changes with confidence',
                'Animated forms, counters, panels, and onboarding journeys',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {['Students', 'Teachers', 'Institutions'].map((title, index) => (
              <motion.div
                key={title}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <GraduationCap className="size-5 text-cyan-200" />
                  <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {title === 'Students'
                      ? 'See progress, risk, and next-best actions with clarity.'
                      : title === 'Teachers'
                        ? 'Spot students drifting early and trigger better interventions.'
                        : 'Monitor cohorts, compare programs, and govern outcomes at scale.'}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-18 grid gap-4 lg:grid-cols-3">
          {testimonials.map((quote, index) => (
            <motion.div
              key={quote}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -0.4 : 0.4 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full">
                <Quote className="size-5 text-cyan-200" />
                <p className="mt-4 text-slate-200">{quote}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-18 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <Card>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Questions teams ask before they commit.</h2>
            <p className="mt-4 text-slate-300">
              The product is designed for live demos, pilot rollouts, and serious stakeholder conversations.
            </p>
          </Card>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isActive = activeFaq === index
              return (
                <Card
                  key={item.question}
                  className="cursor-pointer"
                  onClick={() => setActiveFaq(index)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base text-slate-100">{item.question}</p>
                    <motion.span animate={{ rotate: isActive ? 45 : 0 }} className="text-cyan-300">
                      +
                    </motion.span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden text-sm leading-6 text-slate-300"
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-18">
          <Card className="overflow-hidden border-cyan-300/20 bg-[linear-gradient(120deg,rgba(8,15,34,0.96),rgba(8,15,34,0.8),rgba(34,211,238,0.08))]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Launch your showcase</p>
                <h2 className="mt-3 text-4xl font-bold text-white">
                  Turn student risk forecasting into your standout product story.
                </h2>
                <p className="mt-4 max-w-3xl text-slate-300">
                  This is the kind of interface that wins attention in demos, portfolios, and real stakeholder rooms.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button size="lg">
                    Start free experience
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline">
                    Enter dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 text-sm text-slate-400">
          <p>2026 Student Performance Predictor Pro</p>
          <div className="flex items-center gap-5">
            <Link to="/about">Methodology</Link>
            <Link to="/support">Support</Link>
            <Link to="/roadmap">Roadmap</Link>
          </div>
          <ShieldCheck className="size-4" />
        </div>
      </footer>
    </div>
  )
}
