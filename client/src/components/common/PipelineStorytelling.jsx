import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, ShieldCheck, XCircle, HeartHandshake, FileCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PipelineStorytelling() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'predatory' | 'trustgo'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pipeline-step', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-navy-950/60 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-trust-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust-500/10 border border-trust-500/30 text-trust-500 text-xs font-semibold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-4 h-4" />
            Recruitment Architecture Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            The Broken Middleman System vs. <span className="text-gradient-emerald">TrustGo Direct</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Compare the predatory multi-tier brokerage trap with TrustGo's legally guaranteed zero-fee recruitment architecture.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Pipeline A: Predatory Broker Pipeline */}
          <div className="pipeline-step rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-red-950/20 to-navy-900 border border-red-500/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-red-500/20 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Predatory Broker Pipeline
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  HIGH EXPLOITATION RISK
                </span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-red-900/40 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center">1</span>
                  <span className="text-slate-200 font-medium">Vulnerable Worker</span>
                  <ArrowRight className="w-4 h-4 text-red-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-red-900/40 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center">2</span>
                  <span className="text-slate-200 font-medium">Local Village Dalal (Broker)</span>
                  <ArrowRight className="w-4 h-4 text-red-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-red-900/40 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center">3</span>
                  <span className="text-slate-200 font-medium">Sub-Agent & Unlicensed Agency</span>
                  <ArrowRight className="w-4 h-4 text-red-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-red-900/40 text-sm">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center">4</span>
                  <span className="text-slate-200 font-medium">Unverified Foreign Employer</span>
                </div>
              </div>

              {/* Systemic Exploitation Factors */}
              <h4 className="text-xs uppercase font-bold text-red-400 tracking-wider mb-3">
                Systemic Hazards & Violations:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Extortionate Fees:</strong> Worker pays $3,500 - $6,000 via high-interest predatory village loans.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Contract Substitution:</strong> Promised salaries drastically slashed upon airport arrival.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Passport Confiscation:</strong> Immediate loss of travel documents and freedom of movement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Legal Recourse:</strong> Unrecorded cash payments leave no paper trail for prosecution.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-500/20 text-center">
              <span className="text-xs text-red-400 font-semibold">
                Result: Debt bondage & international human trafficking vulnerability
              </span>
            </div>
          </div>

          {/* Pipeline B: TrustGo Verified Direct Pipeline */}
          <div className="pipeline-step rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-trust-950/30 to-navy-900 border border-trust-500/40 shadow-xl flex flex-col justify-between shadow-glow-emerald">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-trust-500/20 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-trust-500/10 text-trust-500 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    TrustGo Verified Pipeline
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-trust-500/20 text-trust-500 border border-trust-500/30">
                  ZERO-FEE GUARANTEED
                </span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-trust-500/30 text-sm">
                  <span className="w-6 h-6 rounded-full bg-trust-500/20 text-trust-500 font-bold text-xs flex items-center justify-center">1</span>
                  <span className="text-slate-200 font-medium">Worker Profile & TTC Verification</span>
                  <ArrowRight className="w-4 h-4 text-trust-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-trust-500/30 text-sm">
                  <span className="w-6 h-6 rounded-full bg-trust-500/20 text-trust-500 font-bold text-xs flex items-center justify-center">2</span>
                  <span className="text-slate-200 font-medium">Direct Connection to Verified Employer</span>
                  <ArrowRight className="w-4 h-4 text-trust-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-trust-500/30 text-sm">
                  <span className="w-6 h-6 rounded-full bg-trust-500/20 text-trust-500 font-bold text-xs flex items-center justify-center">3</span>
                  <span className="text-slate-200 font-medium">Digital Contract & Escrow Setup (30/30/40)</span>
                  <ArrowRight className="w-4 h-4 text-trust-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-950/60 border border-trust-500/30 text-sm">
                  <span className="w-6 h-6 rounded-full bg-trust-500/20 text-trust-500 font-bold text-xs flex items-center justify-center">4</span>
                  <span className="text-slate-200 font-medium">Safe Arrival & Day-30 Bengali Welfare Audit</span>
                </div>
              </div>

              {/* TrustGo Built-in Guarantees */}
              <h4 className="text-xs uppercase font-bold text-trust-500 tracking-wider mb-3">
                Legally Enforced Worker Protections:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-trust-500 shrink-0 mt-0.5" />
                  <span><strong>$0 Fee Legal Guarantee:</strong> Employer funds all visas, flights, and admin costs. Worker pays zero taka.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-trust-500 shrink-0 mt-0.5" />
                  <span><strong>Cryptographic Transparency:</strong> Contract terms and salary locked permanently in immutable audit records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-trust-500 shrink-0 mt-0.5" />
                  <span><strong>Passport Possession Verification:</strong> Milestone 2 release requires verified worker possession of passport.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-trust-500 shrink-0 mt-0.5" />
                  <span><strong>Day-30 Welfare Check-In:</strong> Voluntary Bengali voice check-in validates on-site conditions & salary receipt.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-trust-500/20 text-center">
              <span className="text-xs text-trust-500 font-semibold">
                Result: Dignified ethical employment & complete international ESG legal compliance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
