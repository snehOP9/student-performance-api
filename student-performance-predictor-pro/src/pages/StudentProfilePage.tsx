import { Award, LineChart as LineChartIcon, Sparkles, Trophy } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

const trend = [
  { month: 'Jan', risk: 58, confidence: 74 },
  { month: 'Feb', risk: 51, confidence: 77 },
  { month: 'Mar', risk: 42, confidence: 82 },
]

export function StudentProfilePage() {
  const { profileCompletion, currentPrediction } = useAppStore()

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Student profile"
        title="Learner snapshot"
        subtitle="Glow-accented identity cards, animated trend data, and achievement signals that make progress feel tangible."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.76),rgba(34,211,238,0.08))]">
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-[1.8rem] border border-cyan-300/20 bg-cyan-400/10">
              <span className="text-2xl font-bold text-cyan-100">MS</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">Maya Singh</h3>
              <p className="mt-1 text-sm text-slate-400">Grade 11 • STEM track • Cohort A</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card className="bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current risk</p>
              <p className="mt-2 text-2xl font-bold text-white">
                <AnimatedCounter value={currentPrediction.risk_probability} decimals={1} suffix="%" />
              </p>
            </Card>
            <Card className="bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile completion</p>
              <p className="mt-2 text-2xl font-bold text-white">
                <AnimatedCounter value={profileCompletion} suffix="%" />
              </p>
            </Card>
          </div>

          <div className="mt-6 h-2 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8)]"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>7-day focus streak</Badge>
            <Badge>Attendance hero</Badge>
            <Badge>Recovery momentum</Badge>
          </div>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Historical trend</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Risk and confidence arc</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#061327', border: '1px solid rgba(103,232,249,0.18)' }} />
                <Line type="monotone" dataKey="risk" stroke="#67e8f9" strokeWidth={2.4} />
                <Line type="monotone" dataKey="confidence" stroke="#a78bfa" strokeWidth={2.4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <LineChartIcon className="size-5 text-cyan-300" />
          <h4 className="mt-4 text-lg font-semibold text-white">Recommendation history</h4>
          <p className="mt-3 text-sm text-slate-300">7 interventions completed in the last 30 days, with attendance stability improving first.</p>
        </Card>
        <Card>
          <Sparkles className="size-5 text-cyan-300" />
          <h4 className="mt-4 text-lg font-semibold text-white">Momentum</h4>
          <p className="mt-3 text-sm text-slate-300">Attendance 89%, sleep recovery +0.6h, and consistency up 8% month-over-month.</p>
        </Card>
        <Card>
          <Trophy className="size-5 text-cyan-300" />
          <h4 className="mt-4 text-lg font-semibold text-white">Achievement layer</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Streak master</Badge>
            <Badge>Focus rebound</Badge>
            <Badge>Recovery arc</Badge>
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Achievements</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            'Completed every intervention for 2 weeks',
            'Recovered attendance above 88%',
            'Improved confidence by 8 percentage points',
          ].map((item) => (
            <div key={item} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <Award className="mb-3 size-4 text-cyan-300" />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </MotionPage>
  )
}
