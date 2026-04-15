import type { AuthUser, UserRole } from '../types'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const DEMO_USER_KEY = 'demo_user'

function isBrowser() {
  return typeof window !== 'undefined'
}

function createDemoUser(role: UserRole): AuthUser {
  const isTeacher = role === 'teacher'

  return {
    id: isTeacher ? 'demo-teacher' : 'demo-student',
    full_name: isTeacher ? 'Ishita' : 'Sneh',
    email: isTeacher ? 'teacher.demo@student-performance.ai' : 'student.demo@student-performance.ai',
    role,
    two_fa_enabled: false,
  }
}

export function readSessionTokens() {
  if (!isBrowser()) {
    return { accessToken: null, refreshToken: null }
  }

  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  }
}

export function storeSessionTokens(accessToken: string, refreshToken: string) {
  if (!isBrowser()) return
  clearDemoSession()
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearSessionTokens() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function storeDemoSession(role: UserRole = 'student') {
  if (!isBrowser()) {
    return createDemoUser(role)
  }

  const user = createDemoUser(role)
  window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
  return user
}

export function readDemoSession() {
  if (!isBrowser()) {
    return null
  }

  const rawUser = window.localStorage.getItem(DEMO_USER_KEY)
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

export function clearDemoSession() {
  if (!isBrowser()) return
  window.localStorage.removeItem(DEMO_USER_KEY)
}
