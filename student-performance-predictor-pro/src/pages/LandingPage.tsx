import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Building2,
  GraduationCap,
  Quote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Hero3DScene } from '../components/common/Hero3DScene'

const features = [
  'AI-driven risk prediction with uncertainty insight',
  'Personalized interventions with expected reduction score',
  'Institution, teacher, and student unified intelligence layer',
  'Weekly habit planner, streak system, and roadmap tracking',
]

const stats = [
  { label: 'Predictions generated', value: 13840, suffix: '+' },
  { label: 'Avg confidence', value: 82, suffix: '%' },
  { label: 'Institutions onboarded', value: 94, suffix: '+' },
  { label: 'Intervention success lift', value: 27, suffix: '%' },
]

const faqItems = [
  {
    question: 'How does risk prediction work?',
    answer:
      'The model combines study behavior, engagement, attendance, sleep, and educational context to estimate academic risk probability with confidence signals.',
  },
  {
    question: 'How should uncertainty be interpreted?',
    answer:
      'Uncertainty highlights how stable the prediction is. Higher uncertainty means more context is needed before making high-impact decisions.',
  },
  {
    question: 'Can institutions compare classes and departments?',
    answer:
      'Yes. Institutional analytics includes class-level and cohort-level comparisons with intervention outcome tracking and drill-down visibility.',
  },
]

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const duration = 1200
    const startedAt = performance.now()
    let raf = 0

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 24, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
            <p className="text-sm font-semibold tracking-wide text-cyan-200">
              Student Performance Predictor Pro
            </p>
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 lg:grid-cols-2">
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={revealItem}>
              <Badge>Predict risk. Improve outcomes. Empower every student.</Badge>
            </motion.div>
            <motion.h1
              variants={revealItem}
              className="mt-4 text-5xl font-black leading-tight md:text-6xl"
            >
              Ultra-intelligent academic forecasting, designed like a flagship SaaS product.
            </motion.h1>
            <motion.p variants={revealItem} className="mt-5 text-lg text-slate-300">
              Turn raw machine-learning signals into decision-grade insights with cinematic UX,
              explainable AI, and intervention-driven analytics.
            </motion.p>
            <motion.div variants={revealItem} className="mt-8 flex flex-wrap gap-3">
              <Link to="/onboarding">
                <Button size="lg">
                  Launch Onboarding
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Explore Live Dashboard
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={revealItem}
              className="mt-8 grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                  <p className="text-2xl font-bold text-cyan-200">
                    <CountUp target={item.value} suffix={item.suffix} />
                  </p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Card className="relative h-[380px] p-3">
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-300/10"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(34,211,238,0.1)',
                    '0 0 30px rgba(34,211,238,0.23)',
                    '0 0 0px rgba(34,211,238,0.1)',
                  ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Hero3DScene />
            </Card>
          </motion.div>
        </section>
      </div>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={revealItem} className="text-3xl font-bold">
          Core capabilities
        </motion.h2>
        <motion.div variants={revealItem} className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div key={feature} whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2 }}>
              <Card className="group relative overflow-hidden">
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-violet-500/0"
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '120%' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
                <div className="relative flex items-start gap-3">
                  <div className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-2 text-cyan-200">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-300">Capability {index + 1}</p>
                    <p className="mt-1 text-slate-100">{feature}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={revealItem} className="text-3xl font-bold">
          Built for every stakeholder
        </motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Students',
              icon: <GraduationCap className="mb-3 text-cyan-200" />,
              copy: 'Self-improvement roadmap, streaks, dynamic habit tracking, and explainable growth levers.',
            },
            {
              title: 'Teachers',
              icon: <Brain className="mb-3 text-cyan-200" />,
              copy: 'Class intervention intelligence, at-risk surfacing, and confidence-aware action recommendations.',
            },
            {
              title: 'Institutions',
              icon: <Building2 className="mb-3 text-cyan-200" />,
              copy: 'Cohort analytics, department comparison, intervention ROI visibility, and performance governance.',
            },
          ].map((item) => (
            <motion.div key={item.title} variants={revealItem} whileHover={{ y: -8 }}>
              <Card className="h-full">
                {item.icon}
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={revealItem} className="text-3xl font-bold">
          How it works
        </motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            'Collect student behavior signals',
            'Run risk + uncertainty inference',
            'Generate ranked interventions',
            'Track outcomes continuously',
          ].map((step, index) => (
            <motion.div key={step} variants={revealItem}>
              <Card className="relative overflow-hidden">
                <div className="absolute right-3 top-3 text-4xl font-black text-cyan-400/20">0{index + 1}</div>
                <p className="text-xs text-cyan-300">Step {index + 1}</p>
                <p className="mt-2 text-slate-100">{step}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={revealItem} className="text-3xl font-bold">
          Testimonials
        </motion.h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            'This transformed our intervention strategy and gave our educators confidence in each action plan.',
            'Students finally understand what to improve next, and engagement has become measurable.',
            'The uncertainty panel made our academic decisions safer and more transparent to stakeholders.',
          ].map((quote, index) => (
            <motion.div
              key={quote}
              variants={revealItem}
              whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
            >
              <Card className="h-full">
                <Quote className="mb-3 size-5 text-cyan-300" />
                <p className="text-slate-200">“{quote}”</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={revealItem} className="text-3xl font-bold">
          FAQ
        </motion.h2>
        <motion.div variants={revealItem} className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const isActive = activeFaq === index
            return (
              <Card key={item.question} className="cursor-pointer" onClick={() => setActiveFaq(index)}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-slate-100">{item.question}</p>
                  <motion.span animate={{ rotate: isActive ? 45 : 0 }} className="text-cyan-300">
                    +
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden text-sm text-slate-300"
                    >
                      {item.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-[1200px] px-4 pb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="relative overflow-hidden border-cyan-300/20 bg-gradient-to-r from-cyan-400/10 via-slate-900/60 to-violet-500/10">
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
            animate={{ x: ['-100%', '120%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Ready to launch</p>
              <h3 className="mt-2 text-2xl font-bold">
                Build the future of student outcomes with AI-guided intervention intelligence.
              </h3>
            </div>
            <Link to="/signup">
              <Button size="lg">
                Start Free Experience
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 text-sm text-slate-400">
          <p>© 2026 Student Performance Predictor Pro</p>
          <div className="flex gap-5">
            <Link to="/about">Methodology</Link>
            <Link to="/support">Support</Link>
            <a href="#">LinkedIn</a>
          </div>
          <ShieldCheck className="size-4" />
        </div>
      </footer>
    </div>
  )
}
