import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { useNavigate } from 'react-router-dom';

// Recommendations Page
export const RecommendationsPage = () => {
  const navigate = useNavigate();
  const recommendations = [
    {
      id: 1,
      title: 'Increase Daily Study Sessions',
      description: 'Split your study into 4-5 focused 50-minute sessions with 10-minute breaks',
      impact: 'High impact',
      priority: 1,
      icon: '📚',
    },
    {
      id: 2,
      title: 'Establish Consistent Sleep Schedule',
      description: 'Aim for 7-9 hours of sleep daily at consistent times to improve cognitive function',
      impact: 'High impact',
      priority: 2,
      icon: '😴',
    },
    {
      id: 3,
      title: 'Join Study Groups',
      description: 'Collaborate with 2-3 classmates for peer learning and motivation',
      impact: 'Quick win',
      priority: 3,
      icon: '👥',
    },
    {
      id: 4,
      title: 'Use Time Management Tools',
      description: 'Try the Pomodoro technique or calendar blocking to optimize study time',
      impact: 'Quick win',
      priority: 4,
      icon: '⏰',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Personalized Recommendations</h1>
          <p className="text-slate-400">AI-powered suggestions to improve your academic performance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-4"
        >
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card interactive>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4 flex-1">
                    <span className="text-4xl">{rec.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        rec.impact === 'High impact'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {rec.impact}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Learn More →
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-2">📈 Expected Impact</h3>
          <p className="text-slate-300 mb-4">
            Implementing these recommendations could reduce your risk score by 20-30% over the next 4 weeks.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Track Progress →
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Analytics Page
export const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-400 mb-8">Advanced insights and data visualizations</p>
        <Card className="p-12 text-center">
          <p className="text-slate-300 mb-4">📊 Comprehensive analytics with charts and trends coming soon...</p>
          <Button variant="secondary">View Sample Data</Button>
        </Card>
      </div>
    </div>
  );
};

// Settings Page
export const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
        <div className="space-y-6">
          {[
            { title: 'Profile Settings', icon: '👤' },
            { title: 'Notification Preferences', icon: '🔔' },
            { title: 'Privacy & Security', icon: '🔒' },
            { title: 'Accessibility', icon: '♿' },
            { title: 'Theme & Display', icon: '🎨' },
          ].map((setting, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card interactive>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className="text-3xl">{setting.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{setting.title}</h3>
                    </div>
                  </div>
                  <span className="text-slate-400">→</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Page
export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">About SPP Pro</h1>
          <p className="text-slate-400 mb-8">How our AI helps predict and improve student outcomes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-300">
              To empower every student with data-driven insights that help them succeed. We believe that with early intervention and personalized guidance, we can improve academic outcomes for all students.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-300 mb-4">
              Our advanced machine learning models analyze multiple factors including study habits, engagement patterns, attendance, sleep quality, and demographics to predict academic risk.
            </p>
            <p className="text-slate-300">
              By identifying at-risk students early, educators can provide targeted support and interventions to improve outcomes.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-white mb-4">Data Privacy</h2>
            <p className="text-slate-300">
              We take privacy seriously. All data is encrypted, securely stored, and compliant with GDPR regulations. We never share personal information with third parties.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Contact Page
export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-slate-400 mb-8">Get in touch with our team</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">📧 Email</h3>
            <a href="mailto:support@sppro.com" className="text-blue-400 hover:text-blue-300">
              support@sppro.com
            </a>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">💼 Business</h3>
            <a href="mailto:sales@sppro.com" className="text-blue-400 hover:text-blue-300">
              sales@sppro.com
            </a>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">🌐 Social</h3>
            <div className="flex gap-4">
              <a href="#" className="text-blue-400 hover:text-blue-300">Twitter</a>
              <a href="#" className="text-blue-400 hover:text-blue-300">LinkedIn</a>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">📍 Location</h3>
            <p className="text-slate-300">San Francisco, CA<br/>United States</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
