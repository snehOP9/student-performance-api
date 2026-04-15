import { useMemo } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { AnalyticsPillarsScene } from '../components/three/AnalyticsPillarsScene'
import { MotionPage } from '../components/common/MotionPage'
import { SearchFilters } from '../components/common/SearchFilters'
import { SectionTitle } from '../components/common/SectionTitle'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { cohortDistribution } from '../data/mock'
import { useAppStore } from '../store/appStore'
import type { InterventionStatus, RiskBand } from '../types'

const statusOrder: InterventionStatus[] = ['Needs triage', 'In progress', 'Escalate', 'Resolved']

function riskClass(riskBand: RiskBand) {
  if (riskBand === 'High') return 'border-red-300/25 bg-red-500/10 text-red-100'
  if (riskBand === 'Moderate') return 'border-amber-300/25 bg-amber-500/10 text-amber-100'
  return 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100'
}

function statusClass(status: InterventionStatus) {
  if (status === 'Resolved') return 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100'
  if (status === 'In progress') return 'border-cyan-300/25 bg-cyan-500/10 text-cyan-100'
  if (status === 'Escalate') return 'border-red-300/25 bg-red-500/10 text-red-100'
  return 'border-amber-300/25 bg-amber-500/10 text-amber-100'
}

function nextStatus(current: InterventionStatus): InterventionStatus {
  const currentIndex = statusOrder.indexOf(current)
  return statusOrder[(currentIndex + 1) % statusOrder.length]
}

export function InstitutionalDashboardPage() {
  const { cohortQueue, updateCohortStatus } = useAppStore()

  const queueMetrics = useMemo(() => {
    const atRiskCount = cohortQueue.filter((row) => row.riskBand !== 'Low').length
    const inProgressCount = cohortQueue.filter((row) => row.status === 'In progress').length
    const escalatedCount = cohortQueue.filter((row) => row.status === 'Escalate').length
    const resolvedCount = cohortQueue.filter((row) => row.status === 'Resolved').length

    return { atRiskCount, inProgressCount, escalatedCount, resolvedCount }
  }, [cohortQueue])

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Admin command center"
        title="Institutional intelligence"
        subtitle="A triage-first view for cohort surveillance, intervention ownership, and status governance."
      />

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.78),rgba(34,211,238,0.08))]">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Cohort health</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Live institutional risk surface</h3>
          <p className="mt-3 text-slate-300">
            Track how performance risk moves across departments, classes, and intervention waves in one operational control room.
          </p>
        </Card>
        <AnalyticsPillarsScene values={[46, 52, 68, 74, 83]} />
      </div>

      <SearchFilters placeholder="Search departments, classes, or individual students..." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>At-risk students: {queueMetrics.atRiskCount}</Card>
        <Card>In progress: {queueMetrics.inProgressCount}</Card>
        <Card>Escalated: {queueMetrics.escalatedCount}</Card>
        <Card>Resolved: {queueMetrics.resolvedCount}</Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Risk distribution</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Cohort breakdown</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cohortDistribution} dataKey="value" nameKey="name" outerRadius={108} fill="#67e8f9" />
                <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Student matrix</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Operational triage queue</h3>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Owner</th>
                  <th className="pb-3">Next review</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cohortQueue.map((row) => (
                  <tr key={row.id} className="border-t border-white/10 text-slate-200">
                    <td className="py-3">
                      <p className="font-medium text-white">{row.studentName}</p>
                      <p className="text-xs text-slate-400">Updated {row.lastUpdated}</p>
                    </td>
                    <td className="py-3">{row.className}</td>
                    <td className="py-3">
                      <Badge className={riskClass(row.riskBand)}>{row.riskBand}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge className={statusClass(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="py-3">{row.owner}</td>
                    <td className="py-3">{row.nextReview}</td>
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCohortStatus(row.id, nextStatus(row.status))}
                      >
                        Advance
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
