import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AssessmentPayload,
  AuthUser,
  CohortQueueItem,
  GovernanceSnapshot,
  InterventionStatus,
  PredictionSource,
  PredictionHistoryItem,
  PredictionResponse,
  RecommendationItem,
  RecommendationFollowUp,
  ThemeMode,
  UncertaintyResponse,
} from '../types'
import {
  cohortQueueSeed,
  defaultAssessment,
  fallbackPrediction,
  fallbackRecommendations,
  fallbackUncertainty,
  governanceSnapshot,
  predictionHistorySeed,
  recommendationFollowUpSeed,
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
  currentPredictionSource: PredictionSource
  currentPrediction: PredictionResponse
  currentUncertainty: UncertaintyResponse
  currentRecommendations: RecommendationItem[]
  predictionHistory: PredictionHistoryItem[]
  governanceSnapshot: GovernanceSnapshot
  cohortQueue: CohortQueueItem[]
  recommendationFollowUps: RecommendationFollowUp[]
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
  updateCohortStatus: (id: string, status: InterventionStatus) => void
  addRecommendationFollowUp: (entry: {
    studentName: string
    actionTitle: string
    riskBefore: number
    riskAfter: number
    uncertaintyBefore: number
    uncertaintyAfter: number
    outcomeNote: string
  }) => void
  toggleChecklistItem: (id: string) => void
}

function formatTimestamp(date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function createHistoryItem(
  prediction: PredictionResponse,
  confidence = fallbackUncertainty.confidence,
  studentName = 'Sneh',
): PredictionHistoryItem {
  return {
    ...prediction,
    id: `${studentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    studentName,
    confidence,
    generatedAt: formatTimestamp(),
  }
}

function createFollowUpEntry(entry: {
  studentName: string
  actionTitle: string
  riskBefore: number
  riskAfter: number
  uncertaintyBefore: number
  uncertaintyAfter: number
  outcomeNote: string
}): RecommendationFollowUp {
  return {
    ...entry,
    id: `fu-${Date.now()}`,
    createdAt: formatTimestamp(),
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      motionEnabled: true,
      comparisonMode: false,
      apiStatus: 'checking',
      authStatus: 'checking',
      currentUser: null,
      profileCompletion: 84,
      assessmentDraft: defaultAssessment,
      currentPredictionSource: 'demo',
      currentPrediction: fallbackPrediction,
      currentUncertainty: fallbackUncertainty,
      currentRecommendations: fallbackRecommendations,
      predictionHistory: predictionHistorySeed,
      governanceSnapshot,
      cohortQueue: cohortQueueSeed,
      recommendationFollowUps: recommendationFollowUpSeed,
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
          currentPredictionSource: 'live',
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
          currentPredictionSource: 'live',
          currentPrediction: prediction,
          currentUncertainty: uncertainty,
          currentRecommendations: recommendations,
          predictionHistory: [
            createHistoryItem(prediction, uncertainty.confidence, studentName),
            ...state.predictionHistory,
          ].slice(0, 8),
        })),
      updateCohortStatus: (id, status) =>
        set((state) => ({
          cohortQueue: state.cohortQueue.map((item) =>
            item.id === id ? { ...item, status, lastUpdated: formatTimestamp() } : item,
          ),
        })),
      addRecommendationFollowUp: (entry) =>
        set((state) => ({
          recommendationFollowUps: [createFollowUpEntry(entry), ...state.recommendationFollowUps].slice(0, 30),
        })),
      toggleChecklistItem: (id) =>
        set((state) => ({
          checklist: state.checklist.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item,
          ),
        })),
    }),
    {
      name: 'spp-pro-store-v2',
      partialize: (state) => ({
        theme: state.theme,
        predictionHistory: state.predictionHistory,
        checklist: state.checklist,
        cohortQueue: state.cohortQueue,
        recommendationFollowUps: state.recommendationFollowUps,
      }),
    },
  ),
)
