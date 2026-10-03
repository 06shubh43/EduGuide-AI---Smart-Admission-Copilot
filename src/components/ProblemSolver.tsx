import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  FileQuestion,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send,
  HelpCircle,
} from 'lucide-react';
import { ProblemScenario, PersonaMode, AppLanguage } from '../types/admission';
import { EMERGENCY_SCENARIOS, TRANSLATIONS } from '../data/admissionData';

interface ProblemSolverProps {
  onAskCopilot: (query: string) => void;
  language: AppLanguage;
  mode: PersonaMode;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  onAskCopilot,
  language,
  mode,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedScenario, setSelectedScenario] = useState<ProblemScenario>(
    EMERGENCY_SCENARIOS[0]
  );
  const [customProblem, setCustomProblem] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [aiSolution, setAiSolution] = useState<string | null>(null);

  const handleSolveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProblem.trim() || isSolving) return;

    setIsSolving(true);
    setAiSolution(null);

    try {
      const response = await fetch('/api/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType: 'Candidate Emergency Admission Grievance',
          userQuery: customProblem,
        }),
      });

      const data = await response.json();
      setAiSolution(data.solution || 'No specific solution generated.');
    } catch (err) {
      console.error('Troubleshoot error:', err);
      setAiSolution(
        `### Emergency Resolution Guide\n\n1. **Immediate Step**: Keep your Candidate Application ID and transaction reference safe.\n2. **FC Verification Center**: Visit the nearest Facilitation Center with original 10th marksheet and identity proof.\n3. **Provisional Undertaking**: State CET Cell accepts Proforma Undertaking for non-critical certificate delays.\n4. **Official Helpdesk**: Contact the State CET Cell helpline or submit a ticket through your registered dashboard.`
      );
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Admission Emergency Problem Solver
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Stuck with a failed payment, name spelling mismatch on marksheet vs Aadhaar, delayed caste validity, or dilemma between Freeze and Betterment? Get instant legal and procedural solutions.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Crisis Action Center</span>
          </span>
        </div>
      </div>

      {/* Interactive Custom Grievance Input */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 border border-indigo-900/60 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-white font-display">
            Describe Any Specific Admission Issue You Are Facing
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Our AI analyzes DTE regulations, grievance windows, bank reconciliation cycles, and affidavit templates to give you a step-by-step resolution.
        </p>

        <form onSubmit={handleSolveCustom} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
              placeholder="e.g. 'My bank deducted ₹1000 for seat acceptance but CAP portal status says unpaid', or 'Surname missing on Aadhaar'"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              disabled={!customProblem.trim() || isSolving}
              className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all active:scale-95 ${
                !customProblem.trim() || isSolving
                  ? 'bg-white/20 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isSolving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Solution</span>
                </>
              )}
            </button>
          </div>
        </form>

        {aiSolution && (
          <div className="mt-5 p-5 rounded-xl bg-white/10 border border-white/20 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans animate-fadeIn">
            {aiSolution}
          </div>
        )}
      </div>

      {/* Common Emergency Scenarios Tabs & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: List of Top 6 Scenarios */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
            Top Frequent Admission Bottlenecks
          </span>

          <div className="space-y-2.5">
            {EMERGENCY_SCENARIOS.map((scenario) => {
              const isSelected = selectedScenario.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenario(scenario)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {scenario.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        scenario.riskFactor === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : scenario.riskFactor === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {scenario.riskFactor} Urgency
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {scenario.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Resolution Plan */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Official Procedure & Legal Safeguard
              </span>
              <span className="text-xs text-slate-500">
                Primary Contact: <strong>{selectedScenario.contactAgency}</strong>
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
              {selectedScenario.title}
            </h3>

            <p className="text-xs text-slate-500 mb-6">
              {selectedScenario.shortSnippet}
            </p>

            {/* Step-by-Step Resolution */}
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Recommended Action Sequence:
              </span>

              {selectedScenario.resolutionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Need personalized advice for your application number?
            </span>
            <button
              type="button"
              onClick={() =>
                onAskCopilot(
                  `I have this admission crisis: "${selectedScenario.title}". Walk me through the exact steps and affidavit proforma to submit.`
                )
              }
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <span>Ask AI Copilot to Draft Appeal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
