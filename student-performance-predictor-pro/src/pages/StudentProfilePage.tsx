import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { SectionTitle } from '../components/common/SectionTitle'

const trend = [
  { m: 'Jan', risk: 58 },
  { m: 'Feb', risk: 51 },
  { m: 'Mar', risk: 42 },
]

export function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Student Profile" subtitle="Academic profile, trend history, and badge system" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-cyan-400/20" />
            <div>
              <h3 className="text-lg font-semibold">Maya Singh</h3>
              <p className="text-sm text-slate-400">Grade 11 • STEM Track</p>
            </div>
          </div>
          <p className="mt-4 text-sm">Profile completion: 84%</p>
          <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-2 w-[84%] rounded-full bg-cyan-300" /></div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-lg font-semibold">Historical risk trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}><XAxis dataKey="m" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Line dataKey="risk" stroke="#22d3ee" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><h4 className="font-semibold">Recommendation history</h4><p className="mt-2 text-sm text-slate-300">7 interventions completed in last 30 days.</p></Card>
        <Card><h4 className="font-semibold">Attendance & consistency</h4><p className="mt-2 text-sm text-slate-300">Attendance 89%, consistency +8% this month.</p></Card>
        <Card><h4 className="font-semibold">Performance badges</h4><div className="mt-3 flex flex-wrap gap-2"><Badge>7-day focus streak</Badge><Badge>Attendance hero</Badge></div></Card>
      </div>
    </div>
  )
}
