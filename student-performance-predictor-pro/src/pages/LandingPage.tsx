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
  { label: 'Core prediction APIs', value: 3, suffix: '' },
  { label: 'Risk bands', value: 3, suffix: '' },
  { label: 'Top actions returned', value: 5, suffix: '' },
  { label: 'Uncertainty outputs', value: 2, suffix: '' },
]

const featureCards = [
  {
    title: 'Fast assessment workflow',
    description: 'Capture recent study, attendance, sleep, and context signals in a guided flow.',
    icon: BrainCircuit,
  },
  {
    title: 'Uncertainty-aware forecasting',
    description: 'Every risk estimate is paired with confidence and uncertainty for safer decisions.',
    icon: ShieldCheck,
  },
  {
    title: 'Personalized recommendations',
    description: 'Translate risk drivers into practical next steps and re-check impact in the next cycle.',
    icon: WandSparkles,
  },
  {
    title: 'Multi-role workspace',
    description: 'Student, teacher, and institutional views share one consistent analytics backbone.',
    icon: Layers3,
  },
]

const testimonials = [
  'The workflow helps us prioritize who needs support first, instead of guessing from intuition alone.',
  'Students get clearer next steps instead of only seeing a raw score output.',
  'Uncertainty flags help us decide when to gather more data before escalating interventions.',
]

const faqItems = [
  {
    question: 'What makes the prediction trustworthy?',
    answer:
      'Predictions combine behavioral and context signals and always include uncertainty. Use the result as decision support, not as a standalone final judgment.',
  },
  {
    question: 'Who is this product for?',
    answer:
      'Primary users are students, counselors, and educators who need early warning plus concrete intervention planning.',
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
    <div className="flex items-center gap-2 text-cyan-100">
      <Sparkles className="size-4 text-cyan-300" />
      <span>{typed}</span>
      <span className="inline-block h-5 w-px animate-pulse bg-cyan-300" />
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
              Decision-support for student success teams.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline">
                View workspace demo
                <Sparkles className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/assessment">
              <Button>
                Start assessment
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
              Predict risk,
              <span className="aurora-text block">plan interventions,</span>
              track outcomes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
              Use recent learning signals to estimate academic risk, review uncertainty, and choose the next support action.
              Designed for self-reflection, counseling, and educator-led intervention planning.
            </p>
            <div className="mt-6">
              <TypingHeroLine />
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <Card className="h-full">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Who it is for</p>
                <p className="mt-2 text-sm text-slate-200">Students, counselors, teachers, and student-success teams.</p>
              </Card>
              <Card className="h-full">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">How to use results</p>
                <p className="mt-2 text-sm text-slate-200">Treat outputs as decision support with human review.</p>
              </Card>
              <Card className="h-full">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trust and limits</p>
                <p className="mt-2 text-sm text-slate-200">Read methodology and model limitations before operational use.</p>
              </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/assessment">
                <Button size="lg">
                  Start live assessment
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button size="lg" variant="outline">
                  Start guided onboarding
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Explore workspace demo
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
            <NeuralHeroScene className="h-[35rem] lg:h-[38rem]" />
            <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-cyan-300/20 bg-slate-950/55 px-4 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-cyan-100/80 backdrop-blur-xl">
              Neural field active
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 max-w-[17rem] rounded-[1.35rem] border border-white/10 bg-slate-950/58 p-4 backdrop-blur-xl">
              <p className="text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">Live AI layer</p>
              <p className="mt-3 text-sm leading-6 text-slate-100">
                Risk estimates and uncertainty signals update in real time as inputs change.
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
              The interface is optimized for guided interpretation so users understand what changed risk and what to do next.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                'Input capture with transparent validation ranges',
                'Risk plus uncertainty surfaced together in decision views',
                'Direct links to methodology, limitations, privacy, and terms',
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
                  Start with a practical pilot workflow.
                </h2>
                <p className="mt-4 max-w-3xl text-slate-300">
                  Run an assessment, review uncertainty, apply the top recommendation, and re-check after one week.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/assessment">
                  <Button size="lg">
                    Run live assessment
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline">
                    View demo workspace
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
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/about">Methodology</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/limitations">Model limits</Link>
            <Link to="/governance">Model governance</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/support">Support</Link>
            <Link to="/roadmap">Roadmap</Link>
          </div>
          <ShieldCheck className="size-4" />
        </div>
      </footer>
    </div>
  )
}
