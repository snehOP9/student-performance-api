import { CheckCircle2, Circle } from 'lucide-react'
import { Card } from '../ui/card'
import { useAppStore } from '../../store/appStore'

export function ChecklistCard() {
  const { checklist, toggleChecklistItem } = useAppStore()
  const completedCount = checklist.filter((item) => item.done).length
  const progress = (completedCount / checklist.length) * 100

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Action queue</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Smart intervention planner</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {completedCount}/{checklist.length}
          </p>
          <p className="text-xs text-slate-400">tasks complete</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className="flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-300/25 hover:bg-white/8"
          >
            <span className="text-sm text-slate-200">{item.label}</span>
            {item.done ? (
              <CheckCircle2 className="size-4 text-emerald-300" />
            ) : (
              <Circle className="size-4 text-slate-500" />
            )}
          </button>
        ))}
      </div>
    </Card>
  )
}
