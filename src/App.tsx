/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Compass,
  FileCheck,
  Coins,
  Building2,
  Calendar,
  LifeBuoy,
  GraduationCap,
  Sparkles,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { PersonaMode, AppLanguage, StudentProfile } from './types/admission';
import { Header } from './components/Header';
import { PersonaBanner } from './components/PersonaBanner';
import { ChatCopilot } from './components/ChatCopilot';
import { EligibilityCalculator } from './components/EligibilityCalculator';
import { DocumentChecker } from './components/DocumentChecker';
import { ScholarshipCalculator } from './components/ScholarshipCalculator';
import { CollegeComparison } from './components/CollegeComparison';
import { DeadlineTracker } from './components/DeadlineTracker';
import { ProblemSolver } from './components/ProblemSolver';
import { VoiceInputModal } from './components/VoiceInputModal';
import { TRANSLATIONS } from './data/admissionData';

export default function App() {
  const [mode, setMode] = useState<PersonaMode>('student');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');

  // Default active candidate profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Candidate',
    stream: '12th_science_pcm',
    boardPercentage: 74.0,
    entranceExam: 'MHT-CET',
    entranceScore: 86.4,
    category: 'OBC',
    annualIncome: 4.5,
    preferredBranch: 'Computer Engineering / CSE',
    preferredLocation: 'Pune Region (COEP, PICT, VIT, PCCOE)',
    hasHostelRequirement: true,
    domicileState: 'Maharashtra',
  });

  const t = TRANSLATIONS[language];

  // Handler to navigate directly to the AI Copilot tab with an initial query
  const handleAskCopilot = (query: string) => {
    setInitialChatQuery(query);
    setActiveTab('chat');
  };

  const handleVoiceTranscriptSubmit = (transcript: string) => {
    handleAskCopilot(transcript);
  };

  const navItems = [
    { id: 'chat', label: t.navChat, icon: MessageSquare, badge: 'AI Live' },
    { id: 'eligibility', label: t.navEligibility, icon: Compass },
    { id: 'documents', label: t.navDocuments, icon: FileCheck },
    { id: 'scholarships', label: t.navScholarships, icon: Coins },
    { id: 'compare', label: t.navCompare, icon: Building2 },
    { id: 'deadlines', label: t.navDeadlines, icon: Calendar },
    { id: 'troubleshoot', label: t.navTroubleshoot, icon: LifeBuoy, isAlert: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Header
        mode={mode}
        onModeChange={setMode}
        language={language}
        onLanguageChange={setLanguage}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Dynamic Persona Insight Banner */}
        <PersonaBanner
          mode={mode}
          onSwitchMode={setMode}
          language={language}
        />

        {/* Feature Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? mode === 'student'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAlert ? 'text-rose-500' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Renderer */}
        <div className="transition-all duration-200">
          {activeTab === 'chat' && (
            <ChatCopilot
              mode={mode}
              language={language}
              studentProfile={studentProfile}
              initialQuery={initialChatQuery}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'eligibility' && (
            <EligibilityCalculator
              profile={studentProfile}
              onProfileChange={setStudentProfile}
              onAskCopilot={handleAskCopilot}
              mode={mode}
              language={language}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentChecker
              profile={studentProfile}
              onAskCopilot={handleAskCopilot}
              language={language}
              mode={mode}
            />
          )}

          {activeTab === 'scholarships' && (
            <ScholarshipCalculator
              profile={studentProfile}
              onAskCopilot={handleAskCopilot}
              mode={mode}
              language={language}
            />
          )}

          {activeTab === 'compare' && (
            <CollegeComparison
              onAskCopilot={handleAskCopilot}
              mode={mode}
              language={language}
            />
          )}

          {activeTab === 'deadlines' && (
            <DeadlineTracker
              onAskCopilot={handleAskCopilot}
              language={language}
              mode={mode}
            />
          )}

          {activeTab === 'troubleshoot' && (
            <ProblemSolver
              onAskCopilot={handleAskCopilot}
              language={language}
              mode={mode}
            />
          )}
        </div>

      </main>

      {/* Voice Assistant Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitTranscript={handleVoiceTranscriptSubmit}
        language={language}
        mode={mode}
      />

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800">EduGuide AI</span>
            <span>• Next-Gen Admission Intelligence for Students & Parents</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Compliant with DTE & State CET Cell Guidelines</span>
            <span>•</span>
            <span>MahaDBT Verified Rules</span>
            <span>•</span>
            <span>Multilingual: EN / हिंदी / मराठी</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
