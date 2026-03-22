import { useAppStore } from '../store/appStore'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { SectionTitle } from '../components/common/SectionTitle'

export function SettingsPage() {
  const { theme, setTheme } = useAppStore()

  return (
    <div className="space-y-6">
      <SectionTitle title="Settings" subtitle="Theme, notifications, accessibility, language, and profile preferences" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Theme switcher</h3>
          <div className="mt-3 flex gap-2">
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
          </div>
        </Card>
        <Card>Notification settings</Card>
        <Card>Accessibility settings</Card>
        <Card>Language selector UI</Card>
      </div>
    </div>
  )
}
