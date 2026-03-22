import { Download, RotateCcw } from 'lucide-react'
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'
import { fallbackPrediction } from '../data/mock'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { SectionTitle } from '../components/common/SectionTitle'

export function PredictionResultPage() {
  const risk = fallbackPrediction.risk_probability
  return (
    <div className="space-y-6">
      <SectionTitle title="Prediction Result" subtitle="Explainable risk summary with confidence and intervention context" />
      <Card className="grid gap-6 lg:grid-cols-2">
        <div>
          <Badge>Risk band: {fallbackPrediction.risk_band}</Badge>
          <h2 className="mt-3 text-4xl font-bold text-white">{risk.toFixed(1)}% probability</h2>
          <p className="mt-2 text-slate-300">AI summary: moderate risk driven by attendance variance and compressed study windows.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card className="bg-slate-900/50"><p className="text-xs text-slate-400">Confidence</p><p className="text-2xl font-semibold">82%</p></Card>
            <Card className="bg-slate-900/50"><p className="text-xs text-slate-400">Uncertainty</p><p className="text-2xl font-semibold">18%</p></Card>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline"><Download className="mr-1 size-4" />Download PDF report</Button>
            <Button><RotateCcw className="mr-1 size-4" />Retake assessment</Button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="60%" outerRadius="100%" barSize={24} data={[{ name: 'risk', value: risk }]} startAngle={180} endAngle={0}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="value" fill="#22d3ee" cornerRadius={18} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {fallbackPrediction.explanation.map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Benchmark comparison</h3>
          <p className="mt-2 text-sm text-slate-300">Current profile is 12 points below ideal consistency benchmark and 6 points below top quartile sleep index.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Recommended interventions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            <li>Increase attendance above 90% for 3 straight weeks</li>
            <li>Shift from cramming to spaced review model</li>
            <li>Use weekly planner with nightly sleep guardrails</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
