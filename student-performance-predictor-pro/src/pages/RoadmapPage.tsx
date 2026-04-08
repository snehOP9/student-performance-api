import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function RoadmapPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Roadmap"
        title="What is next"
        subtitle="The premium product direction for future AI workflows, cohort intelligence, and personalization features."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          'Adaptive intervention sequencing',
          'Portfolio-level institution benchmarking',
          'Voice and chatbot-based student coaching',
        ].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>
    </MotionPage>
  )
}
