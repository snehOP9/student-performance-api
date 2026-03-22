import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';
import { apiService } from '../services/api';
import type { StudentInput } from '../types';

const schema = z.object({
  // Study Habits
  study_hours_sum: z.number().min(0).max(100),
  study_hours_mean: z.number().min(0).max(20),
  clicks_sum: z.number().min(0).max(10000),
  resources_sum: z.number().min(0).max(100),
  forum_posts_sum: z.number().min(0).max(500),
  
  // Lifestyle
  attendance_mean: z.number().min(0).max(100),
  sleep_mean: z.number().min(0).max(24),
  study_habits_index_mean: z.number().min(0).max(100),
  consistency_score_mean: z.number().min(0).max(100),
  cramming_indicator_mean: z.number().min(0).max(100),
  
  // Demographics
  age: z.number().min(16).max(70),
  gender_F: z.number(),
  gender_M: z.number(),
  gender_Other: z.number(),
  socio_econ_low: z.number(),
  socio_econ_middle: z.number(),
  socio_econ_high: z.number(),
  school_type_public: z.number(),
  school_type_private: z.number(),
  parent_education_none: z.number(),
  parent_education_primary: z.number(),
  parent_education_secondary: z.number(),
  parent_education_bachelor: z.number(),
  parent_education_master_: z.number(),
  internet_access: z.number(),
  tutoring: z.number(),
});

type AssessmentFormData = z.infer<typeof schema>;

export const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLastPrediction, addAssessment } = useStore();

  const { register, handleSubmit, watch } = useForm<AssessmentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      study_hours_sum: 0,
      study_hours_mean: 0,
      clicks_sum: 0,
      resources_sum: 0,
      forum_posts_sum: 0,
      attendance_mean: 0,
      sleep_mean: 0,
      study_habits_index_mean: 0,
      consistency_score_mean: 0,
      cramming_indicator_mean: 0,
      age: 20,
      gender_F: 0,
      gender_M: 1,
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
    },
  });

  const formValues = watch();

  const steps = [
    {
      title: 'Study Patterns',
      description: 'Tell us about your study habits and engagement',
      fields: [
        'study_hours_sum',
        'study_hours_mean',
        'clicks_sum',
        'resources_sum',
        'forum_posts_sum',
      ],
    },
    {
      title: 'Lifestyle',
      description: 'Share your daily habits and consistency',
      fields: [
        'attendance_mean',
        'sleep_mean',
        'study_habits_index_mean',
        'consistency_score_mean',
        'cramming_indicator_mean',
      ],
    },
    {
      title: 'Demographics',
      description: 'Personal and educational background',
      fields: [
        'age',
        'gender_F',
        'gender_M',
        'gender_Other',
        'socio_econ_low',
        'socio_econ_middle',
        'socio_econ_high',
        'school_type_public',
        'school_type_private',
        'parent_education_none',
        'parent_education_primary',
        'parent_education_secondary',
        'parent_education_bachelor',
        'parent_education_master_',
        'internet_access',
        'tutoring',
      ],
    },
  ];

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      setLoading(true);
      
      // Call the predict endpoint
      const response = await apiService.predict(data as StudentInput);
      const prediction = response.data;
      
      // Store the prediction
      setLastPrediction(prediction);
      addAssessment({
        id: Date.now().toString(),
        user_id: 'current_user',
        data: data as StudentInput,
        created_at: new Date().toISOString(),
        result: prediction,
      });

      // Navigate to results
      navigate('/results');
    } catch (error) {
      console.error('Assessment submission failed:', error);
      // Handle error - show toast notification
    } finally {
      setLoading(false);
    }
  };

  const fieldLabels: Record<string, string> = {
    study_hours_sum: 'Total Study Hours',
    study_hours_mean: 'Average Daily Study Hours',
    clicks_sum: 'Total Platform Clicks',
    resources_sum: 'Resources Accessed',
    forum_posts_sum: 'Forum Posts',
    attendance_mean: 'Attendance %',
    sleep_mean: 'Average Sleep Hours',
    study_habits_index_mean: 'Study Habits Index',
    consistency_score_mean: 'Consistency Score',
    cramming_indicator_mean: 'Cramming Tendency',
    age: 'Age',
    gender_F: 'Female',
    gender_M: 'Male',
    gender_Other: 'Other',
    socio_econ_low: 'Low Income',
    socio_econ_middle: 'Middle Income',
    socio_econ_high: 'High Income',
    school_type_public: 'Public School',
    school_type_private: 'Private School',
    parent_education_none: 'No Parent Education',
    parent_education_primary: 'Primary Education',
    parent_education_secondary: 'Secondary Education',
    parent_education_bachelor: "Bachelor's Degree",
    parent_education_master_: "Master's Degree",
    internet_access: 'Internet Access',
    tutoring: 'Has Tutoring',
  };

  const currentStepData = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Student Assessment</h1>
          <p className="text-slate-400">Step {step + 1} of {steps.length}: {currentStepData.title}</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < step
                    ? 'bg-green-500'
                    : i === step
                    ? 'bg-blue-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-400">
            <span>{step + 1} of {steps.length}</span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <h2 className="text-2xl font-semibold text-white mb-2">{currentStepData.title}</h2>
              <p className="text-slate-400 mb-8">{currentStepData.description}</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {currentStepData.fields.map((fieldName) => {
                  const isBinary = [
                    'gender_F',
                    'gender_M',
                    'gender_Other',
                    'socio_econ_low',
                    'socio_econ_middle',
                    'socio_econ_high',
                    'school_type_public',
                    'school_type_private',
                    'parent_education_none',
                    'parent_education_primary',
                    'parent_education_secondary',
                    'parent_education_bachelor',
                    'parent_education_master_',
                    'internet_access',
                    'tutoring',
                  ].includes(fieldName);

                  if (isBinary) {
                    return (
                      <label key={fieldName} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(fieldName as keyof AssessmentFormData, {
                            setValueAs: (value) => (value ? 1 : 0),
                          })}
                          className="w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white">{fieldLabels[fieldName]}</span>
                      </label>
                    );
                  }

                  return (
                    <div key={fieldName} className="w-full">
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        {fieldLabels[fieldName]}
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        {...register(fieldName as keyof AssessmentFormData, { valueAsNumber: true })}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Live Summary */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8">
                <p className="text-sm text-blue-200 mb-3">
                  <span className="font-semibold">Live Summary:</span> Following form values captured
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {currentStepData.fields.slice(0, 4).map((field) => (
                    <div key={field} className="text-xs">
                      <p className="text-slate-400">{fieldLabels[field]}</p>
                      <p className="text-blue-300 font-semibold">
                        {formValues[field as keyof AssessmentFormData]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className={step === 0 ? 'invisible' : ''}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {step < steps.length - 1 ? (
                  <Button type="button" onClick={() => setStep(step + 1)}>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    <CheckCircle2 className="w-4 h-4" />
                    {loading ? 'Analyzing...' : 'Complete Assessment'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </form>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <Card>
            <h4 className="text-white font-semibold mb-2">💡 Smart Tip</h4>
            <p className="text-sm text-slate-400">Enter honest values for accurate predictions. Your data helps improve recommendations.</p>
          </Card>
          <Card>
            <h4 className="text-white font-semibold mb-2">⏱️ Time Estimate</h4>
            <p className="text-sm text-slate-400">This assessment takes about 2-3 minutes to complete. You can save and return later.</p>
          </Card>
          <Card>
            <h4 className="text-white font-semibold mb-2">🔒 Privacy</h4>
            <p className="text-sm text-slate-400">Your data is encrypted and never shared. We comply with GDPR and privacy standards.</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
