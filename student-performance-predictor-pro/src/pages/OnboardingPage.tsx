import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

export function OnboardingPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Onboarding"
        title="Guided launch sequence"
        subtitle="A premium walkthrough that introduces the platform, prediction model, and intervention workflow in a few polished steps."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          'Connect the assessment workflow',
          'Review the 3D prediction result view',
          'Activate weekly interventions and analytics',
        ].map((item, index) => (
          <Card key={item}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Step 0{index + 1}</p>
            <p className="mt-3 text-lg font-semibold text-white">{item}</p>
          </Card>
        ))}
      </div>

      <Button>Start onboarding overlay</Button>
    </MotionPage>
  )
}
