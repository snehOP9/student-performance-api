import { create } from 'zustand'
import type { AssessmentPayload, PredictionResponse } from '../types'
import { defaultAssessment, fallbackPrediction } from '../data/mock'

type PlannerItem = { id: string; label: string; done: boolean }

type AppState = {
  theme: 'dark' | 'light'
  comparisonMode: boolean
  profileCompletion: number
  assessmentDraft: AssessmentPayload
  predictionHistory: PredictionResponse[]
  checklist: PlannerItem[]
  setTheme: (theme: 'dark' | 'light') => void
  toggleComparisonMode: () => void
  saveDraft: (payload: AssessmentPayload) => void
  addPrediction: (prediction: PredictionResponse) => void
  toggleChecklistItem: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  comparisonMode: false,
  profileCompletion: 84,
  assessmentDraft: defaultAssessment,
  predictionHistory: [fallbackPrediction],
  checklist: [
    { id: '1', label: 'Complete attendance check-in', done: true },
    { id: '2', label: 'Finish 3 focus blocks', done: false },
    { id: '3', label: 'Sleep before 11:00 PM', done: false },
  ],
  setTheme: (theme) => set({ theme }),
  toggleComparisonMode: () => set((state) => ({ comparisonMode: !state.comparisonMode })),
  saveDraft: (payload) => set({ assessmentDraft: payload }),
  addPrediction: (prediction) =>
    set((state) => ({ predictionHistory: [prediction, ...state.predictionHistory].slice(0, 8) })),
  toggleChecklistItem: (id) =>
    set((state) => ({
      checklist: state.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    })),
}))
