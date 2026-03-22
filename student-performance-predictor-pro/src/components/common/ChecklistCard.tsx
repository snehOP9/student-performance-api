import { CheckCircle2, Circle } from 'lucide-react'
import { Card } from '../ui/card'
import { useAppStore } from '../../store/appStore'

export function ChecklistCard() {
  const { checklist, toggleChecklistItem } = useAppStore()

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white">Smart intervention planner</h3>
      <div className="mt-3 space-y-2">
        {checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-3 text-left"
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
