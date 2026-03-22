import { Card } from '../components/ui/card'
import { SectionTitle } from '../components/common/SectionTitle'

export function AboutMethodologyPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="About / Methodology" subtitle="Transparent model behavior, uncertainty, ethics, and privacy" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">How prediction works</h3>
          <p className="mt-2 text-sm text-slate-300">The model combines behavior, engagement, attendance, sleep, and demographic/education indicators to estimate academic risk probability.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Risk score + uncertainty</h3>
          <p className="mt-2 text-sm text-slate-300">Risk score indicates probability of risk, while uncertainty reflects confidence around that estimate for safer decision-making.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Responsible AI</h3>
          <p className="mt-2 text-sm text-slate-300">Recommendations are assistive, non-punitive, and should always be reviewed with human context and support systems.</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Ethics & privacy</h3>
          <p className="mt-2 text-sm text-slate-300">Use minimum necessary data, protect identity, and provide transparent explanations for all high-impact decisions.</p>
        </Card>
      </div>
    </div>
  )
}
