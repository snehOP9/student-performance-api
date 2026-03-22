import { Inbox } from 'lucide-react'
import { Button } from '../ui/button'

type Props = { title: string; description: string; actionText?: string; onAction?: () => void }

export function EmptyState({ title, description, actionText, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
      <Inbox className="size-10 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-400">{description}</p>
      {actionText && (
        <Button className="mt-6" variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  )
}
