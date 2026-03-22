// Student input schema matching backend
export interface StudentInput {
  study_hours_sum: number;
  study_hours_mean: number;
  clicks_sum: number;
  resources_sum: number;
  forum_posts_sum: number;
  attendance_mean: number;
  sleep_mean: number;
  study_habits_index_mean: number;
  consistency_score_mean: number;
  cramming_indicator_mean: number;
  age: number;
  gender_F: number;
  gender_M: number;
  gender_Other: number;
  socio_econ_low: number;
  socio_econ_middle: number;
  socio_econ_high: number;
  school_type_public: number;
  school_type_private: number;
  parent_education_none: number;
  parent_education_primary: number;
  parent_education_secondary: number;
  parent_education_bachelor: number;
  parent_education_master_: number;
  internet_access: number;
  tutoring: number;
}

export interface PredictionResult {
  risk_probability: number;
  risk_band: 'Low' | 'Moderate' | 'High';
  confidence: number;
  key_factors: Array<{
    factor: string;
    impact: number;
  }>;
}

export interface UncertaintyResult {
  lower_bound: number;
  upper_bound: number;
  point_estimate: number;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'High impact' | 'Quick win' | 'Long-term';
  category: string;
  priority: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  data: StudentInput;
  created_at: string;
  result?: PredictionResult;
}
