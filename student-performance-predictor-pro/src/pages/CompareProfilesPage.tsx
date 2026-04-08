import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'
import { comparisonProfiles } from '../data/mock'

export function CompareProfilesPage() {
  const [studentA, studentB] = comparisonProfiles

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Compare students"
        title="Parallel profile comparison"
        subtitle="Line up two learner journeys side by side and spotlight where the next intervention should focus."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {[studentA, studentB].map((student) => (
          <Card key={student.id}>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{student.track}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{student.name}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Risk: {student.risk}%</div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Attendance: {student.attendance}%</div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Sleep: {student.sleep}h</div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">Consistency: {student.consistency}%</div>
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-slate-100">{student.momentum}</div>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-200/80">Comparison insight</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">What separates the two profiles</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {studentB.name} holds an 8.4-point lower risk because attendance and sleep are both more stable. The next
          intervention for {studentA.name} should focus on recovery rhythm before adding more study load.
        </p>
      </Card>
    </MotionPage>
  )
}
