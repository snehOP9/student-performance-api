import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '../components/ui/card'
import { SectionTitle } from '../components/common/SectionTitle'
import { SearchFilters } from '../components/common/SearchFilters'

const cohortData = [
  { name: 'Low', value: 42 },
  { name: 'Moderate', value: 38 },
  { name: 'High', value: 20 },
]

export function InstitutionalDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Institutional Dashboard" subtitle="Admin-level cohort and intervention intelligence" />
      <SearchFilters placeholder="Search departments, classes, students..." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['At-risk students: 124', 'Intervention success: 72%', 'Avg attendance: 88%', 'Model confidence: 83%'].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-lg font-semibold">At-risk distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cohortData} dataKey="value" nameKey="name" outerRadius={110} fill="#22d3ee" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 text-lg font-semibold">Student list</h3>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th>Name</th><th>Class</th><th>Risk</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  ['A. Kumar', '10-A', 'High', 'Needs intervention'],
                  ['S. Lee', '10-B', 'Moderate', 'Monitored'],
                  ['M. Rafi', '11-A', 'Low', 'Stable'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-white/10 text-slate-200">{row.map((cell) => <td key={cell} className="py-2">{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
