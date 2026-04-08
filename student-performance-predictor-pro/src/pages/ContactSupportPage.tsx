import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

export function ContactSupportPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Support"
        title="Need help?"
        subtitle="Product help, integration guidance, and troubleshooting for demo or production use."
      />

      <Card>
        <h3 className="text-2xl font-semibold text-white">Support channels</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Contact the team for implementation questions, data mapping, and showcase support for your next institutional demo.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button>Open support ticket</Button>
          <Button variant="outline">Book onboarding call</Button>
        </div>
      </Card>
    </MotionPage>
  )
}
