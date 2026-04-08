import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function AboutMethodologyPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Methodology"
        title="How the model thinks"
        subtitle="A concise explanation of how feature signals, uncertainty, and recommendation generation come together inside the product."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          'Behavioral features such as attendance, sleep, engagement, and study rhythm shape the prediction.',
          'Uncertainty estimates show when the model is stable enough for immediate action and when more context is needed.',
          'Recommendations translate risk drivers into operational interventions with expected impact.',
        ].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>
    </MotionPage>
  )
}
