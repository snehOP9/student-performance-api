import { Card } from '../ui/card'

const events = [
  { time: '08:00', title: 'Assessment draft saved', type: 'system' },
  { time: '10:20', title: 'Prediction generated: Moderate risk', type: 'prediction' },
  { time: '12:10', title: 'Recommendation checklist updated', type: 'action' },
]

export function ActivityTimeline() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Recent activity timeline</h3>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <div key={event.time} className="flex items-start gap-3">
            <div className="mt-1 size-2 rounded-full bg-cyan-300" />
            <div>
              <p className="text-sm text-white">{event.title}</p>
              <p className="text-xs text-slate-400">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
