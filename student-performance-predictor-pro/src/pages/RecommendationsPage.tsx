import { useEffect, useState } from 'react'
import { TimerReset } from 'lucide-react'
import { getRecommendations } from '../lib/api'
import { defaultAssessment, fallbackRecommendations } from '../data/mock'
import type { RecommendationItem } from '../types'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { SectionTitle } from '../components/common/SectionTitle'
import { WeeklyHabitTracker } from '../components/common/WeeklyHabitTracker'
import { ChecklistCard } from '../components/common/ChecklistCard'

export function RecommendationsPage() {
  const [items, setItems] = useState<RecommendationItem[]>(fallbackRecommendations)

  useEffect(() => {
    getRecommendations(defaultAssessment).then(setItems)
  }, [])

  return (
    <div className="space-y-6">
      <SectionTitle title="Recommendations Intelligence" subtitle="Ranked interventions and expected risk-reduction outcomes" />
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="mb-2 flex items-center justify-between">
              <Badge>{item.impact}</Badge>
              <p className="text-sm text-emerald-300">-{item.expectedReduction}% risk</p>
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyHabitTracker />
        <ChecklistCard />
      </div>
      <Card>
        <h3 className="text-lg font-semibold">Improvement timeline</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {['Week 1 baseline reset', 'Week 2 attendance stabilization', 'Week 3 sleep regularity', 'Week 4 risk review'].map((step) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-slate-900/50 p-3 text-sm">{step}</div>
          ))}
        </div>
        <p className="mt-4 inline-flex items-center text-sm text-cyan-200"><TimerReset className="mr-2 size-4" />Expected reduction in risk: 18-24% in 4 weeks</p>
      </Card>
    </div>
  )
}
