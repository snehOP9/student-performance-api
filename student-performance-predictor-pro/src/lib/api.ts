import axios from 'axios'
import { fallbackPrediction, fallbackRecommendations } from '../data/mock'
import type { AssessmentPayload, PredictionResponse, RecommendationItem } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
  timeout: 8000,
})

export type SignupPayload = {
  full_name: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
}

export type LoginPayload = { email: string; password: string }

export type LoginResult = {
  requires_2fa: boolean
  temp_token?: string
  access_token?: string
  refresh_token?: string
}

export type SocialProvider = 'google' | 'github'

export async function signup(payload: SignupPayload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function socialLogin(provider: SocialProvider): Promise<LoginResult> {
  try {
    const { data } = await api.post(`/auth/oauth/${provider}`)
    return {
      requires_2fa: Boolean(data?.requires_2fa),
      temp_token: data?.temp_token,
      access_token: data?.access_token,
      refresh_token: data?.refresh_token,
    }
  } catch {
    return {
      requires_2fa: false,
      access_token: `demo-${provider}-access-token`,
      refresh_token: `demo-${provider}-refresh-token`,
    }
  }
}

export async function verify2FA(tempToken: string, code: string): Promise<LoginResult> {
  const { data } = await api.post('/auth/2fa/verify', { temp_token: tempToken, code })
  return data
}

export async function forgotPassword(email: string) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post('/auth/reset-password', { token, new_password: newPassword })
  return data
}

export async function fetchMe(accessToken: string) {
  const { data } = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

export async function refreshSession(refreshToken: string) {
  const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken })
  return data
}

export async function healthCheck() {
  try {
    const { data } = await api.get('/')
    return data
  } catch {
    return { status: 'offline', message: 'Using fallback intelligence mode' }
  }
}

export async function predictRisk(payload: AssessmentPayload): Promise<PredictionResponse> {
  try {
    const { data } = await api.post('/predict', payload)
    return {
      risk_probability: Number(data?.risk_probability ?? data?.risk ?? fallbackPrediction.risk_probability),
      risk_band: data?.risk_band ?? fallbackPrediction.risk_band,
      explanation: data?.explanation ?? fallbackPrediction.explanation,
    }
  } catch {
    return fallbackPrediction
  }
}

export async function getUncertainty(payload: AssessmentPayload): Promise<{ confidence: number; uncertainty: number }> {
  try {
    const { data } = await api.post('/uncertainty', payload)
    return {
      confidence: Number(data?.confidence ?? 0.83),
      uncertainty: Number(data?.uncertainty ?? 0.17),
    }
  } catch {
    return { confidence: 0.82, uncertainty: 0.18 }
  }
}

export async function getRecommendations(payload: AssessmentPayload): Promise<RecommendationItem[]> {
  try {
    const { data } = await api.post('/recommend', payload)
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        id: String(item.id ?? `live-${index}`),
        title: item.title ?? item.recommendation ?? 'Strategic intervention',
        description: item.description ?? item.reason ?? 'Action generated from model factors.',
        impact: item.impact ?? 'High impact',
        expectedReduction: Number(item.expectedReduction ?? 8),
      }))
    }
    return fallbackRecommendations
  } catch {
    return fallbackRecommendations
  }
}
