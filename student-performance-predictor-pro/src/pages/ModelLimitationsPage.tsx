import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function ModelLimitationsPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Model limits"
        title="What this model can and cannot do"
        subtitle="Use these constraints to avoid over-interpreting predictions."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">What this model is good for</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Early warning and triage support for student-success teams.</li>
            <li>Comparing directional changes across repeated weekly snapshots.</li>
            <li>Prioritizing which intervention to test first.</li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white">What this model is not for</h3>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            <li>Final grading, discipline, or high-stakes institutional decisions by itself.</li>
            <li>Causal claims (for example, proving one factor alone caused an outcome).</li>
            <li>Cross-context comparisons when input windows or definitions are inconsistent.</li>
          </ul>
        </Card>
      </div>

      <Card className="border-amber-300/20 bg-amber-400/10">
        <p className="text-sm text-amber-100">
          Always combine model output with educator judgment, local context, and follow-up evidence.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          'Single snapshots can miss recent life events, teacher observations, or support needs that are not represented in the assessment.',
          'If users score abstract fields inconsistently, the model can look precise while the input quality is actually weak.',
          'A low-risk estimate should not create false reassurance. Learners can still need support outside the modelled signals.',
        ].map((item) => (
          <Card key={item} className="text-sm leading-6 text-slate-300">
            {item}
          </Card>
        ))}
      </div>
    </MotionPage>
  )
}
