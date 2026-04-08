import { Card } from '../ui/card'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyHabitTracker() {
  return (
    <Card>
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Execution cadence</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Weekly habit tracker</h3>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={day}
            className={`rounded-[1.15rem] border p-3 text-center text-xs ${
              index < 5
                ? 'border-emerald-300/30 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(16,185,129,0.08))] text-emerald-100'
                : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            <p>{day}</p>
            <p className="mt-1 text-[10px]">{index < 5 ? 'Done' : 'Pending'}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
