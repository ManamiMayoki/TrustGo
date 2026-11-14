import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Scale, Globe, Lock, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-trust-500 to-emerald-700 flex items-center justify-center p-2 shadow-glow-emerald">
                <Shield className="w-full h-full text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center">
                  Trust<span className="text-trust-500">Go</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-gold-400 font-semibold -mt-1">
                  Know Your Right
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier B2B ethical recruitment and migrant worker legal-compliance platform connecting international employers across GCC, Europe, and East Asia with verified Bangladeshi workers.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-trust-500 bg-trust-500/10 border border-trust-500/20 px-3 py-1.5 rounded-lg w-fit">
              <CheckCircle className="w-4 h-4" />
              <span>Strict Zero-Fee Policy for Workers</span>
            </div>
          </div>

          {/* Platform Corridors */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              Corridors
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/jobs?country=United Arab Emirates" className="hover:text-trust-500 transition-colors">UAE (Dubai, Abu Dhabi)</Link></li>
              <li><Link to="/jobs?country=Saudi Arabia" className="hover:text-trust-500 transition-colors">Saudi Arabia (Riyadh, Jeddah)</Link></li>
              <li><Link to="/jobs?country=Poland" className="hover:text-trust-500 transition-colors">Poland (Warsaw, Krakow - EU)</Link></li>
              <li><Link to="/jobs?country=Japan" className="hover:text-trust-500 transition-colors">Japan (Tokyo, Osaka - TITP)</Link></li>
              <li><Link to="/jobs" className="hover:text-trust-500 transition-colors font-medium text-slate-300">View All Corridors &rarr;</Link></li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              Legal Compliance
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/compliance-info" className="hover:text-trust-500 transition-colors">ILO Convention 181</Link></li>
              <li><Link to="/compliance-info" className="hover:text-trust-500 transition-colors">EU CSDDD Transparency</Link></li>
              <li><Link to="/compliance-info" className="hover:text-trust-500 transition-colors">BMET Accreditation</Link></li>
              <li><Link to="/compliance-info" className="hover:text-trust-500 transition-colors">Escrow Guarantee Terms</Link></li>
              <li><Link to="/compliance-info" className="hover:text-trust-500 transition-colors">Anti-Trafficking Policy</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">
              Access Portals
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/register?role=WORKER" className="hover:text-trust-500 transition-colors">Worker Portal (Bengali)</Link></li>
              <li><Link to="/register?role=EMPLOYER" className="hover:text-trust-500 transition-colors">Employer Verification</Link></li>
              <li><Link to="/login" className="hover:text-trust-500 transition-colors">Compliance Officer Login</Link></li>
              <li><Link to="/login" className="hover:text-trust-500 transition-colors">Admin Governance</Link></li>
              <li><Link to="/compliance-info#report" className="text-red-400 hover:text-red-300 transition-colors">Report Grievance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; 2026 TrustGo Platform. All rights reserved. <span className="text-trust-500 font-medium">"TrustGo — Know Your Right."</span>
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-trust-500" />
              <span>TLS 1.3 256-bit Encrypted</span>
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-gold-400" />
              <span>ILO & EU CSDDD Aligned</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
