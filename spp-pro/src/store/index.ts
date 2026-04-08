import { create } from 'zustand';
import type { User, Assessment, StudentInput, PredictionResult } from '../types';

type StudentInputValue = StudentInput[keyof StudentInput];

interface AppStore {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Assessment
  currentAssessment: Partial<StudentInput> | null;
  assessmentHistory: Assessment[];
  lastPrediction: PredictionResult | null;
  
  // UI
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setCurrentAssessment: (assessment: Partial<StudentInput> | null) => void;
  updateAssessmentField: (field: keyof StudentInput, value: StudentInputValue) => void;
  clearAssessment: () => void;
  
  setLastPrediction: (prediction: PredictionResult | null) => void;
  addAssessment: (assessment: Assessment) => void;
  
  resetAuth: () => void;
}

export const useStore = create<AppStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentAssessment: null,
  assessmentHistory: [],
  lastPrediction: null,
  sidebarOpen: true,
  theme: 'dark',
  
  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Assessment actions
  setCurrentAssessment: (currentAssessment) => set({ currentAssessment }),
  updateAssessmentField: (field, value) =>
    set((state) => ({
      currentAssessment: {
        ...state.currentAssessment,
        [field]: value,
      },
    })),
  clearAssessment: () => set({ currentAssessment: null }),
  
  setLastPrediction: (lastPrediction) => set({ lastPrediction }),
  addAssessment: (assessment) =>
    set((state) => ({
      assessmentHistory: [assessment, ...state.assessmentHistory],
    })),
  
  resetAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      currentAssessment: null,
    }),
}));
