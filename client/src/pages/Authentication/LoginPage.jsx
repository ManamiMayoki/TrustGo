import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route to role-specific dashboard
      switch (user.role) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'EMPLOYER':
          navigate('/employer');
          break;
        case 'COMPLIANCE_OFFICER':
          navigate('/compliance');
          break;
        case 'WORKER':
        default:
          navigate('/worker');
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Fast-Fill Helper
  const fillDemoAccount = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!@#');
    setError('');
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-500 to-emerald-700 flex items-center justify-center p-2 shadow-glow-emerald">
              <Shield className="w-full h-full text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-white">
              Trust<span className="text-trust-500">Go</span>
            </span>
          </Link>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Sign In to TrustGo
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Ethical recruitment & legal compliance portal
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Bar */}
        <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-xs">
          <div className="text-slate-400 font-semibold mb-2 text-[11px] uppercase tracking-wider text-center">
            Demo Credentials (1-Click Fill)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('rahim.uddin@gmail.com', 'WORKER')}
              className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-trust-500 font-medium text-left truncate transition-colors"
            >
              • Worker (Rahim)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('tariq@almansoor-contracting.ae', 'EMPLOYER')}
              className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-blue-400 font-medium text-left truncate transition-colors"
            >
              • Employer (Dubai)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('compliance@trustgo.com', 'COMPLIANCE_OFFICER')}
              className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-purple-400 font-medium text-left truncate transition-colors"
            >
              • Compliance Officer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@trustgo.com', 'ADMIN')}
              className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-gold-400 font-medium text-left truncate transition-colors"
            >
              • Platform Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500 focus:ring-1 focus:ring-trust-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-trust-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500 focus:ring-1 focus:ring-trust-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-trust-500 to-emerald-600 hover:from-trust-600 hover:to-emerald-700 text-white shadow-glow-emerald transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-trust-500 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
