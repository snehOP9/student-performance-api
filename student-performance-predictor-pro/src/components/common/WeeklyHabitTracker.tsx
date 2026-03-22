import { Card } from '../ui/card'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyHabitTracker() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Weekly habit tracker</h3>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={day}
            className={`rounded-xl border p-3 text-center text-xs ${
              index < 5
                ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
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
