import type {
  AssessmentPayload,
  ComparisonStudent,
  PredictionHistoryItem,
  PredictionResponse,
  RecommendationItem,
  UncertaintyResponse,
} from '../types'

export const defaultAssessment: AssessmentPayload = {
  study_hours_sum: 42,
  study_hours_mean: 6,
  clicks_sum: 180,
  resources_sum: 28,
  forum_posts_sum: 9,
  attendance_mean: 0.86,
  sleep_mean: 7.1,
  study_habits_index_mean: 74,
  consistency_score_mean: 71,
  cramming_indicator_mean: 0.32,
  age: 17,
  gender_F: 1,
  gender_M: 0,
  gender_Other: 0,
  socio_econ_low: 0,
  socio_econ_middle: 1,
  socio_econ_high: 0,
  school_type_public: 1,
  school_type_private: 0,
  parent_education_none: 0,
  parent_education_primary: 0,
  parent_education_secondary: 1,
  parent_education_bachelor: 0,
  parent_education_master_: 0,
  internet_access: 1,
  tutoring: 0,
}

export const fallbackPrediction: PredictionResponse = {
  risk_probability: 41.6,
  risk_band: 'Moderate',
  explanation: [
    'Attendance variability is increasing risk exposure.',
    'Sleep consistency is slightly below benchmark cohort.',
    'Study engagement is strong but concentrated before deadlines.',
  ],
}

export const fallbackUncertainty: UncertaintyResponse = {
  confidence: 0.82,
  uncertainty: 0.18,
}

export const fallbackRecommendations: RecommendationItem[] = [
  {
    id: 'r1',
    title: 'Adopt 25-minute deep work blocks',
    description: 'Schedule 4 focused sessions per day with app blockers enabled.',
    impact: 'High impact',
    expectedReduction: 14,
  },
  {
    id: 'r2',
    title: 'Sleep regularity protocol',
    description: 'Maintain a ±30 minute bedtime window for 14 consecutive days.',
    impact: 'Long-term',
    expectedReduction: 11,
  },
  {
    id: 'r3',
    title: 'Attendance alert nudges',
    description: 'Enable morning check-ins and accountability reminders.',
    impact: 'Quick win',
    expectedReduction: 7,
  },
]

export const kpiData = [
  { name: 'Mon', risk: 52, attendance: 78, study: 64, sleep: 70, engagement: 58 },
  { name: 'Tue', risk: 49, attendance: 84, study: 69, sleep: 74, engagement: 63 },
  { name: 'Wed', risk: 47, attendance: 82, study: 73, sleep: 72, engagement: 70 },
  { name: 'Thu', risk: 44, attendance: 88, study: 75, sleep: 79, engagement: 74 },
  { name: 'Fri', risk: 42, attendance: 90, study: 77, sleep: 80, engagement: 78 },
  { name: 'Sat', risk: 40, attendance: 92, study: 72, sleep: 83, engagement: 73 },
  { name: 'Sun', risk: 39, attendance: 90, study: 70, sleep: 84, engagement: 69 },
]

export const predictionHistorySeed: PredictionHistoryItem[] = [
  {
    id: 'hist-1',
    studentName: 'Aarav Rao',
    generatedAt: '2026-03-22 09:12',
    confidence: 0.82,
    risk_probability: 41.6,
    risk_band: 'Moderate',
    explanation: fallbackPrediction.explanation,
  },
  {
    id: 'hist-2',
    studentName: 'Maya Singh',
    generatedAt: '2026-03-19 14:30',
    confidence: 0.79,
    risk_probability: 34.2,
    risk_band: 'Low',
    explanation: [
      'Attendance recovery is lowering projected risk.',
      'Sleep rhythm is stabilizing weekly retention.',
      'Study spread is balanced across the week.',
    ],
  },
  {
    id: 'hist-3',
    studentName: 'Rohan Das',
    generatedAt: '2026-03-14 16:44',
    confidence: 0.86,
    risk_probability: 62.8,
    risk_band: 'High',
    explanation: [
      'Compressed revision windows are driving cramming intensity.',
      'Attendance dips are compounding the workload burden.',
      'Forum activity is low during support-heavy modules.',
    ],
  },
]

export const comparisonProfiles: ComparisonStudent[] = [
  {
    id: 'cmp-1',
    name: 'Aarav Rao',
    track: 'STEM Intensive',
    risk: 41.6,
    attendance: 89,
    sleep: 7.1,
    consistency: 78,
    momentum: '+6.2% recovery',
  },
  {
    id: 'cmp-2',
    name: 'Nia Thompson',
    track: 'Honors Hybrid',
    risk: 33.2,
    attendance: 94,
    sleep: 7.8,
    consistency: 84,
    momentum: '+10.4% recovery',
  },
]

export const assistantPrompts = [
  'Which habit gives the fastest risk reduction this week?',
  'Explain why uncertainty is still above the target threshold.',
  'Compare my profile with the top quartile students.',
]

export const cohortDistribution = [
  { name: 'Low', value: 46 },
  { name: 'Moderate', value: 37 },
  { name: 'High', value: 17 },
]
