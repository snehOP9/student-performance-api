import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

function driftTone(status: 'Stable' | 'Monitor' | 'Action required') {
  if (status === 'Stable') return 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100'
  if (status === 'Monitor') return 'border-amber-300/25 bg-amber-500/10 text-amber-100'
  return 'border-red-300/25 bg-red-500/10 text-red-100'
}

export function ModelGovernancePage() {
  const { governanceSnapshot } = useAppStore()

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Model governance"
        title="Calibration and drift oversight"
        subtitle="A practical governance layer for model health, artifacts, and operational cautions."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Model version</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{governanceSnapshot.modelVersion}</h3>
          <p className="mt-2 text-sm text-slate-300">Training window: {governanceSnapshot.trainingWindow}</p>
          <p className="mt-1 text-sm text-slate-300">Last training: {governanceSnapshot.lastTrainingDate}</p>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Calibration snapshot</p>
          <p className="mt-2 text-2xl font-semibold text-white">Brier {governanceSnapshot.calibrationBrier.toFixed(3)}</p>
          <p className="mt-1 text-sm text-slate-300">ECE {governanceSnapshot.expectedCalibrationError.toFixed(3)}</p>
          <p className="mt-2 text-sm text-slate-400">Lower values indicate closer probability calibration.</p>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Drift status</p>
          <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${driftTone(governanceSnapshot.driftStatus)}`}>
            {governanceSnapshot.driftStatus}
          </div>
          <p className="mt-2 text-sm text-slate-300">Last check: {governanceSnapshot.lastDriftCheck}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">Artifact provenance</p>
          <h3 className="mt-3 text-xl font-semibold text-white">Current artifact fingerprint</h3>
          <p className="mt-3 text-sm text-slate-200">{governanceSnapshot.artifactFingerprint}</p>
          <p className="mt-2 text-sm text-slate-400">
            Use this fingerprint to reconcile frontend outputs with backend model artifacts during release reviews.
          </p>
        </Card>

        <Card>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/80">Governance notes</p>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-300">
            {governanceSnapshot.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-amber-300/20 bg-amber-500/10">
        <p className="text-sm text-amber-100">
          Governance metrics support operational monitoring. They do not eliminate the need for educator review and policy-based decisions.
        </p>
      </Card>
    </MotionPage>
  )
}
