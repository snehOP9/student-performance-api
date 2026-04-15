import { useMemo } from 'react'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

export function PredictionHistoryPage() {
  const { predictionHistory, recommendationFollowUps } = useAppStore()

  const latestFollowUpByStudent = useMemo(() => {
    const map = new Map<string, (typeof recommendationFollowUps)[number]>()
    recommendationFollowUps.forEach((entry) => {
      if (!map.has(entry.studentName)) {
        map.set(entry.studentName, entry)
      }
    })
    return map
  }, [recommendationFollowUps])

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Prediction timeline"
        title="History stream"
        subtitle="Track how risk, confidence, and explanation layers evolve over time across the last prediction cycles."
      />

      <div className="space-y-4">
        {predictionHistory.map((item) => {
          const followUp = latestFollowUpByStudent.get(item.studentName)

          return (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{item.generatedAt}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{item.studentName}</h3>
                  <p className="mt-3 max-w-2xl text-sm text-slate-300">{item.explanation[0]}</p>

                  {followUp && (
                    <div className="mt-3 rounded-[1.1rem] border border-cyan-300/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                      <p>
                        Latest follow-up: risk {followUp.riskBefore.toFixed(1)}% → {followUp.riskAfter.toFixed(1)}%
                      </p>
                      <p className="mt-1">
                        Uncertainty {followUp.uncertaintyBefore}% → {followUp.uncertaintyAfter}%
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <Badge>{item.risk_band}</Badge>
                  <p className="mt-3 text-3xl font-bold text-white">{item.risk_probability.toFixed(1)}%</p>
                  <p className="text-sm text-slate-400">Confidence {(item.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </MotionPage>
  )
}
