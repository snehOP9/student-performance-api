import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { SectionTitle } from '../components/common/SectionTitle'

export function RoadmapPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Student Self-Improvement Roadmap" subtitle="Milestones, achievements, and streak progression" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><Badge>Achievement</Badge><p className="mt-2">7-day consistency streak unlocked</p></Card>
        <Card><Badge>Milestone</Badge><p className="mt-2">Attendance stabilized above 90%</p></Card>
        <Card><Badge>Next target</Badge><p className="mt-2">Reduce cramming index below 20%</p></Card>
      </div>
      <Card>
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>Week 1: Baseline diagnostics and planner setup</p>
          <p>Week 2: Sleep + study block stabilization</p>
          <p>Week 3: Engagement amplification sprint</p>
          <p>Week 4: Risk reassessment and optimization plan</p>
        </div>
      </Card>
    </div>
  )
}
