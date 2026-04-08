import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { apiService } from '../services/api';
import { useStore } from '../store';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setError, setUser } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login({ email, password });
      const accessToken = response.data?.access_token;
      const refreshToken = response.data?.refresh_token;

      if (!accessToken || !refreshToken) {
        throw new Error('This account requires two-factor authentication, which this screen does not support yet.');
      }

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      const profile = await apiService.getProfile();
      setUser({
        ...profile.data,
        created_at: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
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
        </motion.div>

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
                placeholder="Enter your password"
                value={password}
                onChange={(val) => setPassword(val)}
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Social sign-in is intentionally hidden until backend OAuth endpoints are available.
            </div>

            <p className="mt-6 text-center text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
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
