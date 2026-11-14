import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, CheckCircle, ShieldCheck, FileText, Globe, AlertTriangle } from 'lucide-react';

export default function ComplianceInfoPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-navy-950 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/30 text-trust-500 text-xs font-semibold uppercase">
            <Scale className="w-4 h-4" />
            International Legal Compliance Framework
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Ethical Recruitment & Labor Standards
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto">
            TrustGo bridges Bangladeshi migrant worker recruitment with the strictest global human rights and supply chain transparency regulations.
          </p>
        </div>

        {/* 3 Core Conventions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-lg">ILO Convention 181</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Article 7(1) mandates: "Private employment agencies shall not charge directly or indirectly, in whole or in part, any fees or costs to workers." TrustGo guarantees 100% employer-funded placement.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-lg">EU CSDDD Compliance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              EU Corporate Sustainability Due Diligence Directive requires European firms to audit tier-1 and upstream labor recruitment chains. TrustGo provides downloadable cryptographic audit records.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-lg">BMET & Bangladesh Act 2013</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aligns with Bangladesh Overseas Employment and Migrants Act 2013, ensuring government-accredited Technical Training Center (TTC) skills verification and official emigration clearance.
            </p>
          </div>
        </div>

        {/* Clear Disclaimers per Section 10 */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 text-xs text-slate-300 space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gold-400" />
            <span>Scope of Platform Verification vs. Regulatory Authority</span>
          </h4>
          <p>
            TrustGo operates as an ethical technology platform and legal-compliance SaaS intermediary. While our 10-point verification engine strictly authenticates documentary evidence, employer commercial registrations, and worker zero-fee affidavits, official foreign visas remain subject to sovereign consular authorities.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-medium">
            <div className="p-2 rounded bg-navy-950 border border-slate-800 text-center">
              ✓ Platform Verification
            </div>
            <div className="p-2 rounded bg-navy-950 border border-slate-800 text-center">
              ✓ Documentary Evidence
            </div>
            <div className="p-2 rounded bg-navy-950 border border-slate-800 text-center">
              ✓ Self-Declarations
            </div>
            <div className="p-2 rounded bg-navy-950 border border-slate-800 text-center">
              ✓ Sovereign Embassy Records
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
