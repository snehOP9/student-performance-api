import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { AnalyticsPillarsScene } from '../components/three/AnalyticsPillarsScene'
import { MotionPage } from '../components/common/MotionPage'
import { SearchFilters } from '../components/common/SearchFilters'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'
import { cohortDistribution } from '../data/mock'

const rows = [
  ['A. Kumar', '10-A', 'High', 'Needs intervention'],
  ['S. Lee', '10-B', 'Moderate', 'Monitored'],
  ['M. Rafi', '11-A', 'Low', 'Stable'],
  ['J. Clarke', '12-C', 'Moderate', 'Follow-up'],
]

export function InstitutionalDashboardPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Admin command center"
        title="Institutional intelligence"
        subtitle="A data-heavy premium view for cohort surveillance, risk distribution, and intervention governance."
      />

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.78),rgba(34,211,238,0.08))]">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Cohort health</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Live institutional risk surface</h3>
          <p className="mt-3 text-slate-300">Track how performance risk moves across departments, classes, and intervention waves in a single cinematic control room.</p>
        </Card>
        <AnalyticsPillarsScene values={[46, 52, 68, 74, 83]} />
      </div>

      <SearchFilters placeholder="Search departments, classes, or individual students..." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          'At-risk students: 124',
          'Intervention success: 72%',
          'Average attendance: 88%',
          'Model confidence: 83%',
        ].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
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
          <h3 className="mt-3 text-2xl font-semibold text-white">Operational student queue</h3>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]} className="border-t border-white/10 text-slate-200">
                    {row.map((cell) => (
                      <td key={cell} className="py-3">
                        {cell}
                      </td>
                    ))}
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
