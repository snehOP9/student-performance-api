import {
  Bar,
  BarChart,
  CartesianGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { MotionPage } from '../components/common/MotionPage'
import { SearchFilters } from '../components/common/SearchFilters'
import { SectionTitle } from '../components/common/SectionTitle'
import { ChartCard } from '../components/charts/ChartCard'
import { AnalyticsPillarsScene } from '../components/three/AnalyticsPillarsScene'
import { kpiData } from '../data/mock'

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
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Analytics room"
        title="Deep performance intelligence"
        subtitle="Animated charts, 3D-inspired data pillars, and comparison systems designed to feel more like a product launch than a report."
        action={<Button variant="outline">Export charts</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.76),rgba(34,211,238,0.08))]">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">3D analytics scene</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Floating data pillars</h3>
          <p className="mt-3 max-w-2xl text-slate-300">
            Translate attendance, engagement, and habit recovery into a depth-rich visual system that feels alive while staying readable.
          </p>
        </Card>
        <AnalyticsPillarsScene values={kpiData.map((item) => item.engagement)} />
      </div>

      <SearchFilters placeholder="Filter by class, cohort, date range..." />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Feature impact" subtitle="Attendance contribution across the last active week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kpiData}>
              <CartesianGrid stroke="#243042" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
              <Bar dataKey="attendance" fill="#67e8f9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Wellness profile" subtitle="Radar layer for recovery, attendance, and study rhythm">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
              <Radar dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.42} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Study vs risk" subtitle="Scatter view for how effort shifts projected outcomes">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid stroke="#243042" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" name="Study hrs" stroke="#94a3b8" />
              <YAxis dataKey="y" type="number" name="Risk" stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
              <Scatter data={scatterData} fill="#67e8f9" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Comparison mode</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Current vs ideal profile</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current</p>
              <p className="mt-2 text-sm text-slate-200">Risk 41.6% | Sleep 7.1h | Attendance 89%</p>
            </div>
            <div className="rounded-[1.3rem] border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Ideal</p>
              <p className="mt-2 text-sm text-slate-100">Risk 24% | Sleep 7.8h | Attendance 94%</p>
            </div>
          </div>
          <div className="mt-5 rounded-[1.35rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-200">
            Current attention should focus on attendance stability and sleep regularity before pushing for more raw study volume.
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
