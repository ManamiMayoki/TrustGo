import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  ShieldCheck,
  Briefcase,
  CheckCircle,
  Clock,
  Mic,
  Volume2,
  DollarSign,
  AlertCircle,
  FileText,
  MapPin,
  Building,
  Key,
} from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Day-30 Voice Check-In State
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [bengaliTranscript, setBengaliTranscript] = useState(
    'আমি আল-মনসুর কোম্পানিতে ভালো আছি। থাকা-খাওয়ার ব্যবস্থা সুন্দর। ১ম মাসের বেতন ঠিকমতো পেয়েছি এবং পাসপোর্ট আমার নিজের কাছেই আছে।'
  );
  const [passportPossession, setPassportPossession] = useState(true);
  const [salaryPaid, setSalaryPaid] = useState(true);
  const [safeHousing, setSafeHousing] = useState(true);
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, appsRes, escrowsRes] = await Promise.all([
        api.get('/workers/profile').catch(() => ({ data: { data: null } })),
        api.get('/workers/applications').catch(() => ({ data: { data: [] } })),
        api.get('/escrow').catch(() => ({ data: { data: [] } })),
      ]);
      setProfile(profileRes.data.data);
      setApplications(appsRes.data.data || []);
      setEscrows(escrowsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load worker dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAudioRecorded(true);
    }, 2000);
  };

  const handleSubmitDay30 = async (e) => {
    e.preventDefault();
    if (!selectedEscrow) return;

    setSubmittingCheckIn(true);
    try {
      await api.post(`/escrow/${selectedEscrow._id}/day-30-checkin`, {
        voiceNoteUrl: 'https://assets.trustgo.com/audio/bengali_voice_checkin_worker.mp3',
        bengaliTranscript,
        passportInPossession: passportPossession,
        salaryPaidAsContracted: salaryPaid,
        safeAccommodations: safeHousing,
      });

      setCheckInSuccess(true);
      setTimeout(() => {
        setCheckInSuccess(false);
        setShowCheckInModal(false);
        fetchData();
      }, 2000);
    } catch (err) {
      alert('Failed to submit welfare check-in: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center text-slate-400 bg-navy-950">
        <div className="w-12 h-12 border-4 border-trust-500/30 border-t-trust-500 rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading Worker Protection Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Worker Hero & Rights Verification Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl bg-gradient-to-r from-navy-900 via-navy-900 to-trust-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-trust-500 to-emerald-700 flex items-center justify-center p-3 shadow-glow-emerald">
                <User className="w-full h-full text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-extrabold text-white">
                    {profile?.userId?.name || user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-trust-500/10 text-trust-500 border border-trust-500/30">
                    BMET TTC Certified
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>Skills: {profile?.skills?.join(', ') || 'General Technical Trade'}</span>
                  <span>•</span>
                  <span className="text-trust-500 font-semibold">$0 Recruitment Fees Paid</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/70 border border-trust-500/30 text-xs flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-trust-500 shrink-0" />
              <div>
                <span className="text-white font-bold block">TrustGo Legal Protection Active</span>
                <span className="text-[11px] text-slate-400">
                  Passport custody guarantee & Day-30 welfare tracker enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Escrow Contracts for Worker */}
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold-400" />
                <span>Simulated Escrow Milestones & Welfare Protections</span>
              </h3>
              <p className="text-xs text-slate-400">
                Disbursements funded solely by international employer; locked until each milestone is verified.
              </p>
            </div>
          </div>

          {escrows.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active escrow contracts yet. When an employer accepts your application, simulated milestone tracking activates.
            </div>
          ) : (
            <div className="space-y-6">
              {escrows.map((escrow) => (
                <div key={escrow._id} className="p-5 rounded-xl bg-navy-950/70 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">Employer Sponsor: </span>
                      <strong className="text-white">{escrow.employerId?.companyName || 'Verified International Corp'}</strong>
                      <span className="text-slate-400 ml-2">({escrow.employerId?.country})</span>
                    </div>
                    <div className="font-mono text-trust-500">
                      Ref: {escrow.transactionReference}
                    </div>
                  </div>

                  {/* 3 Milestones Stepper */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {escrow.milestones?.map((m) => {
                      const isReleased = m.status === 'RELEASED';
                      const isEligible = m.status === 'ELIGIBLE';

                      return (
                        <div
                          key={m.milestoneType}
                          className={`p-4 rounded-xl border flex flex-col justify-between ${
                            isReleased
                              ? 'bg-trust-950/30 border-trust-500/40 text-slate-200'
                              : isEligible
                              ? 'bg-gold-950/30 border-gold-400/40 text-slate-200'
                              : 'bg-navy-950/50 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs">
                                {m.milestoneType === 'VISA_VERIFIED' && '1. Visa Verified (30%)'}
                                {m.milestoneType === 'SAFE_ARRIVAL_PASSPORT_CONFIRMED' && '2. Safe Arrival (30%)'}
                                {m.milestoneType === 'DAY_30_WELFARE_CHECKIN' && '3. Day-30 Welfare (40%)'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isReleased
                                  ? 'bg-trust-500/20 text-trust-500'
                                  : isEligible
                                  ? 'bg-gold-400/20 text-gold-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed mb-3">
                              {m.notes || 'Verified milestone protection step.'}
                            </p>
                          </div>

                          {m.milestoneType === 'DAY_30_WELFARE_CHECKIN' && !isReleased && (
                            <button
                              onClick={() => {
                                setSelectedEscrow(escrow);
                                setShowCheckInModal(true);
                              }}
                              className="w-full mt-2 py-2 rounded-lg text-xs font-bold bg-gold-500 hover:bg-gold-600 text-navy-950 flex items-center justify-center gap-1.5 shadow-glow-gold transition-all"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>Submit Day-30 Check-In</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worker Applications Pipeline */}
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-trust-500" />
              <span>My Job Applications</span>
            </h3>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <span>You have not applied for any jobs yet.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">
                      {app.jobId?.title || 'Certified Industrial Worker'}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-trust-500" />
                        <span>{app.jobId?.employerId?.companyName || 'Verified Employer'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-400" />
                        <span>{app.jobId?.city}, {app.jobId?.country}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 block">Status:</span>
                      <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-trust-500/10 text-trust-500 border border-trust-500/30">
                        {app.applicationStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Voluntary Day-30 Bengali Voice Check-In */}
        {showCheckInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-xl w-full glass-card bg-navy-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30 text-[11px] font-bold uppercase mb-2">
                    <Mic className="w-3.5 h-3.5" />
                    Bengali Voice Welfare Check-In
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">
                    Day-30 Post-Arrival Welfare Confirmation
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Your rights are strictly protected. Confirm your actual working and living conditions in native Bengali.
                  </p>
                </div>

                <form onSubmit={handleSubmitDay30} className="space-y-4 text-xs">
                  {/* Bengali Voice Note Simulation */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
                    <label className="block text-slate-300 font-semibold">
                      Bengali Voice Recording (বাংলা ভয়েস মেসেজ)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSimulateVoiceRecording}
                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                          isRecording
                            ? 'bg-red-500 animate-pulse text-white'
                            : audioRecorded
                            ? 'bg-trust-500 text-white'
                            : 'bg-gold-500 hover:bg-gold-600 text-navy-950'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>{isRecording ? 'রেকর্ড হচ্ছে...' : audioRecorded ? 'ভয়েস রেকর্ড সম্পন্ন ✓' : 'ভয়েস রেকর্ড শুরু করুন'}</span>
                      </button>
                      {audioRecorded && (
                        <span className="text-[11px] text-trust-500 flex items-center gap-1 font-semibold">
                          <Volume2 className="w-4 h-4" /> Audio Verified (12s)
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">
                        স্বয়ংক্রিয় বাংলা অডিও প্রতিলিপি (Transcript):
                      </span>
                      <textarea
                        rows={2}
                        value={bengaliTranscript}
                        onChange={(e) => setBengaliTranscript(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* 3 Essential Worker Rights Checks */}
                  <div className="space-y-2.5 p-4 rounded-xl bg-navy-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passportCheck"
                        checked={passportPossession}
                        onChange={(e) => setPassportPossession(e.target.checked)}
                        className="w-4 h-4 rounded text-trust-500 focus:ring-trust-500 bg-navy-900 border-slate-700"
                      />
                      <label htmlFor="passportCheck" className="text-slate-200 cursor-pointer">
                        আমার মূল পাসপোর্ট আমার নিজের কাছেই নিরাপদে আছে (Passport in my possession)
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="salaryCheck"
                        checked={salaryPaid}
                        onChange={(e) => setSalaryPaid(e.target.checked)}
                        className="w-4 h-4 rounded text-trust-500 focus:ring-trust-500 bg-navy-900 border-slate-700"
                      />
                      <label htmlFor="salaryCheck" className="text-slate-200 cursor-pointer">
                        ১ম মাসের বেতন চুক্তিমতো পুরোপুরি পেয়েছি (Salary disbursed as contracted)
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="housingCheck"
                        checked={safeHousing}
                        onChange={(e) => setSafeHousing(e.target.checked)}
                        className="w-4 h-4 rounded text-trust-500 focus:ring-trust-500 bg-navy-900 border-slate-700"
                      />
                      <label htmlFor="housingCheck" className="text-slate-200 cursor-pointer">
                        বাসস্থান ও কাজের পরিবেশ নিরাপদ ও মানসম্মত (Safe accommodations)
                      </label>
                    </div>
                  </div>

                  {checkInSuccess && (
                    <div className="p-3 rounded-xl bg-trust-500/20 text-trust-500 font-bold text-center">
                      Day-30 Welfare Check-In successfully recorded! Escrow milestone is now eligible for release.
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowCheckInModal(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingCheckIn || checkInSuccess}
                      className="px-6 py-2 rounded-xl bg-trust-500 hover:bg-trust-600 text-white font-bold shadow-glow-emerald disabled:opacity-50"
                    >
                      {submittingCheckIn ? 'Submitting...' : 'Submit Welfare Confirmation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
