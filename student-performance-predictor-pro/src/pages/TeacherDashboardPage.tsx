import { Card } from '../components/ui/card'
import { SectionTitle } from '../components/common/SectionTitle'

export function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Teacher Dashboard" subtitle="Class-level AI insights and intervention tracking" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>Class engagement: 81%</Card>
        <Card>Students at risk: 9</Card>
        <Card>Interventions active: 14</Card>
      </div>
      <Card>
        <h3 className="text-lg font-semibold">Class-level analytics cards</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">10-A: Improving trend (+6%)</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">10-B: Attention required (attendance dip)</div>
        </div>
      </Card>
    </div>
  )
}
