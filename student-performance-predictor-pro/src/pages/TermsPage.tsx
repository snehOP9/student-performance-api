import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function TermsPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Terms"
        title="Use terms for the prediction workspace"
        subtitle="Lightweight operational terms for pilot usage."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">Intended use</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Decision support for educational planning and intervention design.</li>
            <li>Not a replacement for educator review or institutional policy process.</li>
            <li>Use repeated measurements for trend awareness, not one-shot judgments.</li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white">Limitations and liability</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Model outputs are probabilistic estimates and can be wrong.</li>
            <li>Users are responsible for validating decisions with domain experts.</li>
            <li>Do not use this system as the sole basis for adverse actions.</li>
          </ul>
        </Card>
      </div>

      <Card className="border-amber-300/20 bg-amber-400/10">
        <p className="text-sm text-amber-100">
          By using the app, you agree to treat outputs as advisory analytics and to follow your local governance requirements.
        </p>
      </Card>
    </MotionPage>
  )
}
