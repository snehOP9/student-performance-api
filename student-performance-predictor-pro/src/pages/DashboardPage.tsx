import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, AlarmClockCheck, BookOpenCheck, CalendarCheck2, MousePointerClick } from 'lucide-react'
import { kpiData } from '../data/mock'
import { MetricCard } from '../components/common/MetricCard'
import { ChartCard } from '../components/charts/ChartCard'
import { AIChatbot } from '../components/common/AIChatbot'
import { SectionTitle } from '../components/common/SectionTitle'
import { SearchFilters } from '../components/common/SearchFilters'
import { SkeletonCard } from '../components/common/SkeletonCard'
import { GuidedTourCard } from '../components/common/GuidedTourCard'
import { ActivityTimeline } from '../components/common/ActivityTimeline'
import { ChecklistCard } from '../components/common/ChecklistCard'

export function DashboardPage() {
  const [loading] = useState(false)
  const kpis = useMemo(
    () => [
      { title: 'Risk score', value: '41.6%', delta: '-5.2 this week', icon: Activity },
      { title: 'Attendance health', value: '89%', delta: '+3.1%', icon: CalendarCheck2 },
      { title: 'Study consistency', value: '78%', delta: '+8.4%', icon: BookOpenCheck },
      { title: 'Sleep quality', value: '7.3h', delta: '+0.4h', icon: AlarmClockCheck },
      { title: 'Resource engagement', value: '84', delta: '+11 clicks', icon: MousePointerClick },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <SectionTitle title="Main Dashboard" subtitle="Premium AI command center" />
      <SearchFilters />
      <GuidedTourCard />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loading ? kpis.map((x) => <SkeletonCard key={x.title} />) : kpis.map((kpi) => <MetricCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Risk trend timeline" subtitle="Daily probability trajectory">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData}>
                <defs>
                  <linearGradient id="risk" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="risk" stroke="#22d3ee" fill="url(#risk)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <AIChatbot />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Progress trends" subtitle="Attendance vs study consistency">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpiData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#14b8a6" strokeWidth={2} />
              <Line type="monotone" dataKey="study" stroke="#a78bfa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChecklistCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityTimeline />
        <ChartCard title="Recent predictions" subtitle="Quick history table">
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr><th>Date</th><th>Risk</th><th>Band</th><th>Confidence</th></tr>
              </thead>
              <tbody>
                {[
                  ['2026-03-22', '41.6%', 'Moderate', '82%'],
                  ['2026-03-18', '46.8%', 'Moderate', '80%'],
                  ['2026-03-12', '54.2%', 'High', '84%'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-white/10 text-slate-200">
                    {row.map((cell) => <td key={cell} className="py-2">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
