import { BellRing, MoonStar, Sparkles } from 'lucide-react'
import { MotionPage } from '../components/common/MotionPage'
import { SectionTitle } from '../components/common/SectionTitle'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useAppStore } from '../store/appStore'

function ToggleRow({
  label,
  description,
  active,
  onToggle,
}: {
  label: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/20"
    >
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <span className={`inline-flex h-6 w-11 rounded-full p-1 transition ${active ? 'bg-cyan-400/40' : 'bg-white/10'}`}>
        <span className={`size-4 rounded-full bg-white transition ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
    </button>
  )
}

export function SettingsPage() {
  const { comparisonMode, motionEnabled, setMotionEnabled, theme, setTheme, toggleComparisonMode } = useAppStore()

  return (
    <MotionPage className="space-y-6">
      <SectionTitle
        eyebrow="Settings"
        title="Personalize the premium experience"
        subtitle="Tune theme, motion, alerts, and comparison behavior with smooth switches and low-friction controls."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <MoonStar className="size-5 text-cyan-300" />
            <h3 className="text-xl font-semibold text-white">Theme</h3>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
              Dark
            </Button>
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
              Light
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-cyan-300" />
            <h3 className="text-xl font-semibold text-white">Motion system</h3>
          </div>
          <div className="mt-5">
            <ToggleRow
              label="Enable premium motion"
              description="Keeps page transitions, glow lifts, and animated scenes active."
              active={motionEnabled}
              onToggle={() => setMotionEnabled(!motionEnabled)}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <BellRing className="size-5 text-cyan-300" />
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          <div className="mt-5 space-y-3">
            <ToggleRow
              label="Comparison mode default"
              description="Open analytics with profile comparisons enabled."
              active={comparisonMode}
              onToggle={toggleComparisonMode}
            />
            <ToggleRow
              label="Intervention reminders"
              description="Show progress prompts for incomplete recommendation tasks."
              active
              onToggle={() => undefined}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white">Accessibility and language</h3>
          <div className="mt-5 space-y-3">
            <ToggleRow
              label="High contrast accents"
              description="Boost highlight contrast for neon surfaces and key metrics."
              active={theme === 'dark'}
              onToggle={() => undefined}
            />
            <ToggleRow
              label="English interface"
              description="Primary product language for all dashboards and recommendations."
              active
              onToggle={() => undefined}
            />
          </div>
        </Card>
      </div>
    </MotionPage>
  )
}
