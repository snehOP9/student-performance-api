import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { SectionTitle } from '../components/common/SectionTitle'

export function ContactSupportPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Contact / Support" subtitle="Support channels, help categories, and feedback" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold">Contact form</h3>
          <div className="mt-3 grid gap-3">
            <Input placeholder="Name" />
            <Input placeholder="Email" />
            <Input placeholder="Category" />
            <Textarea placeholder="How can we help?" />
            <Button>Send request</Button>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>Email support placeholder</Card>
          <Card>Live chat placeholder</Card>
          <Card>Feedback card</Card>
        </div>
      </div>
    </div>
  )
}
