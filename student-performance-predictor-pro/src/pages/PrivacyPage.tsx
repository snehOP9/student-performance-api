import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function PrivacyPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Privacy"
        title="How data is handled"
        subtitle="A practical summary for pilot and production usage."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">Data used for inference</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Behavioral and context fields entered in the assessment flow.</li>
            <li>No sensitive free-text content is required by default.</li>
            <li>Only the fields needed for prediction are sent to the API.</li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white">Operational guidance</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Configure allowed frontend origins on the backend.</li>
            <li>Apply role-based access if running with real student identities.</li>
            <li>Avoid exporting or sharing identifiable records without policy approval.</li>
          </ul>
        </Card>
      </div>

      <Card className="border-cyan-300/20 bg-cyan-400/10">
        <p className="text-sm text-slate-100">
          This page is a product-level overview, not legal advice. Align deployments with your institution policy and regulations.
        </p>
      </Card>
    </MotionPage>
  )
}
