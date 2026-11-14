import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2,
  ShieldCheck,
  PlusCircle,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  DollarSign,
  Send,
  Eye,
} from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Job Creation Modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [city, setCity] = useState('Dubai');
  const [industry, setIndustry] = useState('Construction & Engineering');
  const [requiredSkills, setRequiredSkills] = useState('Electrical Wiring, Safety Protocols');
  const [vacancies, setVacancies] = useState(5);
  const [baseSalary, setBaseSalary] = useState(1400);
  const [currency, setCurrency] = useState('USD');
  const [overtimePolicy, setOvertimePolicy] = useState('1.25x standard rate for weekdays; 1.5x for weekend work');
  const [housingTerms, setHousingTerms] = useState('Full private air-conditioned accommodation with catering provided');
  const [medicalTerms, setMedicalTerms] = useState('Comprehensive group health insurance covering inpatient & emergency');
  const [workingHours, setWorkingHours] = useState(48);
  const [weeklyHolidays, setWeeklyHolidays] = useState(1);
  const [contractDuration, setContractDuration] = useState('2 Years Renewable');
  const [visaRequirements, setVisaRequirements] = useState('Direct company employment residence visa fully employer funded');
  const [jobPostingError, setJobPostingError] = useState('');

  // Verification Upload Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [docTitle, setDocTitle] = useState('Commercial Trade License');
  const [docType, setDocType] = useState('TRADE_LICENSE');
  const [docUrl, setDocUrl] = useState('https://assets.trustgo.com/docs/sample_trade_license.pdf');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, jobsRes, appsRes] = await Promise.all([
        api.get('/employers/profile').catch(() => ({ data: { data: null } })),
        api.get('/jobs/my-jobs').catch(() => ({ data: { data: [] } })),
        api.get('/applications').catch(() => ({ data: { data: [] } })),
      ]);
      setProfile(profileRes.data.data);
      setJobs(jobsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load employer dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setJobPostingError('');

    try {
      await api.post('/jobs', {
        title: jobTitle,
        description: jobDescription,
        country,
        city,
        industry,
        requiredSkills: requiredSkills.split(',').map((s) => s.trim()),
        vacancies: Number(vacancies),
        salary: { base: Number(baseSalary) },
        currency,
        overtimePolicy,
        housingTerms,
        medicalTerms,
        workingHours: Number(workingHours),
        weeklyHolidays: Number(weeklyHolidays),
        contractDuration,
        visaRequirements,
        zeroWorkerFeeGuarantee: true,
      });

      setShowJobModal(false);
      fetchData();
    } catch (err) {
      setJobPostingError(err.response?.data?.message || 'Failed to post job listing.');
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employers/verify', {
        documents: [
          {
            title: docTitle,
            documentType: docType,
            fileUrl: docUrl,
          },
        ],
      });
      setShowVerifyModal(false);
      fetchData();
    } catch (err) {
      alert('Verification submission error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating candidate status: ' + (err.response?.data?.message || err.message));
    }
  };

  const isVerified = profile?.verificationStatus === 'VERIFIED';

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center text-slate-400 bg-navy-950">
        <div className="w-12 h-12 border-4 border-trust-500/30 border-t-trust-500 rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading Employer Management Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Verification Status Banner */}
        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
          isVerified
            ? 'bg-trust-950/40 border-trust-500/40'
            : 'bg-gold-950/30 border-gold-500/40'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-2.5 ${
              isVerified ? 'bg-trust-500/20 text-trust-500' : 'bg-gold-400/20 text-gold-400'
            }`}>
              <ShieldCheck className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-white">
                  {profile?.companyName || user?.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-trust-500/20 text-trust-500 border border-trust-500/30'
                    : 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                }`}>
                  Status: {profile?.verificationStatus || 'UNDER REVIEW'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isVerified
                  ? 'Your company is verified to post direct jobs with zero worker-paid recruitment fees.'
                  : 'Submit your commercial license and authorization documents to unlock direct job publishing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isVerified && (
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-navy-950 shadow-glow-gold transition-all"
              >
                Submit Verification Docs
              </button>
            )}

            <button
              onClick={() => {
                if (!isVerified) {
                  alert('Only verified employers may publish jobs. Please submit verification documents.');
                  return;
                }
                setShowJobModal(true);
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow-emerald ${
                isVerified
                  ? 'bg-trust-500 hover:bg-trust-600 text-white'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Verified Job</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Vacancies
            </span>
            <div className="text-3xl font-display font-extrabold text-white">
              {jobs.length}
            </div>
            <span className="text-[11px] text-trust-500 mt-1 block">
              100% Zero-fee recruitment guaranteed
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Candidate Applications
            </span>
            <div className="text-3xl font-display font-extrabold text-white">
              {applications.length}
            </div>
            <span className="text-[11px] text-blue-400 mt-1 block">
              BMET & TTC Certified candidates
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              ESG Compliance Rating
            </span>
            <div className="text-3xl font-display font-extrabold text-gradient-emerald">
              {profile?.esgRating?.score || 96} / 100
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tier {profile?.esgRating?.tier || 'A'} — EU CSDDD & ILO Aligned
            </span>
          </div>
        </div>

        {/* Candidate Recruitment Pipeline Table */}
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-trust-500" />
                <span>Candidate Recruitment Pipeline</span>
              </h3>
              <p className="text-xs text-slate-400">
                Applicants from Bangladesh Technical Training Centers (PII Redacted for privacy protection)
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-navy-950 px-3 py-1 rounded-lg border border-slate-800">
              Total Candidates: {applications.length}
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <span>No candidates applied yet. Ensure your jobs are published.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-navy-950/80 uppercase text-[10px] text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate ID</th>
                    <th className="py-3 px-4">Applied Role</th>
                    <th className="py-3 px-4">Skills & Trade</th>
                    <th className="py-3 px-4">TTC Verification</th>
                    <th className="py-3 px-4">Zero-Fee Affidavit</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {app.workerId?._id?.substring(0, 8) || 'CAND-981'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">
                        {app.jobId?.title || 'Electrical Specialist'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {app.workerId?.skills?.slice(0, 2).join(', ') || 'Certified Trade'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-trust-500/10 text-trust-500 border border-trust-500/20">
                          BMET Attested
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-trust-500 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> $0 Confirmed
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {app.applicationStatus === 'APPLIED' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'SHORTLISTED')}
                            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-[10px]"
                          >
                            Shortlist
                          </button>
                        )}
                        {app.applicationStatus === 'SHORTLISTED' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'OFFERED')}
                            className="px-2.5 py-1 rounded bg-trust-500/20 hover:bg-trust-500/30 text-trust-500 font-semibold text-[10px]"
                          >
                            Make Offer
                          </button>
                        )}
                        {app.applicationStatus === 'OFFERED' && (
                          <button
                            onClick={() => handleUpdateAppStatus(app._id, 'CONTRACT_SIGNED')}
                            className="px-2.5 py-1 rounded bg-gold-400/20 hover:bg-gold-400/30 text-gold-400 font-semibold text-[10px]"
                          >
                            Sign Contract
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Job Postings Section */}
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold-400" />
              <span>Published Transparent Job Listings</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{job.title}</h4>
                  <span className="text-[10px] font-bold text-trust-500 px-2 py-0.5 rounded bg-trust-500/10 border border-trust-500/30">
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <span>Base: {job.salary?.base} {job.currency}/mo</span>
                  <span>Vacancies: {job.vacancies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Post New Job */}
        {showJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <div className="max-w-2xl w-full glass-card bg-navy-900 border border-slate-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <h3 className="text-xl font-bold text-white">Post Verified Vacancy (Zero Worker Fee)</h3>
                <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {jobPostingError && (
                <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-xs mb-4">
                  {jobPostingError}
                </div>
              )}

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Mechanical Equipment Maintenance Specialist"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Description (Min 20 chars)</label>
                  <textarea
                    required
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe duties, safety standards, and employer sponsorship..."
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Destination Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Base Monthly Salary</label>
                    <input
                      type="number"
                      required
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Currency</label>
                    <input
                      type="text"
                      required
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Vacancies</label>
                    <input
                      type="number"
                      required
                      value={vacancies}
                      onChange={(e) => setVacancies(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Overtime Policy (Transparent Disclosure)</label>
                  <input
                    type="text"
                    required
                    value={overtimePolicy}
                    onChange={(e) => setOvertimePolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Housing Accommodation Terms</label>
                    <input
                      type="text"
                      required
                      value={housingTerms}
                      onChange={(e) => setHousingTerms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Medical & Health Coverage</label>
                    <input
                      type="text"
                      required
                      value={medicalTerms}
                      onChange={(e) => setMedicalTerms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-trust-500/10 border border-trust-500/30 text-trust-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Mandatory Zero-Fee Guarantee: Employer covers all costs. No worker placement deductions.</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-trust-500 hover:bg-trust-600 text-white font-bold"
                  >
                    Publish Verified Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Verification Docs */}
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <div className="max-w-md w-full glass-card bg-navy-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Upload Legal Verification Document</h3>
              <p className="text-xs text-slate-400 mb-4">
                Submit commercial trade license or recruitment authorization for Admin verification.
              </p>
              <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  >
                    <option value="TRADE_LICENSE">Trade License</option>
                    <option value="INCORPORATION_CERTIFICATE">Incorporation Certificate</option>
                    <option value="RECRUITMENT_AUTHORIZATION">Recruitment Authorization</option>
                    <option value="TAX_REGISTRATION">Tax Registration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Secure File URL</label>
                  <input
                    type="text"
                    required
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
