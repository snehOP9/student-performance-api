import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, Download, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { AnimatedCounter } from '../components/common/AnimatedCounter'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { RiskGaugeScene } from '../components/three/RiskGaugeScene'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

function getRiskTone(risk: number) {
  if (risk >= 65) return { label: 'High risk', accent: 'text-rose-300', badge: 'border-rose-300/30 bg-rose-400/10 text-rose-100' }
  if (risk >= 40) return { label: 'Moderate risk', accent: 'text-amber-300', badge: 'border-amber-300/30 bg-amber-400/10 text-amber-100' }
  return { label: 'Low risk', accent: 'text-emerald-300', badge: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100' }
}

export function PredictionResultPage() {
  const {
    assessmentDraft,
    currentPrediction,
    currentPredictionSource,
    currentRecommendations,
    currentUncertainty,
  } = useAppStore()
  const risk = currentPrediction.risk_probability
  const tone = getRiskTone(risk)
  const confidencePct = Math.round(currentUncertainty.confidence * 100)
  const uncertaintyPct = Math.round(currentUncertainty.uncertainty * 100)
  const hasWidePredictionSet = currentUncertainty.prediction_set === '{0,1}'
  const recommendationLead = currentRecommendations[0]
  const predictionDrivers = currentPrediction.drivers ?? []
  const riskDrivers = predictionDrivers.filter((item) => item.direction === 'increase').slice(0, 3)
  const stabilizingDrivers = predictionDrivers.filter((item) => item.direction === 'decrease').slice(0, 3)
  const summary = currentPrediction.summary ?? currentPrediction.explanation[0] ?? 'The model explanation is temporarily unavailable.'

  const actionGuidance = useMemo(() => {
    if (hasWidePredictionSet || uncertaintyPct >= 30) {
      return 'Uncertainty is elevated for this profile. Gather another week of data and validate context before high-stakes escalation.'
    }

    if (uncertaintyPct >= 20) {
      return 'Signal quality is moderate. Start with low-regret support actions and re-check after the next intervention cycle.'
    }

    return `Signal quality is stronger for immediate action. Start with ${recommendationLead?.title ?? 'the top recommendation'} and re-evaluate in 7 days.`
  }, [hasWidePredictionSet, recommendationLead?.title, uncertaintyPct])

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Prediction result"
        title="Risk estimate and action brief"
        subtitle="A confidence-aware result view that explains what the model sees, how certain it is, and what to do next."
      />

      <Card
        className={
          currentPredictionSource === 'live'
            ? 'border-emerald-300/20 bg-emerald-400/10'
            : 'border-amber-300/20 bg-amber-400/10'
        }
      >
        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-100/80">
          {currentPredictionSource === 'live' ? 'Live assessment result' : 'Demo result'}
        </p>
        <p
          className={
            currentPredictionSource === 'live'
              ? 'mt-2 text-sm text-emerald-100'
              : 'mt-2 text-sm text-amber-100'
          }
        >
          {currentPredictionSource === 'live'
            ? 'This prediction came from the latest assessment you submitted. Use it for coaching, triage, and scenario planning.'
            : 'You are currently viewing seeded demo output. Run a fresh assessment before using this view for a real student conversation.'}
        </p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.78),rgba(139,92,246,0.08))]">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <Badge className={tone.badge}>{tone.label}</Badge>
              <h2 className="mt-5 text-5xl font-bold text-white">
                <AnimatedCounter value={risk} decimals={1} suffix="%" />
              </h2>
              <p className="mt-3 max-w-xl text-base text-slate-300">
                The current assessment indicates a {currentPrediction.risk_band.toLowerCase()} intervention priority.
                {` ${summary}`}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Decision confidence</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={confidencePct} suffix="%" />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Based on the uncertainty layer around this exact profile, not on a guarantee of the real-world outcome.
                  </p>
                </Card>
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Uncertainty</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={uncertaintyPct} suffix="%" />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Higher uncertainty means gather more context before making a higher-stakes intervention decision.
                  </p>
                </Card>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Decision confidence meter</span>
                  <span>{confidencePct}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8)]"
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="border-white/20 bg-white/8 text-slate-100">
                  Prediction set: {currentUncertainty.prediction_set ?? 'n/a'}
                </Badge>
                <Badge className="border-white/20 bg-white/8 text-slate-100">
                  Source: {currentPredictionSource === 'live' ? 'live assessment' : 'seeded demo'}
                </Badge>
                <Badge className="border-white/20 bg-white/8 text-slate-100">Advisory use only</Badge>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => toast.success('Report export prepared')}>
                  <Download className="mr-2 size-4" />
                  Download report
                </Button>
                <Link to="/assessment">
                  <Button variant="outline">
                    <RotateCcw className="mr-2 size-4" />
                    Retry assessment
                  </Button>
                </Link>
              </div>
            </div>

            <RiskGaugeScene risk={risk} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Primary drivers</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-200/80">What is raising risk</p>
                {riskDrivers.length ? (
                  riskDrivers.map((item) => (
                    <div key={`${item.feature}-raise`} className="rounded-[1.35rem] border border-rose-300/15 bg-rose-400/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-rose-200">
                          <ArrowUpRight className="size-3.5" />
                          raises risk
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-200">Current value: {item.displayValue}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                    No strong risk-raising drivers were returned for this prediction.
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">What is stabilizing risk</p>
                {stabilizingDrivers.length ? (
                  stabilizingDrivers.map((item) => (
                    <div key={`${item.feature}-stabilize`} className="rounded-[1.35rem] border border-emerald-300/15 bg-emerald-400/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-200">
                          <ArrowDownRight className="size-3.5" />
                          lowers risk
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-200">Current value: {item.displayValue}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                    The prediction did not return any clear stabilizing drivers for this profile.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Narrative explanation</p>
            <div className="mt-4 space-y-3">
              {currentPrediction.explanation.map((item, index) => (
                <div key={item} className="rounded-[1.35rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Insight {index + 1}</p>
                  <p className="mt-2 text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-cyan-300/20 bg-cyan-400/10">
            <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-cyan-100/80">
              <ShieldCheck className="size-4" />
              Confidence-aware action guidance
            </p>
            <p className="mt-3 text-sm text-slate-100">
              {actionGuidance}
            </p>
          </Card>

          <Card>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">How to read this result</p>
            <div className="mt-3 grid gap-3">
              {[
                'Risk score: a directional estimate of support priority, not a final academic prediction or grade.',
                'Decision confidence: how stable the model thinks this exact profile is, not proof of causality.',
                'Recommended actions: the first interventions worth testing before you collect the next snapshot.',
              ].map((item) => (
                <div key={item} className="rounded-[1.15rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {currentRecommendations.length ? (
          currentRecommendations.map((item) => (
            <Card key={item.id} className="h-full">
              <div className="flex items-center justify-between gap-3">
                <Badge>{item.impact}</Badge>
                <span className="text-sm text-emerald-300">-{item.expectedReduction}% risk</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
            </Card>
          ))
        ) : (
          <Card className="lg:col-span-3">
            <p className="text-sm text-slate-200">
              Recommendation generation is temporarily unavailable. Re-run the assessment or use the explanation panel to
              choose the first support action.
            </p>
          </Card>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Benchmark comparison</p>
          <h3 className="mt-3 text-xl font-semibold text-white">Current profile snapshot</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current</p>
              <p className="mt-2 text-sm text-slate-200">
                Risk {risk.toFixed(1)}% | Sleep {assessmentDraft.sleep_mean.toFixed(1)}h | Attendance{' '}
                {(assessmentDraft.attendance_mean * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Focus now</p>
              <p className="mt-2 text-sm text-slate-100">
                {recommendationLead?.description ?? 'Run a fresh assessment after your next support intervention.'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Next move</p>
          <h3 className="mt-3 text-xl font-semibold text-white">High-signal recommendation bundle</h3>
          <div className="mt-4 rounded-[1.35rem] border border-white/8 bg-white/5 p-4">
            <p className="flex items-center gap-2 text-sm text-slate-100">
              <Sparkles className="size-4 text-cyan-300" />
              Start with the highest-impact recommendation, then measure another risk snapshot in 7 days and compare the
              uncertainty trend.
            </p>
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
