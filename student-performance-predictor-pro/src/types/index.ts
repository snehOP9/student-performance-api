export type RiskBand = 'Low' | 'Moderate' | 'High'
export type ThemeMode = 'dark' | 'light'
export type UserRole = 'student' | 'teacher' | 'admin'
export type InterventionStatus = 'Needs triage' | 'In progress' | 'Escalate' | 'Resolved'
export type PredictionSource = 'demo' | 'live'

export type AuthUser = {
  id: string
  full_name: string
  email: string
  role: UserRole
  two_fa_enabled: boolean
}

export type AssessmentPayload = {
  study_hours_sum: number
  study_hours_mean: number
  clicks_sum: number
  resources_sum: number
  forum_posts_sum: number
  attendance_mean: number
  sleep_mean: number
  study_habits_index_mean: number
  consistency_score_mean: number
  cramming_indicator_mean: number
  age: number
  gender_F: number
  gender_M: number
  gender_Other: number
  socio_econ_low: number
  socio_econ_middle: number
  socio_econ_high: number
  school_type_public: number
  school_type_private: number
  parent_education_none: number
  parent_education_primary: number
  parent_education_secondary: number
  parent_education_bachelor: number
  parent_education_master_: number
  internet_access: number
  tutoring: number
}

export type PredictionDriver = {
  feature: string
  label: string
  displayValue: string
  direction: 'increase' | 'decrease' | 'context'
  contribution: number
}

export type PredictionResponse = {
  risk_probability: number
  risk_band: RiskBand
  explanation: string[]
  summary?: string
  drivers?: PredictionDriver[]
  explainerAvailable?: boolean
}

export type UncertaintyResponse = {
  confidence: number
  uncertainty: number
  prediction_set?: '{0}' | '{1}' | '{0,1}'
  uncertainty_level?: string
  risk_band?: RiskBand
  risk_probability?: number
}

export type PredictionHistoryItem = PredictionResponse & {
  id: string
  studentName: string
  generatedAt: string
  confidence: number
}

export type RecommendationItem = {
  id: string
  title: string
  description: string
  impact: 'High impact' | 'Quick win' | 'Long-term'
  expectedReduction: number
}

export type RecommendationFollowUp = {
  id: string
  studentName: string
  actionTitle: string
  riskBefore: number
  riskAfter: number
  uncertaintyBefore: number
  uncertaintyAfter: number
  createdAt: string
  outcomeNote: string
}

export type CohortQueueItem = {
  id: string
  studentName: string
  className: string
  riskBand: RiskBand
  status: InterventionStatus
  owner: string
  nextReview: string
  lastUpdated: string
}

export type GovernanceSnapshot = {
  modelVersion: string
  trainingWindow: string
  lastTrainingDate: string
  artifactFingerprint: string
  calibrationBrier: number
  expectedCalibrationError: number
  driftStatus: 'Stable' | 'Monitor' | 'Action required'
  lastDriftCheck: string
  notes: string[]
}

export type ComparisonStudent = {
  id: string
  name: string
  track: string
  risk: number
  attendance: number
  sleep: number
  consistency: number
  momentum: string
}
