import { useState } from 'react'
import { Bot, SendHorizontal } from 'lucide-react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const canned = [
  'Try raising study consistency to 80+ by using fixed slots.',
  'Your attendance volatility predicts a higher risk contribution.',
  'A 30-minute earlier sleep target can improve your focus metrics.',
]

export function AIChatbot() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState(canned[0])

  const handleAsk = () => {
    if (!message.trim()) return
    setReply(canned[Math.floor(Math.random() * canned.length)])
    setMessage('')
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-2">
          <Bot className="size-5 text-cyan-300" />
        </div>
        <div>
          <p className="text-sm text-slate-400">AI Student Guide</p>
          <h3 className="text-lg font-semibold text-white">Ask your academic copilot</h3>
        </div>
      </div>
      <p className="mb-4 rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200">{reply}</p>
      <div className="flex gap-2">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can I reduce risk this week?" />
        <Button onClick={handleAsk} variant="outline">
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </Card>
  )
}
