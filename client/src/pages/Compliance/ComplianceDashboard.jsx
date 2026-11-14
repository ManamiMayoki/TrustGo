import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Scale,
  ShieldCheck,
  FileDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Flag,
  Send,
  Eye,
} from 'lucide-react';

export default function ComplianceDashboard() {
  const { user } = useAuth();
  const [audits, setAudits] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Report Grievance Modal
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [targetType, setTargetType] = useState('EMPLOYER');
  const [flagReason, setFlagReason] = useState('DEMANDED_RECRUITMENT_FEE');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [reportingSuccess, setReportingSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [auditsRes, flagsRes] = await Promise.all([
        api.get('/compliance/audits').catch(() => ({ data: { data: [] } })),
        api.get('/compliance/flags').catch(() => ({ data: { data: [] } })),
      ]);
      setAudits(auditsRes.data.data || []);
      setFlags(flagsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load compliance data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadPdf = async (auditId, refId) => {
    try {
      const response = await api.get(`/compliance/reports/${auditId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TrustGo_Compliance_Report_${refId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to generate compliance report PDF: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReportFlag = async (e) => {
    e.preventDefault();
    try {
      await api.post('/compliance/flags', {
        targetType,
        targetId: user?.id,
        flagReason,
        severity,
        description,
      });
      setReportingSuccess(true);
      setTimeout(() => {
        setReportingSuccess(false);
        setShowFlagModal(false);
        fetchData();
      }, 2000);
    } catch (err) {
      alert('Failed to report grievance: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center text-slate-400 bg-navy-950">
        <div className="w-12 h-12 border-4 border-trust-500/30 border-t-trust-500 rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading Legal Compliance & ESG Audit Engine...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/30 text-trust-500 text-xs font-semibold uppercase mb-2">
              <Scale className="w-4 h-4" />
              ESG & International Labor Due Diligence
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Legal Compliance Audits & ESG Certification
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Aligned with ILO Convention 181, EU Corporate Sustainability Due Diligence Directive (CSDDD), and BMET Standards.
            </p>
          </div>

          <button
            onClick={() => setShowFlagModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all"
          >
            <Flag className="w-4 h-4" />
            <span>Report Labor Violation</span>
          </button>
        </div>

        {/* 10-Point Legal Audit Matrix Overview */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-trust-500" />
              <span>Standard 10-Point Ethical Recruitment Verification Matrix</span>
            </h3>
            <span className="text-[11px] text-gold-400 font-semibold bg-gold-400/10 px-2.5 py-1 rounded border border-gold-400/30">
              Institutional Framework: ILO 181 / EU CSDDD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">1. Zero Placement Fee</div>
              <span className="text-[11px] text-slate-400">Employer 100% financed recruitment</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">2. Wage Transparency</div>
              <span className="text-[11px] text-slate-400">Electronic wage protection guaranteed</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">3. Travel Document Custody</div>
              <span className="text-[11px] text-slate-400">Worker retains physical passport</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">4. Safe Habitable Housing</div>
              <span className="text-[11px] text-slate-400">Verified uncrowded accommodations</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">5. Full Health Insurance</div>
              <span className="text-[11px] text-slate-400">Comprehensive emergency & hospital care</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">6. Overtime Disclosures</div>
              <span className="text-[11px] text-slate-400">Mandatory statutory overtime premiums</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">7. BMET TTC Clearance</div>
              <span className="text-[11px] text-slate-400">Government certified technical training</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">8. Day-30 Welfare Check</div>
              <span className="text-[11px] text-slate-400">Voluntary Bengali voice audit</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">9. Escrow Milestones (30/30/40)</div>
              <span className="text-[11px] text-slate-400">Conditional employer disbursement</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800">
              <div className="text-trust-500 font-bold mb-1">10. Immutable Audit Trail</div>
              <span className="text-[11px] text-slate-400">Cryptographically sealed records</span>
            </div>
          </div>
        </div>

        {/* Audits Records Table with PDF Download */}
        <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-trust-500" />
              <span>Contract Audits & Legal Reports</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total Audits: {audits.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-950/80 uppercase text-[10px] text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Report Ref ID</th>
                  <th className="py-3 px-4">Employer Company</th>
                  <th className="py-3 px-4">Framework</th>
                  <th className="py-3 px-4">Compliance Score</th>
                  <th className="py-3 px-4">Audit Status</th>
                  <th className="py-3 px-4 text-right">Official PDF Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {audits.map((audit) => (
                  <tr key={audit._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {audit.reportReferenceId}
                    </td>
                    <td className="py-3.5 px-4">
                      {audit.employerId?.companyName || 'Verified International Partner'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {audit.frameworkStandard || 'ILO Convention 181'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-bold text-trust-500">
                        {audit.complianceScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-trust-500/10 text-trust-500 border border-trust-500/30">
                        {audit.complianceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDownloadPdf(audit._id, audit.reportReferenceId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-trust-500/20 hover:bg-trust-500/30 text-trust-500 border border-trust-500/30 transition-all shadow-glow-emerald"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download Audit PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Report Labor Grievance */}
        {showFlagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full glass-card bg-navy-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>Report Labor Rights Grievance</span>
                </h3>
                <button onClick={() => setShowFlagModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleReportFlag} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Violation Category</label>
                  <select
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  >
                    <option value="DEMANDED_RECRUITMENT_FEE">Demanded Recruitment / Placement Fee</option>
                    <option value="CONTRACT_SUBSTITUTION">Contract Substitution or Lower Wage</option>
                    <option value="PASSPORT_CONFISCATION_THREAT">Passport Confiscation / Withholding</option>
                    <option value="MISLEADING_SALARY">Unsafe Living / Working Conditions</option>
                    <option value="OTHER_VIOLATION">Other International Labor Code Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  >
                    <option value="CRITICAL">Critical (Immediate Human Rights Risk)</option>
                    <option value="HIGH">High (Contractual / Fee Violation)</option>
                    <option value="MEDIUM">Medium (Procedural Discrepancy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Factual Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details, dates, and names regarding the violation..."
                    className="w-full p-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                {reportingSuccess && (
                  <div className="p-3 rounded-xl bg-trust-500/20 text-trust-500 font-bold text-center">
                    Grievance lodged successfully. Assigned to Compliance Investigation Team.
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowFlagModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    Submit Report
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
