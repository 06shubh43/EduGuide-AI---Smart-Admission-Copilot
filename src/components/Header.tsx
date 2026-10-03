import React from 'react';
import {
  GraduationCap,
  Users,
  Globe,
  Mic,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PersonaMode, AppLanguage } from '../types/admission';
import { TRANSLATIONS } from '../data/admissionData';

interface HeaderProps {
  mode: PersonaMode;
  onModeChange: (mode: PersonaMode) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenVoice: () => void;
  isVoiceActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  language,
  onLanguageChange,
  onOpenVoice,
  isVoiceActive = false,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
              mode === 'student'
                ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-indigo-200'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-200'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  {t.appTitle}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  mode === 'student'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {mode === 'student' ? 'Student Mode' : 'Parent Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-sm">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action Center: Persona Toggle, Language Switcher, Voice Prompt */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dual Persona Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => onModeChange('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Student Mode: Focus on cutoffs, branches, skills & top salaries"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Student</span>
              </button>
              <button
                type="button"
                onClick={() => onModeChange('parent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'parent'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Parent Mode: Focus on verified fees, hostel safety, bus routes & ROI"
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Parent</span>
              </button>
            </div>

            {/* Language Selector: EN, HI, MR */}
            <div className="relative flex items-center bg-slate-100 rounded-xl px-2 py-1 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
                className="bg-transparent text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Quick Voice Assistant Trigger */}
            <button
              type="button"
              onClick={onOpenVoice}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isVoiceActive
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-xs'
              }`}
              title="Voice Admission Assistant (English / Hindi / Marathi)"
            >
              <Mic className={`w-4 h-4 ${isVoiceActive ? 'text-white' : 'text-indigo-600'}`} />
              <span className="hidden lg:inline">{t.askVoice}</span>
            </button>

            {/* Admission Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>CAP 2026 Active</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
