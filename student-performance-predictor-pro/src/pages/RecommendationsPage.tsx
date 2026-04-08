import { TimerReset } from 'lucide-react'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { WeeklyHabitTracker } from '../components/common/WeeklyHabitTracker'
import { ChecklistCard } from '../components/common/ChecklistCard'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

const timelineSteps = [
  'Week 1 baseline reset',
  'Week 2 attendance stabilization',
  'Week 3 sleep regularity',
  'Week 4 risk review',
]

export function RecommendationsPage() {
  const { currentRecommendations } = useAppStore()

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Recommendation engine"
        title="Personalized intervention plan"
        subtitle="Ranked AI guidance, glowing priority tags, weekly execution views, and a timeline that turns insight into action."
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
    </MotionPage>
  )
}
