import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Briefcase,
  MapPin,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Building,
  Home,
  HeartPulse,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function JobsListPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [industry, setIndustry] = useState(searchParams.get('industry') || '');

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (country) params.country = country;
      if (industry) params.industry = industry;
      if (search) params.search = search;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [country, industry]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      alert('Please sign in or register as a Worker to apply.');
      return;
    }
    if (user.role !== 'WORKER') {
      alert('Only registered Workers may submit job applications.');
      return;
    }

    setApplying(true);
    setApplyError('');
    try {
      await api.post('/applications', {
        jobId: selectedJob._id,
      });
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedJob(null);
      }, 2500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/30 text-trust-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            100% Zero-Fee Verified Jobs
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Verified International Vacancies
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Every position is sponsored directly by verified employers with all recruitment, visa, and flight costs paid in full. Workers pay strictly $0.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Keyword */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, skills, keywords..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-trust-500"
              />
            </div>

            {/* Destination Country Filter */}
            <div className="sm:col-span-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-trust-500"
              >
                <option value="">All Destination Corridors</option>
                <option value="United Arab Emirates">United Arab Emirates (Dubai, Abu Dhabi)</option>
                <option value="Saudi Arabia">Saudi Arabia (Riyadh, Jeddah)</option>
                <option value="Poland">Poland (European Union)</option>
                <option value="Japan">Japan (TITP Program)</option>
                <option value="Kuwait">Kuwait</option>
              </select>
            </div>

            {/* Industry Filter */}
            <div className="sm:col-span-3">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-navy-950/70 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-trust-500"
              >
                <option value="">All Industry Sectors</option>
                <option value="Infrastructure">Infrastructure & Construction</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Hospitality">Hospitality & Catering</option>
                <option value="Healthcare">Healthcare & Caregiving</option>
                <option value="Manufacturing">Industrial Manufacturing</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-trust-500 hover:bg-trust-600 text-white shadow-glow-emerald transition-all"
              >
                Filter Jobs
              </button>
            </div>
          </form>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-12 h-12 border-4 border-trust-500/30 border-t-trust-500 rounded-full animate-spin mx-auto mb-4"></div>
            <span>Loading verified job listings...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl p-8 border border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No jobs match your filter criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or clearing the country and industry filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCountry('');
                setIndustry('');
                fetchJobs();
              }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-trust-500 border border-trust-500/40 hover:bg-trust-500/10"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  {/* Employer & Verification Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-trust-500 shrink-0" />
                      <span className="truncate">{job.employerId?.companyName || 'Verified Employer'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-trust-500/10 text-trust-500 border border-trust-500/30 shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified $0 Fee
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Location & Industry */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{job.city}, {job.country}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{job.industry}</span>
                    </span>
                  </div>

                  {/* Transparent Compensation & Terms Pills */}
                  <div className="space-y-2 mb-5">
                    <div className="p-2.5 rounded-xl bg-navy-950/70 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Transparent Monthly Wage:</span>
                      <span className="font-display font-bold text-trust-500 text-sm">
                        {job.salary?.base} {job.currency} / mo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="p-2 rounded-lg bg-navy-950/50 border border-slate-800/80 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <span className="truncate">Housing: Provided</span>
                      </div>
                      <div className="p-2 rounded-lg bg-navy-950/50 border border-slate-800/80 flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">Medical: Covered</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-trust-500" />
                    <span>Contract: {job.contractDuration}</span>
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-trust-500 hover:bg-trust-600 text-white shadow-glow-emerald transition-all"
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-2xl w-full glass-card bg-navy-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-trust-500/10 text-trust-500 border border-trust-500/30">
                    Verified Job ID: {selectedJob._id.substring(0, 8)}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-white mt-2">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{selectedJob.employerId?.companyName}</span>
                    <span>•</span>
                    <span>{selectedJob.city}, {selectedJob.country}</span>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-1">
                    Job Description
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* 100% Transparent Legal Terms */}
                <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-trust-500 tracking-wider">
                    Transparent Legal Employment Terms
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Base Salary:</span>
                      <span className="font-bold text-white text-sm">
                        {selectedJob.salary?.base} {selectedJob.currency} / month
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Working Hours:</span>
                      <span className="font-bold text-white">
                        {selectedJob.workingHours} hrs/week ({selectedJob.weeklyHolidays} rest day/week)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Overtime Terms:</span>
                      <span className="text-slate-200">{selectedJob.overtimePolicy}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Housing Accommodation:</span>
                      <span className="text-slate-200">{selectedJob.housingTerms}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Medical & Health Coverage:</span>
                      <span className="text-slate-200">{selectedJob.medicalTerms}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Contract Duration:</span>
                      <span className="text-slate-200">{selectedJob.contractDuration}</span>
                    </div>
                  </div>
                </div>

                {/* Zero-Fee Legal Guarantee Notice */}
                <div className="p-3.5 rounded-xl bg-trust-500/10 border border-trust-500/30 flex items-start gap-2.5 text-xs text-slate-200">
                  <ShieldCheck className="w-5 h-5 text-trust-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-trust-500 block mb-0.5">TrustGo Zero-Fee Recruitment Affidavit</strong>
                    Applying through TrustGo guarantees zero placement fees. Employers directly cover all visa processing, airfare, medical attestation, and deployment costs.
                  </div>
                </div>

                {applySuccess && (
                  <div className="p-3 rounded-xl bg-trust-500/20 border border-trust-500/40 text-center text-xs font-bold text-trust-500">
                    Application successfully submitted! You can monitor milestone progress in your Worker Dashboard.
                  </div>
                )}

                {applyError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-center text-xs text-red-400">
                    {applyError}
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Close
                  </button>

                  <button
                    onClick={handleApply}
                    disabled={applying || applySuccess}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-trust-500 hover:bg-trust-600 text-white shadow-glow-emerald transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {applying ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Apply ($0 Fee)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
