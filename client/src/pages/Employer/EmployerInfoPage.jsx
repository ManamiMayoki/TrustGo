import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle, ShieldCheck, Users, ArrowRight, Award } from 'lucide-react';

export default function EmployerInfoPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/30 text-trust-500 text-xs font-semibold uppercase">
            <Building2 className="w-4 h-4" />
            For International Employers
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Ethical Direct Recruitment with Zero Legal Liability
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto">
            Source skilled, pre-screened Bangladeshi talent directly. Eliminate middleman bribery, comply with international ESG standards, and safeguard your company brand reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <CheckCircle className="w-8 h-8 text-trust-500 mb-2" />
            <h3 className="font-bold text-white text-lg">Direct Hiring, Zero Dalals</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bypass fraudulent local brokers and sub-agents. Connect directly with candidates whose technical credentials have been authenticated through BMET technical training centers.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <Award className="w-8 h-8 text-gold-400 mb-2" />
            <h3 className="font-bold text-white text-lg">ESG & Institutional Due Diligence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate one-click audit reports that prove your recruitment supply chain complies with the EU Corporate Sustainability Due Diligence Directive (CSDDD).
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-bold text-white text-lg">Simulated Escrow Protection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Milestone accounting protects your recruitment budget: 30% on visa verification, 30% on safe arrival, and 40% on Day-30 welfare check-in completion.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-r from-trust-950/60 to-navy-900 border border-trust-500/40 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to hire ethically?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Submit your company verification documents today to join our global network of verified international employers.
          </p>
          <Link
            to="/register?role=EMPLOYER"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-trust-500 hover:bg-trust-600 shadow-glow-emerald"
          >
            <span>Register Your Company</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
