import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        full_name: email.split('@')[0],
        role: 'student',
        created_at: new Date().toISOString(),
      });
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const providerLabel = provider === 'google' ? 'Google' : 'GitHub';
    const generatedEmail = `${provider}_user@demo.local`;

    setLoading(true);
    setTimeout(() => {
      setUser({
        id: provider === 'google' ? 'google-demo' : 'github-demo',
        email: generatedEmail,
        full_name: `${providerLabel} User`,
        role: 'student',
        created_at: new Date().toISOString(),
      });
      navigate('/dashboard');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Left - Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col justify-center gap-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-xl text-slate-300">
              Sign in to access your student performance dashboard
            </p>
          </div>

          {[
            { icon: '📊', title: 'AI Predictions', desc: 'Get instant risk assessments' },
            { icon: '💡', title: 'Smart Insights', desc: 'Personalized recommendations' },
            { icon: '📈', title: 'Analytics', desc: 'Track your progress over time' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="flex gap-4"
            >
              <span className="text-3xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(val) => setEmail(val)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(val) => setPassword(val)}
                required
              />

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="secondary" onClick={() => handleSocialLogin('google')}>
                  <span>🔵</span>
                  Google
                </Button>
                <Button type="button" variant="secondary" onClick={() => handleSocialLogin('github')}>
                  <span>🔗</span>
                  GitHub
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign up
              </button>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
