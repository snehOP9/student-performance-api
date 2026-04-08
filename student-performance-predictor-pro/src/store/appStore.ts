import { create } from 'zustand'
import type {
  AssessmentPayload,
  AuthUser,
  PredictionHistoryItem,
  PredictionResponse,
  RecommendationItem,
  ThemeMode,
  UncertaintyResponse,
} from '../types'
import {
  defaultAssessment,
  fallbackPrediction,
  fallbackRecommendations,
  fallbackUncertainty,
  predictionHistorySeed,
} from '../data/mock'

type PlannerItem = { id: string; label: string; done: boolean }
type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

type AppState = {
  theme: ThemeMode
  motionEnabled: boolean
  comparisonMode: boolean
  apiStatus: 'checking' | 'online' | 'offline'
  authStatus: AuthStatus
  currentUser: AuthUser | null
  profileCompletion: number
  assessmentDraft: AssessmentPayload
  currentPrediction: PredictionResponse
  currentUncertainty: UncertaintyResponse
  currentRecommendations: RecommendationItem[]
  predictionHistory: PredictionHistoryItem[]
  checklist: PlannerItem[]
  setTheme: (theme: ThemeMode) => void
  setMotionEnabled: (motionEnabled: boolean) => void
  setApiStatus: (status: 'checking' | 'online' | 'offline') => void
  setAuthStatus: (status: AuthStatus) => void
  setAuthenticated: (user: AuthUser) => void
  clearAuthState: () => void
  toggleComparisonMode: () => void
  saveDraft: (payload: AssessmentPayload) => void
  addPrediction: (prediction: PredictionResponse, confidence?: number, studentName?: string) => void
  setPredictionBundle: (bundle: {
    prediction: PredictionResponse
    uncertainty: UncertaintyResponse
    recommendations: RecommendationItem[]
    studentName?: string
  }) => void
  toggleChecklistItem: (id: string) => void
}

function createHistoryItem(
  prediction: PredictionResponse,
  confidence = fallbackUncertainty.confidence,
  studentName = 'Aarav Rao',
): PredictionHistoryItem {
  return {
    ...prediction,
    id: `${studentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    studentName,
    confidence,
    generatedAt: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date()),
  }
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  motionEnabled: true,
  comparisonMode: false,
  apiStatus: 'checking',
  authStatus: 'checking',
  currentUser: null,
  profileCompletion: 84,
  assessmentDraft: defaultAssessment,
  currentPrediction: fallbackPrediction,
  currentUncertainty: fallbackUncertainty,
  currentRecommendations: fallbackRecommendations,
  predictionHistory: predictionHistorySeed,
  checklist: [
    { id: '1', label: 'Lock attendance above 90% for three sessions', done: true },
    { id: '2', label: 'Complete two deep-work sprints after school', done: false },
    { id: '3', label: 'Shift lights-out target to 10:45 PM', done: false },
  ],
  setTheme: (theme) => set({ theme }),
  setMotionEnabled: (motionEnabled) => set({ motionEnabled }),
  setApiStatus: (apiStatus) => set({ apiStatus }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  setAuthenticated: (currentUser) => set({ currentUser, authStatus: 'authenticated' }),
  clearAuthState: () => set({ currentUser: null, authStatus: 'unauthenticated' }),
  toggleComparisonMode: () => set((state) => ({ comparisonMode: !state.comparisonMode })),
  saveDraft: (payload) => set({ assessmentDraft: payload }),
  addPrediction: (prediction, confidence, studentName) =>
    set((state) => ({
      currentPrediction: prediction,
      currentUncertainty: {
        ...state.currentUncertainty,
        confidence: confidence ?? state.currentUncertainty.confidence,
        uncertainty: 1 - (confidence ?? state.currentUncertainty.confidence),
      },
      predictionHistory: [createHistoryItem(prediction, confidence, studentName), ...state.predictionHistory].slice(0, 8),
    })),
  setPredictionBundle: ({ prediction, uncertainty, recommendations, studentName }) =>
    set((state) => ({
      currentPrediction: prediction,
      currentUncertainty: uncertainty,
      currentRecommendations: recommendations,
      predictionHistory: [
        createHistoryItem(prediction, uncertainty.confidence, studentName),
        ...state.predictionHistory,
      ].slice(0, 8),
    })),
  toggleChecklistItem: (id) =>
    set((state) => ({
      checklist: state.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    })),
}))
