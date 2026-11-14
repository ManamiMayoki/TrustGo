import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle, Scale, FileText, Lock, Globe2, HeartHandshake, Eye } from 'lucide-react';
import gsap from 'gsap';
import GlobeHero from '../../three/GlobeHero';
import ImpactCounter from '../../components/common/ImpactCounter';
import PipelineStorytelling from '../../components/common/PipelineStorytelling';

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power3.out' });
      gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      {/* 1. Hero Section with 3D Globe */}
      <section ref={heroRef} className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-trust-500/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-trust-500/30 text-trust-500 text-xs font-semibold shadow-glow-emerald">
                <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse"></span>
                <span>Ethical Cross-Border Recruitment Platform</span>
              </div>

              <h1 className="hero-title text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
                TrustGo — <br />
                <span className="text-gradient-emerald">Know Your Right.</span>
              </h1>

              <p className="hero-subtitle text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Building a safer future for global employment through verified international employers, strictly zero-fee recruitment for workers, and transparent legal protection.
              </p>

              {/* Core Value Checkmarks */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-trust-500" />
                  <span>Strictly $0 Worker Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-trust-500" />
                  <span>BMET & TTC Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-trust-500" />
                  <span>Milestone Escrow Safeguards</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="hero-cta pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-trust-500 to-emerald-600 hover:from-trust-600 hover:to-emerald-700 text-white shadow-glow-emerald hover:scale-[1.02] transition-all"
                >
                  <span>Explore Verified Jobs</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/register?role=EMPLOYER"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-navy-900/80 hover:bg-navy-800 text-slate-200 border border-slate-700/80 hover:border-gold-400/50 hover:text-white transition-all"
                >
                  <span>Become a Verified Employer</span>
                </Link>
              </div>
            </div>

            {/* Right: Three.js Interactive 3D Globe */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <GlobeHero />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Impact Counter Section */}
      <ImpactCounter />

      {/* 3. Recruitment Pipeline Storytelling Comparison (GSAP) */}
      <PipelineStorytelling />

      {/* 4. Core Technological Safeguards (Escrow, Day-30 Welfare, ESG Audit) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-4 h-4" />
            Institutional Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Built for Legal Accountability & Total Worker Dignity
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            TrustGo replaces risky promises with cryptographically auditable milestones and international labor compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: 3-Stage Milestone Escrow */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-trust-500/10 text-trust-500 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Milestone-Based Escrow Tracking
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Recruitment funds are held in transparent, simulated milestone accounts:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-navy-950/60 border border-slate-800">
                  <span className="text-slate-300">Milestone 1: Visa Verified</span>
                  <span className="font-bold text-trust-500">30%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-navy-950/60 border border-slate-800">
                  <span className="text-slate-300">Milestone 2: Safe Arrival & Passport</span>
                  <span className="font-bold text-trust-500">30%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-navy-950/60 border border-slate-800">
                  <span className="text-slate-300">Milestone 3: Day-30 Welfare Check</span>
                  <span className="font-bold text-gold-400">40%</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs text-trust-500 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Prevents upfront exploitation
              </span>
            </div>
          </div>

          {/* Card 2: Day-30 Welfare Monitoring */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Day-30 Post-Arrival Welfare
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Workers complete a voluntary Bengali voice check-in at 30 days post-arrival to authenticate conditions:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-trust-500" />
                  <span>Physical passport in worker's possession</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-trust-500" />
                  <span>First monthly wage disbursed as agreed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-trust-500" />
                  <span>Living quarters meet safety standards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-trust-500" />
                  <span>Zero continuous location surveillance</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs text-gold-400 font-semibold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Privacy-preserving audit model
              </span>
            </div>
          </div>

          {/* Card 3: ESG & Legal Audit Generator */}
          <div className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                ESG & CSDDD Audit Generator
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Automated 10-point audit reports generated for multinational supply chains, EU corporate due diligence, and embassy reporting:
              </p>
              <div className="p-3 rounded-lg bg-navy-950/60 border border-slate-800 text-xs space-y-1 text-slate-300">
                <div className="text-trust-500 font-bold">10-Point Verification Matrix:</div>
                <div>• Zero Worker Placement Fee Declaration</div>
                <div>• Anti-Trafficking & Wage Transparency</div>
                <div>• Official PDF Report with Cryptographic Hash</div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> ILO Convention 181 Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-trust-950 via-navy-900 to-navy-950 border border-trust-500/40 shadow-2xl relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Join the Ethical Recruitment Movement
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Whether you are an international employer seeking skilled, verified Bangladeshi workers or a worker seeking transparent global employment with zero fees, TrustGo protects your rights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register?role=WORKER"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-trust-500 hover:bg-trust-600 shadow-glow-emerald transition-all"
              >
                Register as Worker ($0 Fees)
              </Link>
              <Link
                to="/register?role=EMPLOYER"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-navy-800 hover:bg-slate-700 border border-slate-600 transition-all"
              >
                Register as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
