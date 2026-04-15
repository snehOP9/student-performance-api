import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Activity,
  AlarmClockCheck,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck2,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { AIChatbot } from '../components/common/AIChatbot'
import { ChecklistCard } from '../components/common/ChecklistCard'
import { GuidedTourCard } from '../components/common/GuidedTourCard'
import { MetricCard } from '../components/common/MetricCard'
import { MotionPage } from '../components/common/MotionPage'
import { SearchFilters } from '../components/common/SearchFilters'
import { SectionTitle } from '../components/common/SectionTitle'
import { ActivityTimeline } from '../components/common/ActivityTimeline'
import { AnalyticsPillarsScene } from '../components/three/AnalyticsPillarsScene'
import { ChartCard } from '../components/charts/ChartCard'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { kpiData } from '../data/mock'
import { useAppStore } from '../store/appStore'

export function DashboardPage() {
  const {
    assessmentDraft,
    currentPrediction,
    currentPredictionSource,
    currentUncertainty,
    currentRecommendations,
  } = useAppStore()

  const strategicRead = useMemo(() => {
    const uncertaintyPct = Math.round(currentUncertainty.uncertainty * 100)
    if (currentUncertainty.prediction_set === '{0,1}' || uncertaintyPct >= 30) {
      return 'Uncertainty is currently high. Validate context and collect another week of data before escalating interventions.'
    }
    if (uncertaintyPct >= 20) {
      return 'Uncertainty is moderate. Start with low-regret interventions and verify directional movement after one cycle.'
    }
    return 'Uncertainty is lower for this profile. Execute the top recommendation now and monitor weekly drift.'
  }, [currentUncertainty.prediction_set, currentUncertainty.uncertainty])

  const kpis = useMemo(
    () => [
      { title: 'Risk score', value: `${currentPrediction.risk_probability.toFixed(1)}%`, delta: 'Most recent model output', icon: Activity },
      { title: 'Attendance health', value: `${Math.round(assessmentDraft.attendance_mean * 100)}%`, delta: 'Latest assessment snapshot', icon: CalendarCheck2 },
      { title: 'Study consistency', value: `${Math.round(assessmentDraft.consistency_score_mean)}%`, delta: 'Latest assessment snapshot', icon: BookOpenCheck },
      { title: 'Sleep quality', value: `${assessmentDraft.sleep_mean.toFixed(1)}h`, delta: 'Latest assessment snapshot', icon: AlarmClockCheck },
      { title: 'Resource engagement', value: `${assessmentDraft.resources_sum}`, delta: 'Resources opened in the latest draft', icon: MousePointerClick },
    ],
    [
      assessmentDraft.attendance_mean,
      assessmentDraft.consistency_score_mean,
      assessmentDraft.resources_sum,
      assessmentDraft.sleep_mean,
      currentPrediction.risk_probability,
    ],
  )

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Main hub"
        title="AI command center"
        subtitle="A live workspace for tracking risk signals, uncertainty, and intervention priorities over time."
        action={
          <Link to="/assessment">
            <Button>
              Run fresh prediction
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        }
      />

      <Card
        className={
          currentPredictionSource === 'live'
            ? 'border-emerald-300/20 bg-emerald-400/10'
            : 'border-amber-300/20 bg-amber-400/10'
        }
      >
        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-100/80">
          {currentPredictionSource === 'live' ? 'Live workspace state' : 'Demo workspace state'}
        </p>
        <p
          className={
            currentPredictionSource === 'live'
              ? 'mt-2 text-sm text-emerald-100'
              : 'mt-2 text-sm text-amber-100'
          }
        >
          {currentPredictionSource === 'live'
            ? 'Dashboard cards now reflect the latest assessment you submitted.'
            : 'The dashboard is currently showing seeded demo analytics. Run a fresh assessment to replace these with live results.'}
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-cyan-300/20 bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.78),rgba(34,211,238,0.08))]">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge>Live prediction core</Badge>
              <h2 className="mt-4 text-4xl font-bold text-white">
                Current risk:
                <span className="aurora-text block">
                  <AnimatedCounter value={currentPrediction.risk_probability} decimals={1} suffix="%" />
                </span>
              </h2>
              <p className="mt-4 text-slate-300">
                The model currently estimates a {currentPrediction.risk_band.toLowerCase()} risk pattern, often influenced
                by attendance variance, concentrated study windows, and recovery momentum.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Confidence</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={currentUncertainty.confidence * 100} suffix="%" />
                  </p>
                </Card>
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next best action</p>
                  <p className="mt-2 text-sm text-slate-200">{currentRecommendations[0]?.title ?? 'Stabilize attendance rhythm'}</p>
                </Card>
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Safety layer</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-emerald-200">
                    <ShieldCheck className="size-4" />
                    Uncertainty-aware output enabled
                  </p>
                </Card>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                <Badge className="border-white/20 bg-white/8 text-slate-100">
                  Prediction set: {currentUncertainty.prediction_set ?? 'n/a'}
                </Badge>
                <Badge className="border-white/20 bg-white/8 text-slate-100">
                  Uncertainty: {Math.round(currentUncertainty.uncertainty * 100)}%
                </Badge>
              </div>
            </div>

            <AnalyticsPillarsScene values={kpiData.map((item) => item.attendance)} />
          </div>
        </Card>

        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.88),rgba(8,15,34,0.72),rgba(99,102,241,0.1))]">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Operator note</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">AI insights panel</h3>
          <div className="mt-5 space-y-3">
            {currentPrediction.explanation.map((item) => (
              <div key={item} className="rounded-[1.35rem] border border-white/8 bg-white/6 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.35rem] border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Strategic read</p>
            <p className="mt-2 text-sm text-slate-100">{strategicRead}</p>
          </div>
        </Card>
      </div>

      <SearchFilters />
      <GuidedTourCard />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <MetricCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Risk trajectory" subtitle="Probability drift across the last active week">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData}>
                <defs>
                  <linearGradient id="risk-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#243042" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
                <Area type="monotone" dataKey="risk" stroke="#67e8f9" strokeWidth={2.4} fill="url(#risk-area)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <AIChatbot />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Attendance vs study rhythm" subtitle="Momentum view across key behavioral signals">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpiData}>
              <CartesianGrid stroke="#243042" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
              <Line type="monotone" dataKey="attendance" stroke="#2dd4bf" strokeWidth={2.4} />
              <Line type="monotone" dataKey="study" stroke="#a78bfa" strokeWidth={2.4} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChecklistCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityTimeline />
        <ChartCard title="Recent prediction samples" subtitle="Quick-glance history stream">
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3">Band</th>
                  <th className="pb-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['2026-03-22', '41.6%', 'Moderate', '82%'],
                  ['2026-03-18', '46.8%', 'Moderate', '80%'],
                  ['2026-03-12', '54.2%', 'High', '84%'],
                ].map((row) => (
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
        </ChartCard>
      </div>
    </MotionPage>
  )
}
