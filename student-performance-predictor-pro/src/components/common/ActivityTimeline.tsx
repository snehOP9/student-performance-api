import { Card } from '../ui/card'

const events = [
  { time: '08:00', title: 'Assessment draft saved', type: 'system' },
  { time: '10:20', title: 'Prediction generated: Moderate risk', type: 'prediction' },
  { time: '12:10', title: 'Recommendation checklist updated', type: 'action' },
]

export function ActivityTimeline() {
  return (
    <Card>
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Signal feed</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Recent activity timeline</h3>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <div key={event.time} className="flex items-start gap-3 rounded-[1.3rem] border border-white/8 bg-white/5 p-3">
            <div className="mt-1 size-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            <div className="flex-1">
              <p className="text-sm text-white">{event.title}</p>
              <p className="text-xs text-slate-400">{event.time}</p>
            </div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">{event.type}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
