import {
  BarChart3,
  Building2,
  ClipboardPenLine,
  Compass,
  Contact,
  Gauge,
  History,
  Home,
  Landmark,
  Lightbulb,
  Settings,
  User,
  Users,
} from 'lucide-react'
import type { UserRole } from '../../types'

type NavItem = {
  to: string
  label: string
  icon: typeof Home
  roles?: UserRole[]
}

const workspaceLinks: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/assessment', label: 'Assessment', icon: ClipboardPenLine },
  { to: '/prediction', label: 'Prediction', icon: Gauge },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/history', label: 'History', icon: History },
  { to: '/compare', label: 'Compare Profiles', icon: Compass },
]

const managementLinks: NavItem[] = [
  { to: '/institutional', label: 'Institutional', icon: Building2, roles: ['admin'] },
  { to: '/teacher', label: 'Teacher', icon: Users, roles: ['teacher', 'admin'] },
  { to: '/profile', label: 'Student Profile', icon: User },
  { to: '/roadmap', label: 'Roadmap', icon: Landmark },
  { to: '/about', label: 'Methodology', icon: Contact },
  { to: '/support', label: 'Support', icon: Contact },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function filterByRole(items: NavItem[], role?: UserRole | null) {
  return items.filter((item) => !item.roles || (role ? item.roles.includes(role) : false))
}

export function getWorkspaceLinks(role?: UserRole | null) {
  return filterByRole(workspaceLinks, role)
}

export function getManagementLinks(role?: UserRole | null) {
  return filterByRole(managementLinks, role)
}
