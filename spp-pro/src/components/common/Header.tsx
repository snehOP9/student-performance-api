import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, Bell } from 'lucide-react';
import { Button } from '../ui';
import { useStore } from '../../store';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, resetAuth } = useStore();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Assessment', path: '/assessment' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Recommendations', path: '/recommendations' },
      ]
    : [];

  const handleLogout = () => {
    resetAuth();
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <p className="font-bold text-white">SPP Pro</p>
            <p className="text-xs text-slate-400">v1.0</p>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Bell className="w-5 h-5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user.full_name}</p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          )}

          {!user && (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-white/10 bg-slate-900/50 backdrop-blur"
        >
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10"
                >
                  Settings
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <div className="space-y-2 pt-2">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" className="w-full" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};
