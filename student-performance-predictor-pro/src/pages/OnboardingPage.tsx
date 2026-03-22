import { useState } from 'react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { SectionTitle } from '../components/common/SectionTitle'

const steps = [
  'Define your role (student/teacher/admin)',
  'Connect baseline data and preferences',
  'Choose intervention goals and alerts',
]

export function OnboardingPage() {
  const [index, setIndex] = useState(0)

  return (
    <div className="space-y-6">
      <SectionTitle title="Multi-step Onboarding" subtitle="Personalized setup flow before first prediction" />
      <Card>
        <p className="text-sm text-slate-400">Step {index + 1} / {steps.length}</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{steps[index]}</h3>
        <div className="mt-5 h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" onClick={() => setIndex((i) => Math.max(i - 1, 0))}>Back</Button>
          <Button onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}>Continue</Button>
        </div>
      </Card>
    </div>
  )
}
