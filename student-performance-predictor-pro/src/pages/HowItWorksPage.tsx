import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function HowItWorksPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="How it works"
        title="Prediction flow in four steps"
        subtitle="A transparent walkthrough from assessment entry to the next intervention you should test."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: '1) Capture recent signals',
            body: 'Enter a consistent 7-day snapshot of study, attendance, sleep, and context values.',
          },
          {
            title: '2) Generate risk estimate',
            body: 'The model returns a risk band and probability estimate based on learned patterns.',
          },
          {
            title: '3) Read uncertainty',
            body: 'Confidence and uncertainty show whether immediate action is appropriate or more data is needed.',
          },
          {
            title: '4) Execute top action',
            body: 'Apply the highest-impact recommendation and re-check outcomes in the next cycle.',
          },
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
          </Card>
        ))}
      </div>

      <Card className="border-cyan-300/20 bg-cyan-400/10">
        <p className="text-sm text-slate-100">
          Recommendation quality depends on input quality. Keep units and time windows consistent for comparable results.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Interpret the score carefully',
            body: 'A risk score is a prioritization signal. It should help decide where to look first, not replace a human decision.',
          },
          {
            title: 'Check uncertainty before acting',
            body: 'Wide prediction sets or elevated uncertainty mean the safest move may be to gather another week of evidence first.',
          },
          {
            title: 'Close the loop',
            body: 'The product is most useful when teams apply an action, collect a new snapshot, and compare directional movement over time.',
          },
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
          </Card>
        ))}
      </div>
    </MotionPage>
  )
}
