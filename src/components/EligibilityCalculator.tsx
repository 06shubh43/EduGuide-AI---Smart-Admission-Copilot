import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building,
  Coins,
  Compass,
} from 'lucide-react';
import {
  StudentProfile,
  EvaluationResult,
  PersonaMode,
  AppLanguage,
  CandidateCategory,
} from '../types/admission';
import { TRANSLATIONS } from '../data/admissionData';

interface EligibilityCalculatorProps {
  profile: StudentProfile;
  onProfileChange: (profile: StudentProfile) => void;
  onAskCopilot: (query: string) => void;
  mode: PersonaMode;
  language: AppLanguage;
}

export const EligibilityCalculator: React.FC<EligibilityCalculatorProps> = ({
  profile,
  onProfileChange,
  onAskCopilot,
  mode,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: profile.stream,
          boardPercentage: profile.boardPercentage,
          entranceScore: profile.entranceScore,
          category: profile.category,
          annualIncome: profile.annualIncome,
          preferredBranch: profile.preferredBranch,
          preferredLocation: profile.preferredLocation,
          language,
        }),
      });

      if (!response.ok) throw new Error('Evaluation failed');
      const data: EvaluationResult = await response.json();
      setEvaluation(data);

      if (data.eligibilityVerdict === 'High Chance' || profile.entranceScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      // Fallback local evaluator
      const cet = profile.entranceScore;
      const verdict = cet >= 85 ? 'High Chance' : cet >= 65 ? 'Moderate Chance' : 'Competitive / Ambitious';
      setEvaluation({
        eligibilityVerdict: verdict,
        summary: `With ${profile.boardPercentage}% in 12th Board and ${profile.entranceScore} percentile in ${profile.entranceExam}, you meet the fundamental DTE / AICTE admission benchmark.`,
        recommendedBranches: [
          {
            branchName: 'Computer Engineering / Computer Science',
            chance: cet >= 88 ? 'High' : cet >= 75 ? 'Moderate' : 'Ambitious',
            cutoffEstimate: '82 – 94 percentile',
            avgPackage: '7.8 LPA',
            whyFit: 'High recruitment velocity and immense software product engineering opportunities.',
          },
          {
            branchName: 'Artificial Intelligence & Data Science (AI-DS)',
            chance: cet >= 80 ? 'High' : 'Moderate',
            cutoffEstimate: '76 – 88 percentile',
            avgPackage: '7.4 LPA',
            whyFit: 'Modern specialized syllabus focusing on neural networks, big data, and cloud computing.',
          },
          {
            branchName: 'Electronics & Telecommunication (E&TC)',
            chance: 'High',
            cutoffEstimate: '65 – 80 percentile',
            avgPackage: '6.5 LPA',
            whyFit: 'Bridges hardware embedded systems and software IT development pipelines.',
          },
        ],
        applicableScholarships: [
          {
            name: profile.category === 'Open' ? 'EBC Rajarshi Shahu Maharaj Scheme' : `${profile.category} Post-Matric Scholarship`,
            benefit: profile.category === 'Open' ? '50% Tuition & Exam Fee Waiver' : '100% Tuition Fee Exemption',
            eligibilityNote: 'Valid Tahsildar Income Certificate (< ₹8 LPA) & Domicile required.',
          },
          {
            name: 'TFWS (Tuition Fee Waiver Scheme)',
            benefit: '100% Tuition Fee Exemption (Pay only development fee ~₹15,000)',
            eligibilityNote: 'Applicable for top 5% merit candidates with parental income < ₹8 Lakhs.',
          },
        ],
        strategicAdvice: [
          'In CAP Round 1, enter 10 dream colleges, 15 realistic colleges, and 5 guaranteed safety colleges.',
          'Always select "Betterment" if you are allotted any option below your top choice.',
          'Verify your Non-Creamy Layer (NCL) validity certificate up to 31 March 2027 beforehand.',
        ],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Smart Course & Eligibility Matcher
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Enter your academic scores to evaluate branch cutoff feasibility and calculate scholarship waivers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
              CAP 2026 Engine
            </span>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          
          {/* Qualifying Stream */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Qualifying Stream
            </label>
            <select
              value={profile.stream}
              onChange={(e) => onProfileChange({ ...profile, stream: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
            >
              <option value="12th_science_pcm">12th Science (PCM - Physics, Chem, Math)</option>
              <option value="12th_science_pcb">12th Science (PCB - Bio Group / Biotech)</option>
              <option value="diploma_polytechnic">Direct Second Year (Diploma / Poly)</option>
              <option value="12th_commerce">12th Commerce (BCA / BBA / MCA)</option>
              <option value="12th_arts">12th Arts / Humanities</option>
            </select>
          </div>

          {/* 12th Board Marks */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                12th Board / HSC Marks
              </label>
              <span className="text-xs font-extrabold text-indigo-600">{profile.boardPercentage}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="40"
                max="100"
                step="0.5"
                value={profile.boardPercentage}
                onChange={(e) =>
                  onProfileChange({ ...profile, boardPercentage: parseFloat(e.target.value) })
                }
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
              <input
                type="number"
                min="40"
                max="100"
                step="0.1"
                value={profile.boardPercentage}
                onChange={(e) =>
                  onProfileChange({ ...profile, boardPercentage: parseFloat(e.target.value) || 0 })
                }
                className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Min 45% (Open) or 40% (Reserved) in PCM</p>
          </div>

          {/* Entrance Score & Exam */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Entrance Percentile
              </label>
              <span className="text-xs font-extrabold text-indigo-600">
                {profile.entranceScore} %ile
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={profile.entranceExam}
                onChange={(e) => onProfileChange({ ...profile, entranceExam: e.target.value as any })}
                className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium"
              >
                <option value="MHT-CET">MHT-CET</option>
                <option value="JEE-Main">JEE Main</option>
                <option value="NEET">NEET</option>
                <option value="Direct-Merit">Direct Merit</option>
              </select>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={profile.entranceScore}
                onChange={(e) =>
                  onProfileChange({ ...profile, entranceScore: parseFloat(e.target.value) || 0 })
                }
                placeholder="Percentile"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on State CET / NTA score</p>
          </div>

          {/* Quota / Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Admission Category
            </label>
            <select
              value={profile.category}
              onChange={(e) =>
                onProfileChange({ ...profile, category: e.target.value as CandidateCategory })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
            >
              <option value="Open">Open / General (General Merit)</option>
              <option value="OBC">OBC (Other Backward Class - 50% waiver)</option>
              <option value="SC">SC (Scheduled Caste - 100% waiver)</option>
              <option value="ST">ST (Scheduled Tribe - 100% waiver)</option>
              <option value="EWS">EWS (Economically Weaker Section - 50% waiver)</option>
              <option value="TFWS">TFWS (AICTE 100% Tuition Waiver Scheme)</option>
              <option value="VJNT">VJNT / NT-A / NT-B / NT-C / NT-D</option>
              <option value="SBC">SBC (Special Backward Class)</option>
              <option value="Minority">Linguistic / Religious Minority</option>
            </select>
          </div>

          {/* Annual Family Income */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Annual Family Income
            </label>
            <select
              value={profile.annualIncome}
              onChange={(e) =>
                onProfileChange({ ...profile, annualIncome: parseFloat(e.target.value) })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
            >
              <option value={1.5}>Below ₹2.5 Lakhs (Full Scholarship / Maintenance)</option>
              <option value={4.5}>₹2.5 Lakhs to ₹8.0 Lakhs (EBC 50% / TFWS eligible)</option>
              <option value={10}>Above ₹8.0 Lakhs (Open fee structure)</option>
            </select>
          </div>

          {/* Preferred Branch */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Preferred Branch / Field
            </label>
            <select
              value={profile.preferredBranch}
              onChange={(e) => onProfileChange({ ...profile, preferredBranch: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
            >
              <option value="Computer Engineering / CSE">Computer Engineering / CSE</option>
              <option value="Artificial Intelligence & Data Science">AI & Data Science (AI-DS)</option>
              <option value="Information Technology (IT)">Information Technology (IT)</option>
              <option value="Electronics & Telecommunication (E&TC)">Electronics & Telecommunication (E&TC)</option>
              <option value="Mechanical / Automation & Robotics">Mechanical / Robotics</option>
              <option value="Civil & Infrastructure">Civil & Infrastructure Engineering</option>
              <option value="Electrical / Power Systems">Electrical Engineering</option>
            </select>
          </div>

          {/* Preferred Region */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Preferred City / Region
            </label>
            <select
              value={profile.preferredLocation}
              onChange={(e) => onProfileChange({ ...profile, preferredLocation: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
            >
              <option value="Pune Region (COEP, PICT, VIT, PCCOE)">Pune Tech Hub</option>
              <option value="Mumbai Region (VJTI, SPIT, DJ Sanghvi)">Mumbai Metropolitan</option>
              <option value="Nagpur / Vidarbha Region (VNIT, RCOEM)">Nagpur Region</option>
              <option value="Nashik / Aurangabad Region">Nashik & Chhatrapati Sambhajinagar</option>
              <option value="All Maharashtra (Autonomous & Govt)">All Maharashtra</option>
            </select>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
                mode === 'student'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Eligibility Matcher</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Evaluation Results Section */}
      {evaluation ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Verdict Banner */}
          <div
            className={`p-6 rounded-2xl border shadow-xs ${
              evaluation.eligibilityVerdict === 'High Chance'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : evaluation.eligibilityVerdict === 'Moderate Chance'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    evaluation.eligibilityVerdict === 'High Chance'
                      ? 'bg-emerald-600 text-white'
                      : evaluation.eligibilityVerdict === 'Moderate Chance'
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                      Admission Feasibility Analysis
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        evaluation.eligibilityVerdict === 'High Chance'
                          ? 'bg-emerald-200 text-emerald-800'
                          : evaluation.eligibilityVerdict === 'Moderate Chance'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {evaluation.eligibilityVerdict}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1 leading-relaxed">
                    {evaluation.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAskCopilot(
                    `I got ${profile.boardPercentage}% in 12th and ${profile.entranceScore} percentile in ${profile.entranceExam}. What top colleges in ${profile.preferredLocation} should I list in my CAP choice form for ${profile.preferredBranch}?`
                  )
                }
                className="shrink-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-800 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 shadow-2xs transition-all active:scale-95"
              >
                <span>Ask AI Copilot for Full List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recommended Branches Cards */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Course Recommendations & Cutoff Trends
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {evaluation.recommendedBranches.map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Rank #{idx + 1}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          course.chance === 'High'
                            ? 'bg-emerald-100 text-emerald-700'
                            : course.chance === 'Moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {course.chance} Chance
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 leading-snug mb-2">
                      {course.branchName}
                    </h4>

                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {course.whyFit}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Expected Cutoff:</span>
                        <span className="font-bold text-slate-800">{course.cutoffEstimate}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Average Salary:</span>
                        <span className="font-bold text-emerald-600">{course.avgPackage}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onAskCopilot(
                        `Tell me the syllabus, top recruiters, and CAP cutoffs for ${course.branchName} with my ${profile.entranceScore} percentile.`
                      )
                    }
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Syllabus & Recruiters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Scholarships & Strategic Advice Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Scholarships Found */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Coins className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Eligible Scholarships & Fee Waivers
                </h3>
              </div>

              <div className="space-y-3">
                {evaluation.applicableScholarships.map((sch, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-emerald-900 text-sm">{sch.name}</span>
                      <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {sch.benefit}
                      </span>
                    </div>
                    <p className="text-emerald-800">{sch.eligibilityNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Advice for CAP Rounds */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Lightbulb className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Strategic CAP Round Advice
                </h3>
              </div>

              <div className="space-y-3">
                {evaluation.strategicAdvice.map((advice, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{advice}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Empty State Prompt */
        <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Ready to calculate your admission chances?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Adjust your 12th marks, entrance percentile, and category above, then click <strong>Run Eligibility Matcher</strong> to generate instant branch predictions.
          </p>
          <button
            type="button"
            onClick={handleEvaluate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            Quick Run with Current Scores
          </button>
        </div>
      )}

    </div>
  );
};
