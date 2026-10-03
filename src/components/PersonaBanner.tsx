import React from 'react';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Bus,
  Coins,
  Sparkles,
} from 'lucide-react';
import { PersonaMode, AppLanguage } from '../types/admission';
import { TRANSLATIONS } from '../data/admissionData';

interface PersonaBannerProps {
  mode: PersonaMode;
  onSwitchMode: (mode: PersonaMode) => void;
  language: AppLanguage;
}

export const PersonaBanner: React.FC<PersonaBannerProps> = ({
  mode,
  onSwitchMode,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 shadow-xs border transition-all duration-300 ${
        mode === 'student'
          ? 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white border-indigo-700/50'
          : 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white border-emerald-700/50'
      }`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                mode === 'student'
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                  : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'student' ? 'Student Admission Intelligence' : 'Parent Trust & Safety Portal'}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              • AI-Powered Analysis
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display mb-2">
            {mode === 'student'
              ? 'Find Your Dream Branch, Predict Cutoffs & Ace Placements'
              : 'Transparent Fees, Verified Hostels, Safety & Secure Future'}
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed">
            {mode === 'student'
              ? 'Enter your 12th marks or entrance percentile to unlock realistic branch chances (CS/AI-DS/E&TC), college cutoff trends, hackathons, and personalized CAP strategy.'
              : 'Get complete peace of mind with 100% verified 4-year fee breakdowns, government scholarships, hostel security, warden discipline, bus routes, and genuine campus ROI.'}
          </p>

          {/* Persona Value Highlights */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {mode === 'student' ? (
              <>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-300" />
                  Cutoff Predictions
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Cpu className="w-3.5 h-3.5 text-violet-300" />
                  AI & Tech Branches
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Coins className="w-3.5 h-3.5 text-amber-300" />
                  ₹12-50 LPA Placements
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Coins className="w-3.5 h-3.5 text-emerald-300" />
                  50-100% Fee Waivers
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  Hostel & Anti-Ragging Cell
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <Bus className="w-3.5 h-3.5 text-amber-300" />
                  College Bus Routes
                </span>
              </>
            )}
          </div>
        </div>

        {/* Persona Switch Action */}
        <div className="shrink-0 flex sm:flex-col items-center lg:items-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <span className="text-xs text-slate-300">
            {mode === 'student' ? 'Are you a parent researching?' : 'Looking as a student?'}
          </span>
          <button
            type="button"
            onClick={() => onSwitchMode(mode === 'student' ? 'parent' : 'student')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all active:scale-95"
          >
            {mode === 'student' ? (
              <>
                <Users className="w-4 h-4 text-emerald-600" />
                Switch to Parent Mode
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Switch to Student Mode
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
