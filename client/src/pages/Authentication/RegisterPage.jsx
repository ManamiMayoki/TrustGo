import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, Mail, User, Building, Globe, CheckSquare, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'EMPLOYER' ? 'EMPLOYER' : 'WORKER';
  const [role, setRole] = useState(initialRole);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Worker Specific
  const [skills, setSkills] = useState('Electrical Installation, Industrial Maintenance');
  const [zeroFeeAffidavit, setZeroFeeAffidavit] = useState(true);

  // Employer Specific
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [city, setCity] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeTitle, setRepresentativeTitle] = useState('HR Director');
  const [phone, setPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'WORKER' && !zeroFeeAffidavit) {
      setError('You must confirm that you will pay zero recruitment fees.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
      };

      if (role === 'WORKER') {
        payload.workerData = {
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
          zeroFeeAffidavitConfirmed: true,
        };
      } else if (role === 'EMPLOYER') {
        payload.employerData = {
          companyName,
          registrationNumber,
          country,
          city,
          representativeName: representativeName || name,
          representativeTitle,
          phone,
          businessEmail: businessEmail || email,
          website,
        };
      }

      const user = await register(payload);
      if (user.role === 'EMPLOYER') {
        navigate('/employer');
      } else {
        navigate('/worker');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error?.details?.[0]?.message ||
        'Registration failed. Please check the entered data.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      <div className="max-w-xl w-full space-y-8 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
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
            Create Your Account
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Join the verified, zero-fee international recruitment network
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-navy-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'WORKER'
                ? 'bg-trust-500 text-white shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Worker ($0 Fees)
          </button>
          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'EMPLOYER'
                ? 'bg-trust-500 text-white shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            International Employer
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mohammad Rahim"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500 focus:ring-1 focus:ring-trust-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500 focus:ring-1 focus:ring-trust-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Secure Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500 focus:ring-1 focus:ring-trust-500"
            />
          </div>

          {/* Conditional Role Fields */}
          {role === 'WORKER' ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Skills & Technical Trades (Comma Separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Electrical, Welding, Pipe Fitting, HVAC"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                />
              </div>

              {/* Mandatory Zero-Fee Affidavit */}
              <div className="p-3.5 rounded-xl bg-trust-500/10 border border-trust-500/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="zeroFeeCheck"
                  checked={zeroFeeAffidavit}
                  onChange={(e) => setZeroFeeAffidavit(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-trust-500 focus:ring-trust-500 bg-navy-950 border-slate-700"
                />
                <label htmlFor="zeroFeeCheck" className="text-xs text-slate-200 leading-relaxed cursor-pointer">
                  <strong className="text-trust-500 block mb-0.5">TrustGo Zero-Fee Recruitment Guarantee</strong>
                  I understand that under no circumstances should I pay any fees to recruiters, brokers, or middlemen. TrustGo guarantees ethical, zero-fee direct recruitment for all Bangladeshi workers.
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Al-Mansoor Construction LLC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Registration / Trade License No.
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. DXB-CORP-98421"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Destination Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-trust-500"
                  >
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Poland">Poland (European Union)</option>
                    <option value="Japan">Japan (TITP Program)</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Oman">Oman</option>
                    <option value="South Korea">South Korea (EPS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dubai, Warsaw, Riyadh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 4 800 2345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Company Website
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-trust-500 to-emerald-600 hover:from-trust-600 hover:to-emerald-700 text-white shadow-glow-emerald transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span>Registering account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-trust-500 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
