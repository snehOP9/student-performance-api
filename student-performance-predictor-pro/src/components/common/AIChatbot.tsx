import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, SendHorizontal, Sparkles } from 'lucide-react'
import { assistantPrompts } from '../../data/mock'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const cannedResponses = [
  'Try raising study consistency to 80+ by using two fixed focus windows after school.',
  'Attendance volatility is the largest current risk driver across your last three forecasts.',
  'A 30-minute earlier bedtime could improve attention stability more than adding raw study hours.',
]

type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export function AIChatbot() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'assistant-1',
      role: 'assistant',
      text: cannedResponses[0],
    },
  ])

  const handleAsk = () => {
    if (!message.trim()) return

    const response = cannedResponses[Math.floor(Math.random() * cannedResponses.length)]
    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: 'user', text: message },
      { id: `assistant-${current.length + 1}`, role: 'assistant', text: response },
    ])
    setMessage('')
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-[1.2rem] bg-cyan-400/10 p-2">
            <Bot className="size-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-200/75">AI concierge</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Ask your academic copilot</h3>
          </div>
        </div>
        <Sparkles className="size-4 text-cyan-200" />
      </div>

      <div className="space-y-3">
        {messages.slice(-3).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[1.35rem] border p-3 text-sm ${
              item.role === 'assistant'
                ? 'border-cyan-300/20 bg-cyan-400/10 text-slate-100'
                : 'border-white/10 bg-white/6 text-slate-300'
            }`}
          >
            {item.text}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {assistantPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-300/25 hover:text-white"
            onClick={() => setMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can I reduce risk this week?"
        />
        <Button onClick={handleAsk} variant="outline">
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </Card>
  )
}
