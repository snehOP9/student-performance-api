import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import {
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning models predict student risk with high accuracy.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Monitor student performance and engagement with beautiful, interactive charts.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Recommendations',
      description: 'Get actionable insights tailored to each student\'s unique learning patterns.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with GDPR-compliant data handling and encryption.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Impact Tracking',
      description: 'Measure intervention effectiveness and track improvement over time.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast predictions and intuitive interface for mobile and desktop.',
    },
  ];

  const benefits = [
    {
      title: 'For Students',
      items: [
        'Personalized study recommendations',
        'Early warning alerts',
        'Progress tracking and motivation',
        'Evidence-based improvement plans',
      ],
    },
    {
      title: 'For Teachers',
      items: [
        'Identify at-risk students early',
        'Data-driven intervention planning',
        'Class-wide analytics dashboard',
        'Student performance insights',
      ],
    },
    {
      title: 'For Institutions',
      items: [
        'Improve graduation rates',
        'Reduce student dropout',
        'Allocate resources effectively',
        'Institutional analytics dashboard',
      ],
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in seconds with your email or social login.',
    },
    {
      number: '02',
      title: 'Enter Student Data',
      description: 'Input study patterns, attendance, and engagement metrics.',
    },
    {
      number: '03',
      title: 'Get Predictions',
      description: 'Receive instant risk assessments and confidence intervals.',
    },
    {
      number: '04',
      title: 'Take Action',
      description: 'Follow personalized recommendations to improve outcomes.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Academic Dean',
      image: '🎓',
      text: 'SPP Pro helped us identify at-risk students 3 weeks earlier, resulting in 15% better retention rates.',
    },
    {
      name: 'James Rodriguez',
      role: 'Student',
      image: '👨',
      text: 'The personalized recommendations were game-changing. I improved my consistency score by 40%!',
    },
    {
      name: 'Prof. Maria Gomez',
      role: 'Educator',
      image: '👩',
      text: 'This tool transformed how I support students. Data-driven insights made all the difference.',
    },
  ];

  const faqs = [
    {
      question: 'How accurate are the predictions?',
      answer: 'Our models achieve 85%+ accuracy through advanced machine learning, continuously improved with new data.',
    },
    {
      question: 'What data do you collect?',
      answer: 'We collect only study patterns, engagement metrics, and academic data. No personal information is stored.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! Bank-level encryption, GDPR compliance, and regular security audits ensure your data is protected.',
    },
    {
      question: 'Can I export reports?',
      answer: 'Absolutely. Export detailed PDFs and data for individual students or cohort-wide reports.',
    },
    {
      question: 'Do you offer institutional licenses?',
      answer: 'Yes! Volume licensing is available. Contact our sales team for custom enterprise packages.',
    },
    {
      question: 'What is the learning curve?',
      answer: 'Minimal! Most users are productive within minutes. We provide comprehensive onboarding.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6"
          >
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-200 text-sm font-medium">
              🚀 Powered by Advanced AI & Machine Learning
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Predict Risk.
            <br />
            <span className="gradient-text">Improve Outcomes.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            AI-powered student performance prediction platform. Empower every student with personalized insights and actionable recommendations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button onClick={() => navigate('/assessment')} size="lg">
              📊 Try Assessment
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/signup')}>
              Create Account
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center"
          >
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
          <p className="text-xl text-slate-300">Everything you need to transform student outcomes</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6" id="features">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <div className="p-3 w-fit bg-blue-500/20 rounded-lg mb-4 border border-blue-500/30">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Built for Everyone</h2>
          <p className="text-xl text-slate-300">Tailored solutions for students, teachers, and institutions</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <h3 className="text-2xl font-bold text-white mb-6">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-slate-300">Simple, intuitive, and powerful in just 4 steps</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card>
                <div className="text-5xl font-bold text-blue-400/30 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </Card>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Loved by Users</h2>
          <p className="text-xl text-slate-300">Real testimonials from real users</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card>
                <div className="text-4xl mb-4">{testimonial.image}</div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card interactive>
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center font-semibold text-white text-lg">
                    {faq.question}
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-slate-400 text-sm">{faq.answer}</p>
                </details>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform student outcomes?</h2>
            <p className="text-slate-300 mb-8">Join thousands of educators and institutions using SPP Pro.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/signup')} size="lg">
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')}>
                Schedule Demo
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};
