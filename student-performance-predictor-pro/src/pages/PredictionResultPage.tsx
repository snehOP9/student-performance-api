import { Download, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
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
  const { assessmentDraft, currentPrediction, currentRecommendations, currentUncertainty } = useAppStore()
  const risk = currentPrediction.risk_probability
  const tone = getRiskTone(risk)

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Prediction result"
        title="Showstopper risk reveal"
        subtitle="A confidence-aware, 3D-powered result view that explains why the model produced this score and what to do next."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(8,15,34,0.94),rgba(8,15,34,0.78),rgba(139,92,246,0.08))]">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <Badge className={tone.badge}>{tone.label}</Badge>
              <h2 className="mt-5 text-5xl font-bold text-white">
                <AnimatedCounter value={risk} decimals={1} suffix="%" />
              </h2>
              <p className="mt-3 max-w-xl text-base text-slate-300">
                The model currently flags a {currentPrediction.risk_band.toLowerCase()} intervention priority. The primary
                drivers remain attendance variability, compressed study windows, and sleep recovery pressure.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={currentUncertainty.confidence * 100} suffix="%" />
                  </p>
                </Card>
                <Card className="bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Uncertainty</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    <AnimatedCounter value={currentUncertainty.uncertainty * 100} suffix="%" />
                  </p>
                </Card>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Confidence meter</span>
                  <span>{Math.round(currentUncertainty.confidence * 100)}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#818cf8)]"
                    style={{ width: `${currentUncertainty.confidence * 100}%` }}
                  />
                </div>
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
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-cyan-200/80">Why the model thinks this</p>
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
              Confidence is strong enough to act on the top recommendation immediately. If uncertainty rises above 25%,
              gather another week of behavioral data before escalating interventions.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {currentRecommendations.map((item) => (
          <Card key={item.id} className="h-full">
            <div className="flex items-center justify-between gap-3">
              <Badge>{item.impact}</Badge>
              <span className="text-sm text-emerald-300">-{item.expectedReduction}% risk</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
          </Card>
        ))}
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
                {currentRecommendations[0]?.description ?? 'Run a fresh assessment after your next support intervention.'}
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
              Start with the highest-impact recommendation, then measure another risk snapshot in 7 days.
            </p>
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
