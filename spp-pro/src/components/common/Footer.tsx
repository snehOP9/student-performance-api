import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  const links = {
    Product: [
      { label: 'Features', path: '/#features' },
      { label: 'Pricing', path: '/#pricing' },
      { label: 'Security', path: '/about' },
      { label: 'Updates', path: '/#' },
    ],
    Resources: [
      { label: 'Documentation', path: '/about' },
      { label: 'Blog', path: '/#' },
      { label: 'Guides', path: '/#' },
      { label: 'Support', path: '/contact' },
    ],
    Company: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/#' },
      { label: 'Privacy', path: '/#' },
    ],
  };

  return (
    <footer className="border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <p className="font-bold text-white">SPP Pro</p>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Predict risk. Improve outcomes. Empower every student.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Twitter className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Facebook className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Linkedin className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <Mail className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-400 mb-4 sm:mb-0">
            © 2026 Student Performance Predictor Pro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
