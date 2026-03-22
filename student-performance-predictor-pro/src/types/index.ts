export type RiskBand = 'Low' | 'Moderate' | 'High'

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

export type PredictionResponse = {
  risk_probability: number
  risk_band: RiskBand
  explanation: string[]
}

export type RecommendationItem = {
  id: string
  title: string
  description: string
  impact: 'High impact' | 'Quick win' | 'Long-term'
  expectedReduction: number
}
