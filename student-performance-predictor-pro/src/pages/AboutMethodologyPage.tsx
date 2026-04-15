import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'

export function AboutMethodologyPage() {
  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Methodology"
        title="How the model thinks"
        subtitle="A practical explanation of what goes into the model, what comes out, and how the product turns a raw risk estimate into an action brief."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="text-xl font-semibold text-white">1. Inputs</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The model reads a recent snapshot of study volume, attendance, sleep, engagement, and contextual learner signals.
            The quality of the prediction depends on keeping those values in a consistent time window.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">2. Risk estimate</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The backend produces a risk probability and maps it into a low, moderate, or high intervention band so teams
            can make triage decisions faster.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">3. Action brief</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The product pairs the risk score with uncertainty signals, local drivers, and ranked recommendations so users
            know what changed the estimate and what to try next.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">What the product surfaces</h3>
          <div className="mt-4 grid gap-3">
            {[
              'A risk score that estimates intervention priority.',
              'A confidence and uncertainty layer that tells you whether the profile looks stable or noisy.',
              'Driver-level explanations showing what is currently raising or lowering risk.',
              'Counterfactual recommendations that suggest the first actions worth testing.',
            ].map((item) => (
              <div key={item} className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">What the product does not claim</h3>
          <div className="mt-4 grid gap-3">
            {[
              'It does not prove causality. A driver can correlate with risk without being the only reason risk is higher.',
              'It does not replace educator judgment, counseling context, or institutional policy.',
              'It does not turn one prediction into a final academic decision such as grading or discipline.',
              'It does not stay trustworthy if the input window, units, or scoring logic are inconsistent.',
            ].map((item) => (
              <div key={item} className="rounded-[1.1rem] border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-cyan-300/20 bg-cyan-400/10">
        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-100/80">Trust checklist</p>
        <p className="mt-3 text-sm leading-6 text-slate-100">
          Before operational use, confirm that users understand the time window, the meaning of each ratio field, the role
          of uncertainty, and the fact that recommendations should be validated with follow-up evidence.
        </p>
      </Card>
    </MotionPage>
  )
}
