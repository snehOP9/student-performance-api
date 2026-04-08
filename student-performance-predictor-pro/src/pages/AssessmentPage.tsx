import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { OrbitLoaderScene } from '../components/three/OrbitLoaderScene'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'
import { getRecommendations, getUncertainty, predictRisk } from '../lib/api'
import type { AssessmentPayload } from '../types'

const schema = z.object({
  study_hours_sum: z.number().min(0).max(120),
  study_hours_mean: z.number().min(0).max(12),
  clicks_sum: z.number().min(0).max(400),
  resources_sum: z.number().min(0).max(80),
  forum_posts_sum: z.number().min(0).max(50),
  attendance_mean: z.number().min(0).max(1),
  sleep_mean: z.number().min(0).max(12),
  study_habits_index_mean: z.number().min(0).max(100),
  consistency_score_mean: z.number().min(0).max(100),
  cramming_indicator_mean: z.number().min(0).max(1),
  age: z.number().min(10).max(40),
  gender_F: z.number().min(0).max(1),
  gender_M: z.number().min(0).max(1),
  gender_Other: z.number().min(0).max(1),
  socio_econ_low: z.number().min(0).max(1),
  socio_econ_middle: z.number().min(0).max(1),
  socio_econ_high: z.number().min(0).max(1),
  school_type_public: z.number().min(0).max(1),
  school_type_private: z.number().min(0).max(1),
  parent_education_none: z.number().min(0).max(1),
  parent_education_primary: z.number().min(0).max(1),
  parent_education_secondary: z.number().min(0).max(1),
  parent_education_bachelor: z.number().min(0).max(1),
  parent_education_master_: z.number().min(0).max(1),
  internet_access: z.number().min(0).max(1),
  tutoring: z.number().min(0).max(1),
})

type FormValues = z.infer<typeof schema>
type StepConfig = { id: string; title: string; subtitle: string }

const steps: StepConfig[] = [
  { id: 'study', title: 'Study signals', subtitle: 'Capture rhythm, volume, habits, and cramming intensity.' },
  { id: 'engagement', title: 'Engagement signals', subtitle: 'Measure clicks, resources, forum activity, and attendance.' },
  { id: 'identity', title: 'Learner identity', subtitle: 'Model sleep, age, and represented demographic factors.' },
  { id: 'context', title: 'Learning context', subtitle: 'Map socio-economic context, school type, and parent education.' },
]

const genderChoices = {
  gender_F: 'Female',
  gender_M: 'Male',
  gender_Other: 'Other',
} as const

const socioChoices = {
  socio_econ_low: 'Low',
  socio_econ_middle: 'Middle',
  socio_econ_high: 'High',
} as const

const schoolChoices = {
  school_type_public: 'Public',
  school_type_private: 'Private',
} as const

const parentChoices = {
  parent_education_none: 'None',
  parent_education_primary: 'Primary',
  parent_education_secondary: 'Secondary',
  parent_education_bachelor: 'Bachelor',
  parent_education_master_: 'Master+',
} as const

export function AssessmentPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { assessmentDraft, saveDraft, setPredictionBundle } = useAppStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: assessmentDraft,
  })

  const values = form.watch()
  const progress = ((step + 1) / steps.length) * 100

  const setExclusiveChoice = (
    keys: readonly (keyof FormValues)[],
    selected: keyof FormValues,
  ) => {
    keys.forEach((key) => {
      form.setValue(key, key === selected ? 1 : 0, { shouldDirty: true, shouldTouch: true })
    })
  }

  const getSelectionLabel = (
    choices: Record<string, string>,
    fallback: string,
  ) => {
    const selectedKey = Object.keys(choices).find((key) => values[key as keyof FormValues] === 1)
    return selectedKey ? choices[selectedKey] : fallback
  }

  const saveCurrentDraft = () => {
    const snapshot = form.getValues()
    saveDraft(snapshot as AssessmentPayload)
    toast.success('Assessment draft saved')
  }

  const submitPrediction = form.handleSubmit(async (payload) => {
    setIsSubmitting(true)
    saveDraft(payload as AssessmentPayload)

    try {
      const [prediction, uncertainty, recommendations] = await Promise.all([
        predictRisk(payload as AssessmentPayload),
        getUncertainty(payload as AssessmentPayload),
        getRecommendations(payload as AssessmentPayload),
      ])

      setPredictionBundle({
        prediction,
        uncertainty,
        recommendations,
      })

      toast.success('Prediction suite generated')
      navigate('/prediction')
    } catch {
      toast.error('Could not complete the prediction flow')
    } finally {
      setIsSubmitting(false)
    }
  })

  const summaryItems = [
    { label: 'Study hours / week', value: `${values.study_hours_sum}h` },
    { label: 'Attendance', value: `${Math.round(values.attendance_mean * 100)}%` },
    { label: 'Sleep', value: `${values.sleep_mean.toFixed(1)}h` },
    { label: 'Consistency', value: `${values.consistency_score_mean}` },
    { label: 'Gender', value: getSelectionLabel(genderChoices, 'Female') },
    { label: 'Socio-economic', value: getSelectionLabel(socioChoices, 'Middle') },
    { label: 'School type', value: getSelectionLabel(schoolChoices, 'Public') },
    { label: 'Parent education', value: getSelectionLabel(parentChoices, 'Secondary') },
  ]

  const renderSlider = (
    name: keyof FormValues,
    label: string,
    min: number,
    max: number,
    stepValue: number,
    hint: string,
    suffix = '',
    formatValue?: (value: number) => string,
  ) => (
    <div className="rounded-[1.45rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
          {formatValue ? formatValue(values[name]) : `${values[name]}${suffix}`}
        </div>
      </div>
      <input
        className="mt-5"
        type="range"
        min={min}
        max={max}
        step={stepValue}
        {...form.register(name, { valueAsNumber: true })}
      />
      <div className="mt-3 flex justify-between text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">
        <span>{formatValue ? formatValue(min) : `${min}${suffix}`}</span>
        <span>{formatValue ? formatValue(max) : `${max}${suffix}`}</span>
      </div>
    </div>
  )

  const renderChoiceButtons = (
    title: string,
    choices: Record<string, string>,
    hint: string,
  ) => (
    <div className="rounded-[1.45rem] border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(choices).map(([key, label]) => {
          const active = values[key as keyof FormValues] === 1
          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                setExclusiveChoice(
                  Object.keys(choices) as Array<keyof FormValues>,
                  key as keyof FormValues,
                )
              }
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-400/14 text-cyan-100'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/25'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderBinaryToggle = (
    name: 'internet_access' | 'tutoring',
    title: string,
    description: string,
  ) => {
    const active = values[name] === 1
    return (
      <button
        type="button"
        onClick={() => form.setValue(name, active ? 0 : 1, { shouldDirty: true, shouldTouch: true })}
        className={`rounded-[1.45rem] border p-4 text-left transition ${
          active
            ? 'border-cyan-300/30 bg-cyan-400/10'
            : 'border-white/10 bg-white/5 hover:border-cyan-300/20'
        }`}
      >
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-200">{active ? 'Enabled' : 'Disabled'}</span>
          <span
            className={`inline-flex h-6 w-11 rounded-full p-1 transition ${
              active ? 'bg-cyan-400/40' : 'bg-white/10'
            }`}
          >
            <span
              className={`size-4 rounded-full bg-white transition ${
                active ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </div>
      </button>
    )
  }

  const renderStepContent = () => {
    switch (steps[step].id) {
      case 'study':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderSlider('study_hours_sum', 'Weekly study hours', 0, 80, 1, 'Total study time captured across the week.', 'h')}
            {renderSlider('study_hours_mean', 'Daily study average', 0, 12, 0.5, 'Average focused hours per active study day.', 'h')}
            {renderSlider('study_habits_index_mean', 'Study habits index', 0, 100, 1, 'Composite quality score for planning and focus discipline.')}
            {renderSlider('consistency_score_mean', 'Consistency score', 0, 100, 1, 'Measures how evenly effort is spread across the week.')}
            <div className="md:col-span-2">
              {renderSlider(
                'cramming_indicator_mean',
                'Cramming indicator',
                0,
                1,
                0.01,
                'Higher values indicate deadline-heavy behavior and compressed revision windows.',
                '%',
                (value) => `${Math.round(value * 100)}%`,
              )}
            </div>
          </div>
        )
      case 'engagement':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderSlider('clicks_sum', 'Platform clicks', 0, 300, 1, 'Total academic platform interactions.')}
            {renderSlider('resources_sum', 'Resources consumed', 0, 60, 1, 'Videos, PDFs, quizzes, and linked resources opened.')}
            {renderSlider('forum_posts_sum', 'Forum activity', 0, 40, 1, 'Discussion posts, replies, and learning-community activity.')}
            {renderSlider(
              'attendance_mean',
              'Attendance average',
              0,
              1,
              0.01,
              'Session presence across the measured period.',
              '%',
              (value) => `${Math.round(value * 100)}%`,
            )}
          </div>
        )
      case 'identity':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderSlider('sleep_mean', 'Average sleep', 0, 12, 0.1, 'The model uses sleep consistency as a recovery and retention signal.', 'h')}
            {renderSlider('age', 'Age', 10, 30, 1, 'Age is included for contextual calibration only.')}
            <div className="md:col-span-2">
              {renderChoiceButtons('Gender representation', genderChoices, 'One-hot encoded demographic context used by the model.')}
            </div>
          </div>
        )
      default:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderChoiceButtons('Socio-economic context', socioChoices, 'Choose the context bucket currently represented in the feature set.')}
            {renderChoiceButtons('School type', schoolChoices, 'Select the current institution type signal.')}
            <div className="md:col-span-2">
              {renderChoiceButtons('Parent education', parentChoices, 'Used as part of broader educational support context.')}
            </div>
            {renderBinaryToggle('internet_access', 'Internet access', 'Signals reliable digital access for online learning resources.')}
            {renderBinaryToggle('tutoring', 'Tutoring support', 'Indicates whether the learner currently receives external tutoring help.')}
          </div>
        )
    }
  }

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Assessment flow"
        title="Immersive multi-step intake"
        subtitle="Capture every prediction feature with animated controls, live summaries, and a one-click path into the FastAPI prediction workflow."
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Step progress</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{steps[step].title}</h3>
              <p className="mt-2 text-sm text-slate-300">{steps[step].subtitle}</p>
            </div>
            <div className="rounded-[1.2rem] border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Progress</p>
              <p className="mt-1 text-2xl font-bold text-white">{Math.round(progress)}%</p>
            </div>
          </div>

          <div className="mt-5 h-2 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {steps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(index)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  index === step
                    ? 'border-cyan-300/30 bg-cyan-400/14 text-cyan-100'
                    : index < step
                      ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
                      : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {index + 1}. {item.title}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[step].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={step === steps.length - 1}
              onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
            >
              Next
            </Button>
            <Button type="button" variant="outline" onClick={saveCurrentDraft}>
              <Save className="mr-2 size-4" />
              Save draft
            </Button>
            <Button type="button" onClick={submitPrediction} disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Predict performance'}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Live summary</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Prediction-ready snapshot</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Smart note</p>
              <p className="mt-2 text-sm text-slate-100">
                Attendance plus consistency will likely dominate the next prediction unless cramming intensity and sleep
                both shift significantly.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {isSubmitting ? (
              <OrbitLoaderScene className="min-h-[18rem]" />
            ) : (
              <div className="space-y-4">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">FastAPI workflow</p>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
                  POST /predict
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
                  POST /uncertainty
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
                  POST /recommend
                </div>
                <div className="rounded-[1.25rem] border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-slate-100">
                  <Sparkles className="mb-2 size-4 text-cyan-200" />
                  The app will run all three services in parallel, store the bundle, and route directly into the 3D result
                  experience.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MotionPage>
  )
}
