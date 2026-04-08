import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type Props = {
  placeholder?: string
}

export function SearchFilters({ placeholder = 'Search students, cohorts, classes...' }: Props) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[1.7rem] border border-white/8 bg-white/5 p-2 backdrop-blur-xl">
      <div className="relative min-w-72 flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" />
        <Input className="pl-9" placeholder={placeholder} />
      </div>
      <Button variant="outline">Last 7 days</Button>
      <Button variant="outline">Risk band</Button>
      <Button variant="outline">Export</Button>
    </div>
  )
}
