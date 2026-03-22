import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Card } from '../components/ui';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate account creation
    setTimeout(() => {
      setUser({
        id: '1',
        email: formData.email,
        full_name: formData.fullName,
        role: formData.role as 'student' | 'teacher' | 'admin',
        created_at: new Date().toISOString(),
      });
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  const benefits = [
    'Instant AI-powered risk assessment',
    'Personalized improvement recommendations',
    'Real-time performance analytics',
    'Secure data encryption & GDPR compliant',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Left - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col justify-center gap-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Join SPP Pro</h1>
            <p className="text-xl text-slate-300">
              Start your journey to better student outcomes today
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="flex gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <Card className="p-4 bg-blue-500/10 border-blue-500/30">
            <p className="text-sm text-blue-200">
              <span className="font-semibold">🎉 Limited Time:</span> First assessment free for new users!
            </p>
          </Card>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(val) => setFormData({ ...formData, fullName: val })}
                required
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(val) => setFormData({ ...formData, email: val })}
                required
              />

              <Select
                label="I am a..."
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'teacher', label: 'Teacher/Educator' },
                  { value: 'admin', label: 'Institutional Admin' },
                ]}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(val) => setFormData({ ...formData, password: val })}
                required
              />

              <label className="flex items-center gap-2 text-slate-300 text-sm">
                <input type="checkbox" className="w-4 h-4 rounded" required />
                I agree to the Terms of Service and Privacy Policy
              </label>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Social Signup */}
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary">
                  <span>🔵</span>
                  Google
                </Button>
                <Button variant="secondary">
                  <span>🔗</span>
                  GitHub
                </Button>
              </div>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign in
              </button>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
