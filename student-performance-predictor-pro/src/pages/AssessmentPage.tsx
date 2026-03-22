import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, Save } from 'lucide-react'
import { toast } from 'sonner'
import { defaultAssessment } from '../data/mock'
import { useAppStore } from '../store/appStore'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import type { AssessmentPayload } from '../types'
import { SectionTitle } from '../components/common/SectionTitle'

const schema = z.object({
  study_hours_mean: z.number().min(0).max(24),
  attendance_mean: z.number().min(0).max(100),
  sleep_mean: z.number().min(0).max(12),
  consistency_score_mean: z.number().min(0).max(100),
  age: z.number().min(10).max(40),
})

type FormValues = z.infer<typeof schema>

const steps = ['Study patterns', 'Learning engagement', 'Lifestyle', 'Demographics', 'Educational background']

export function AssessmentPage() {
  const [step, setStep] = useState(0)
  const { saveDraft, assessmentDraft } = useAppStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      study_hours_mean: assessmentDraft.study_hours_mean,
      attendance_mean: assessmentDraft.attendance_mean,
      sleep_mean: assessmentDraft.sleep_mean,
      consistency_score_mean: assessmentDraft.consistency_score_mean,
      age: assessmentDraft.age,
    },
  })

  const values = form.watch()

  const saveAsDraft = () => {
    const merged: AssessmentPayload = { ...defaultAssessment, ...assessmentDraft, ...values }
    saveDraft(merged)
    toast.success('Assessment draft saved')
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Student Assessment" subtitle="Multi-step intelligent intake with live summary" />
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {steps.map((item, idx) => (
            <button key={item} onClick={() => setStep(idx)} className={`rounded-full px-3 py-1 text-xs ${idx <= step ? 'bg-cyan-400/20 text-cyan-200' : 'bg-white/5 text-slate-400'}`}>
              {idx + 1}. {item}
            </button>
          ))}
        </div>

        <form className="grid gap-4 lg:grid-cols-2" onSubmit={form.handleSubmit(saveAsDraft)}>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-slate-300">Study hours mean (slider-like numeric)</p>
              <Input type="number" step="0.1" {...form.register('study_hours_mean', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-cyan-300">Smart suggestion: target 6-8 consistent hours weekly average.</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Attendance mean</p>
              <Input type="number" {...form.register('attendance_mean', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-cyan-300">Smart suggestion: keep attendance above 90% for best outcomes.</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Sleep mean</p>
              <Input type="number" step="0.1" {...form.register('sleep_mean', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-cyan-300">Smart suggestion: 7-8 hours improves retention and consistency.</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Consistency score</p>
              <Input type="number" {...form.register('consistency_score_mean', { valueAsNumber: true })} />
            </div>
            <div>
              <p className="mb-1 text-sm text-slate-300">Age</p>
              <Input type="number" {...form.register('age', { valueAsNumber: true })} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep((prev) => Math.max(0, prev - 1))}>Previous</Button>
              <Button type="button" variant="outline" onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}>Next</Button>
              <Button type="submit"><Save className="mr-1 size-4" />Save draft</Button>
            </div>
          </div>

          <Card className="bg-slate-900/50">
            <p className="text-sm text-slate-400">Live summary</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Assessment snapshot</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>Study: {values.study_hours_mean ?? 0} hrs</li>
              <li>Attendance: {values.attendance_mean ?? 0}%</li>
              <li>Sleep: {values.sleep_mean ?? 0} hrs</li>
              <li>Consistency: {values.consistency_score_mean ?? 0}</li>
              <li>Age: {values.age ?? 0}</li>
            </ul>
            <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-xs text-cyan-200">
              <Sparkles className="mb-2 size-4" />
              Tooltips + inline validation + toggle chips can be progressively expanded with domain-specific controls.
            </div>
          </Card>
        </form>
      </Card>
    </div>
  )
}
