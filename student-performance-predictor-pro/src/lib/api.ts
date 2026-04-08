import axios from 'axios'
import type {
  AssessmentPayload,
  AuthUser,
  PredictionResponse,
  RecommendationItem,
  RiskBand,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
  timeout: 8000,
})

type RecommendationImpact = RecommendationItem['impact']

export type SignupPayload = {
  full_name: string
  email: string
  password: string
  role: 'student' | 'teacher'
}

export type LoginPayload = { email: string; password: string }

export type LoginResult = {
  requires_2fa: boolean
  temp_token?: string
  access_token?: string
  refresh_token?: string
}

function mapImpact(value: unknown): RecommendationImpact {
  if (value === 'High impact' || value === 'Quick win' || value === 'Long-term') {
    return value
  }
  return 'Quick win'
}

function mapRiskBand(value: unknown): RiskBand {
  if (value === 'Low' || value === 'Moderate' || value === 'High') {
    return value
  }
  return 'Moderate'
}

function mapPrediction(data: any): PredictionResponse {
  const explanation = Array.isArray(data?.explanation)
    ? data.explanation.map((item: unknown) => String(item))
    : []

  return {
    risk_probability: Number(data?.risk_percentage ?? 0),
    risk_band: mapRiskBand(data?.risk_band),
    explanation: explanation.length ? explanation : ['Model explanation is temporarily unavailable.'],
  }
}

export async function signup(payload: SignupPayload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await api.post('/auth/login', payload)
  return data
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

export async function fetchMe(accessToken: string): Promise<AuthUser> {
  const { data } = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

export async function refreshSession(refreshToken: string): Promise<LoginResult> {
  const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken })
  return data
}

export async function logoutSession(refreshToken: string) {
  const { data } = await api.post('/auth/logout', { refresh_token: refreshToken })
  return data
}

export async function healthCheck() {
  try {
    const { data } = await api.get('/')
    return data
  } catch {
    return { status: 'offline', message: 'API unavailable' }
  }
}

export async function predictRisk(payload: AssessmentPayload): Promise<PredictionResponse> {
  const { data } = await api.post('/predict', payload)
  return mapPrediction(data)
}

export async function getUncertainty(payload: AssessmentPayload): Promise<{ confidence: number; uncertainty: number }> {
  const { data } = await api.post('/uncertainty', payload)
  return {
    confidence: Number(data?.confidence ?? 0),
    uncertainty: Number(data?.uncertainty ?? 0),
  }
}

export async function getRecommendations(payload: AssessmentPayload): Promise<RecommendationItem[]> {
  const { data } = await api.post('/recommend', payload)
  const recommendations = Array.isArray(data?.recommendations) ? data.recommendations : []

  return recommendations.map((item: any, index: number) => ({
    id: String(item?.id ?? item?.feature ?? `rec-${index}`),
    title: String(item?.title ?? `Improve ${String(item?.feature ?? 'signal').replace(/_/g, ' ')}`),
    description: String(item?.description ?? 'Personalized action derived from the current model drivers.'),
    impact: mapImpact(item?.impact),
    expectedReduction: Number(item?.expectedReduction ?? Number(item?.risk_reduction ?? 0) * 100),
  }))
}
