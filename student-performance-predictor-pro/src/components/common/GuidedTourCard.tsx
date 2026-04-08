import { Sparkles } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

export function GuidedTourCard() {
  return (
    <Card className="border-cyan-300/30 bg-[linear-gradient(135deg,rgba(8,15,34,0.9),rgba(8,15,34,0.68),rgba(34,211,238,0.08))]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Guided tour</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Discover your intelligence workspace</h3>
          <p className="mt-2 max-w-xl text-sm text-slate-300">Walk through predictions, analytics, interventions, and profile optimization in under 2 minutes.</p>
        </div>
        <Sparkles className="size-5 text-cyan-200" />
      </div>
      <Button className="mt-4" variant="outline">Start overlay tour</Button>
    </Card>
  )
}
