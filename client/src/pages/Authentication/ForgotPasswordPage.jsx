import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus(res.data.message || 'Password reset link sent to your registered email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trust-500 to-emerald-700 flex items-center justify-center p-2 shadow-glow-emerald">
              <Shield className="w-full h-full text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-white">
              Trust<span className="text-trust-500">Go</span>
            </span>
          </Link>
          <h2 className="text-2xl font-display font-bold text-white">Reset Password</h2>
          <p className="mt-1 text-xs text-slate-400">
            Enter your email to receive a secure, short-lived reset link
          </p>
        </div>

        {status && (
          <div className="p-3.5 rounded-xl bg-trust-500/10 border border-trust-500/30 flex items-start gap-2 text-xs text-trust-500">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{status}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-trust-500 hover:bg-trust-600 text-white shadow-glow-emerald transition-all disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
