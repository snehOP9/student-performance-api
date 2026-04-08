import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function TeacherDashboardPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Teacher view"
        title="Classroom intervention board"
        subtitle="A focused teacher workflow for spotting who needs support, where momentum is improving, and which actions to trigger next."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {['Students needing follow-up: 8', 'Average class confidence: 81%', 'Completed interventions this week: 14'].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>

      <Card>
        <h3 className="text-2xl font-semibold text-white">Teacher workflow notes</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Use this board to review the latest prediction shifts, prioritize outreach, and assign coaching check-ins for the
          current class roster.
        </p>
      </Card>
    </MotionPage>
  )
}
