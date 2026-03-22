import { Bar, BarChart, CartesianGrid, Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { kpiData } from '../data/mock'
import { ChartCard } from '../components/charts/ChartCard'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/ui/button'
import { SearchFilters } from '../components/common/SearchFilters'

const radarData = [
  { subject: 'Sleep', score: 78 },
  { subject: 'Attendance', score: 88 },
  { subject: 'Study', score: 76 },
  { subject: 'Engagement', score: 71 },
  { subject: 'Consistency', score: 74 },
]

const scatterData = [
  { x: 2, y: 72 },
  { x: 4, y: 64 },
  { x: 6, y: 48 },
  { x: 8, y: 41 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Advanced Analytics" subtitle="Trend analysis, wellness profile, and impact diagnostics" action={<Button variant="outline">Export charts</Button>} />
      <SearchFilters placeholder="Filter by class, cohort, date range..." />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Feature impact (bar chart)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="attendance" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Wellness profile (radar)">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <Tooltip />
              <Radar dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Study vs risk (scatter)">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" name="Study hrs" stroke="#94a3b8" />
              <YAxis dataKey="y" type="number" name="Risk" stroke="#94a3b8" />
              <Tooltip />
              <Scatter data={scatterData} fill="#22d3ee" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Current vs ideal profile" subtitle="Comparison mode enabled">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Current</p>
              <p className="mt-1 text-sm">Risk 41.6% | Sleep 7.1h | Attendance 89%</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-4">
              <p className="text-xs text-cyan-300">Ideal</p>
              <p className="mt-1 text-sm">Risk 24% | Sleep 7.8h | Attendance 94%</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
