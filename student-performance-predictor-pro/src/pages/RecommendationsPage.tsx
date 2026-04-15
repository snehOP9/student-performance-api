import { useMemo, useState } from 'react'
import { TimerReset } from 'lucide-react'
import { toast } from 'sonner'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { WeeklyHabitTracker } from '../components/common/WeeklyHabitTracker'
import { ChecklistCard } from '../components/common/ChecklistCard'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

const timelineSteps = [
  'Week 1 baseline reset',
  'Week 2 attendance stabilization',
  'Week 3 sleep regularity',
  'Week 4 risk review',
]

export function RecommendationsPage() {
  const {
    currentRecommendations,
    currentPrediction,
    currentUncertainty,
    recommendationFollowUps,
    addRecommendationFollowUp,
  } = useAppStore()

  const [studentName, setStudentName] = useState('Sneh')
  const [selectedActionId, setSelectedActionId] = useState('')
  const [riskAfter, setRiskAfter] = useState('')
  const [uncertaintyAfter, setUncertaintyAfter] = useState('')
  const [outcomeNote, setOutcomeNote] = useState('')

  const activeActionId = selectedActionId || currentRecommendations[0]?.id || ''

  const selectedAction = useMemo(() => {
    return (
      currentRecommendations.find((item) => item.id === activeActionId) ?? currentRecommendations[0] ?? null
    )
  }, [activeActionId, currentRecommendations])

  const averageRiskDelta = useMemo(() => {
    if (!recommendationFollowUps.length) return 0
    const total = recommendationFollowUps.reduce((sum, row) => sum + (row.riskBefore - row.riskAfter), 0)
    return total / recommendationFollowUps.length
  }, [recommendationFollowUps])

  const averageUncertaintyDelta = useMemo(() => {
    if (!recommendationFollowUps.length) return 0
    const total = recommendationFollowUps.reduce(
      (sum, row) => sum + (row.uncertaintyBefore - row.uncertaintyAfter),
      0,
    )
    return total / recommendationFollowUps.length
  }, [recommendationFollowUps])

  const captureFollowUp = () => {
    if (!selectedAction) {
      toast.error('Select an action before logging follow-up results.')
      return
    }

    const parsedRiskAfter = Number(riskAfter)
    const parsedUncertaintyAfter = Number(uncertaintyAfter)

    if (!Number.isFinite(parsedRiskAfter) || parsedRiskAfter < 0 || parsedRiskAfter > 100) {
      toast.error('Risk after must be a value between 0 and 100.')
      return
    }

    if (!Number.isFinite(parsedUncertaintyAfter) || parsedUncertaintyAfter < 0 || parsedUncertaintyAfter > 100) {
      toast.error('Uncertainty after must be a value between 0 and 100.')
      return
    }

    addRecommendationFollowUp({
      studentName: studentName.trim() || 'Unknown learner',
      actionTitle: selectedAction.title,
      riskBefore: Number(currentPrediction.risk_probability.toFixed(1)),
      riskAfter: Number(parsedRiskAfter.toFixed(1)),
      uncertaintyBefore: Number((currentUncertainty.uncertainty * 100).toFixed(0)),
      uncertaintyAfter: Number(parsedUncertaintyAfter.toFixed(0)),
      outcomeNote: outcomeNote.trim() || 'Outcome note not provided.',
    })

    setRiskAfter('')
    setUncertaintyAfter('')
    setOutcomeNote('')
    toast.success('Follow-up checkpoint recorded.')
  }

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Recommendation engine"
        title="Personalized intervention plan"
        subtitle="Ranked AI guidance, weekly execution views, and persistent follow-up checkpoints that close the action loop."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {currentRecommendations.map((item, index) => (
          <Card
            key={item.id}
            className={index === 0 ? 'border-cyan-300/20 bg-[linear-gradient(135deg,rgba(8,15,34,0.92),rgba(8,15,34,0.72),rgba(34,211,238,0.08))]' : ''}
          >
            <div className="flex items-center justify-between gap-3">
              <Badge>{item.impact}</Badge>
              <p className="text-sm text-emerald-300">-{item.expectedReduction}% risk</p>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
            <div className="mt-5 rounded-[1.2rem] border border-white/8 bg-white/5 p-3 text-xs uppercase tracking-[0.22em] text-slate-400">
              Priority level {index + 1}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyHabitTracker />
        <ChecklistCard />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Weekly planner</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Suggested execution cadence</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Monday', 'Attendance reset + class prep'],
              ['Tuesday', 'Two deep-work blocks'],
              ['Wednesday', 'Tutor checkpoint + flash review'],
              ['Thursday', 'Forum engagement + resources recap'],
              ['Friday', 'Sleep protection + lightweight revision'],
            ].map(([day, plan]) => (
              <div key={day} className="flex items-center justify-between rounded-[1.35rem] border border-white/8 bg-white/5 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{day}</p>
                  <p className="mt-2 text-sm text-slate-200">{plan}</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                  Planned
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.72),rgba(99,102,241,0.08))]">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Timeline visualization</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Expected improvement arc</h3>
          <div className="mt-5 space-y-3">
            {timelineSteps.map((step, index) => (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                  {index !== timelineSteps.length - 1 && <div className="mt-2 h-12 w-px bg-cyan-300/25" />}
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200 w-full">
                  {step}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 inline-flex items-center text-sm text-cyan-100">
            <TimerReset className="mr-2 size-4 text-cyan-300" />
            Expected reduction in risk: 18 to 24% in 4 weeks
          </p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">Follow-up capture</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Log intervention outcomes</h3>
          <p className="mt-2 text-sm text-slate-300">
            Compare current baseline against post-intervention values to track whether support actions are reducing risk.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Student
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-0"
                placeholder="Student name"
              />
            </label>

            <label className="text-sm text-slate-300">
              Action
              <select
                value={activeActionId}
                onChange={(event) => setSelectedActionId(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-0"
              >
                {currentRecommendations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Risk after (%)
              <input
                value={riskAfter}
                onChange={(event) => setRiskAfter(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-0"
                inputMode="decimal"
                placeholder="e.g. 36.5"
              />
            </label>

            <label className="text-sm text-slate-300">
              Uncertainty after (%)
              <input
                value={uncertaintyAfter}
                onChange={(event) => setUncertaintyAfter(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-0"
                inputMode="numeric"
                placeholder="e.g. 14"
              />
            </label>

            <label className="md:col-span-2 text-sm text-slate-300">
              Outcome note
              <textarea
                value={outcomeNote}
                onChange={(event) => setOutcomeNote(event.target.value)}
                className="mt-1 min-h-24 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-0"
                placeholder="What changed this week?"
              />
            </label>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-white/5 p-3 text-sm text-slate-200">
            Baseline: risk {currentPrediction.risk_probability.toFixed(1)}% · uncertainty{' '}
            {Math.round(currentUncertainty.uncertainty * 100)}%
          </div>

          <div className="mt-4">
            <Button onClick={captureFollowUp}>Save follow-up checkpoint</Button>
          </div>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">Follow-up summary</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Observed intervention trend</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.1rem] border border-emerald-300/20 bg-emerald-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Avg risk delta</p>
              <p className="mt-2 text-xl font-semibold text-emerald-100">-{Math.max(0, averageRiskDelta).toFixed(1)} pts</p>
            </div>
            <div className="rounded-[1.1rem] border border-cyan-300/20 bg-cyan-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Avg uncertainty delta</p>
              <p className="mt-2 text-xl font-semibold text-cyan-100">-{Math.max(0, averageUncertaintyDelta).toFixed(1)} pts</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {recommendationFollowUps.length ? (
              recommendationFollowUps.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-[1.1rem] border border-white/8 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{entry.studentName}</p>
                    <Badge className="border-white/20 bg-white/8 text-slate-100">{entry.createdAt}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{entry.actionTitle}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    Risk {entry.riskBefore.toFixed(1)}% → {entry.riskAfter.toFixed(1)}% · Uncertainty {entry.uncertaintyBefore}% → {entry.uncertaintyAfter}%
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{entry.outcomeNote}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No follow-up entries yet. Save your first checkpoint to start trend tracking.</p>
            )}
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
