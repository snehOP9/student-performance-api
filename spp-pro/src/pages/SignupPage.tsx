import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input, Select } from '../components/ui';
import { apiService } from '../services/api';
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
  const { setError } = useStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.signup({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'student' | 'teacher',
      });
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Instant AI-powered risk assessment',
    'Personalized improvement recommendations',
    'Real-time performance analytics',
    'Secure data encryption and GDPR alignment',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
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
        </motion.div>

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
                ]}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
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

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Social signup is intentionally hidden until backend OAuth endpoints are available.
            </div>

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
