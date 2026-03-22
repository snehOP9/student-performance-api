import { Card } from '../components/ui/card'
import { SectionTitle } from '../components/common/SectionTitle'

export function CompareProfilesPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Compare 2 Student Profiles" subtitle="Parallel risk diagnostics and benchmark deltas" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Student A</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            <li>Risk: 41.6%</li>
            <li>Attendance: 89%</li>
            <li>Sleep: 7.1h</li>
            <li>Consistency: 78%</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Student B</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            <li>Risk: 33.2%</li>
            <li>Attendance: 93%</li>
            <li>Sleep: 7.8h</li>
            <li>Consistency: 84%</li>
          </ul>
        </Card>
      </div>
      <Card>
        <h3 className="text-lg font-semibold">Comparison insights</h3>
        <p className="mt-2 text-sm text-slate-300">Student B shows stronger attendance and sleep consistency, correlating with 8.4-point lower risk.</p>
      </Card>
    </div>
  )
}
