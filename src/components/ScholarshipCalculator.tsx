import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  Calculator,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  StudentProfile,
  CandidateCategory,
  PersonaMode,
  AppLanguage,
} from '../types/admission';
import { SCHOLARSHIPS_DATA, TRANSLATIONS } from '../data/admissionData';

interface ScholarshipCalculatorProps {
  profile: StudentProfile;
  onAskCopilot: (query: string) => void;
  mode: PersonaMode;
  language: AppLanguage;
}

export const ScholarshipCalculator: React.FC<ScholarshipCalculatorProps> = ({
  profile,
  onAskCopilot,
  mode,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Base college tuition fee estimation (typical private autonomous institute in Maharashtra)
  const [baseTuitionFee, setBaseTuitionFee] = useState<number>(125000);
  const [developmentFee, setDevelopmentFee] = useState<number>(18000);
  const [examAndGymkhanaFee, setExamAndGymkhanaFee] = useState<number>(6000);
  const [includeHostel, setIncludeHostel] = useState<boolean>(true);
  const [hostelAndMessFee, setHostelAndMessFee] = useState<number>(65000);
  const [selectedCategory, setSelectedCategory] = useState<CandidateCategory>(profile.category);
  const [familyIncome, setFamilyIncome] = useState<number>(profile.annualIncome);
  const [isFemaleStudent, setIsFemaleStudent] = useState<boolean>(false);
  const [isFarmerChild, setIsFarmerChild] = useState<boolean>(false);

  // Compute scholarship waiver percentage
  let tuitionWaiverPercent = 0;
  let schemeName = 'Open Category (Full Fee)';
  let cashStipendYearly = 0;

  if (selectedCategory === 'TFWS' && familyIncome <= 8.0) {
    tuitionWaiverPercent = 100;
    schemeName = 'AICTE Tuition Fee Waiver Scheme (TFWS)';
  } else if ((selectedCategory === 'SC' || selectedCategory === 'ST') && familyIncome <= 8.0) {
    tuitionWaiverPercent = 100;
    schemeName = 'Post-Matric Govt Scholarship for SC/ST';
    cashStipendYearly += 12000;
  } else if ((selectedCategory === 'OBC' || selectedCategory === 'VJNT' || selectedCategory === 'SBC') && familyIncome <= 8.0) {
    tuitionWaiverPercent = 50;
    schemeName = 'MahaDBT Post-Matric OBC/VJNT Fee Concession';
    cashStipendYearly += 4000;
  } else if (selectedCategory === 'EWS' && familyIncome <= 8.0) {
    tuitionWaiverPercent = 50;
    schemeName = 'EWS / Rajarshi Chhatrapati Shahu Maharaj Scheme';
  } else if (selectedCategory === 'Open' && familyIncome <= 8.0) {
    tuitionWaiverPercent = 50;
    schemeName = 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh (EBC)';
  }

  // Additional girl student scholarship
  if (isFemaleStudent && familyIncome <= 8.0) {
    cashStipendYearly += 50000; // AICTE Pragati
  }

  // Additional farmer child hostel allowance
  if (isFarmerChild && includeHostel && familyIncome <= 8.0) {
    cashStipendYearly += 30000; // Dr. Panjabrao Deshmukh
  }

  const waivedTuitionAmount = (baseTuitionFee * tuitionWaiverPercent) / 100;
  const netTuitionPayable = baseTuitionFee - waivedTuitionAmount;
  const netCollegeFee = netTuitionPayable + developmentFee + examAndGymkhanaFee;
  const totalAnnualCost = netCollegeFee + (includeHostel ? hostelAndMessFee : 0) - cashStipendYearly;
  const totalFourYearCost = Math.max(0, totalAnnualCost * 4);

  // Installment (Semester basis)
  const semesterFee = Math.round(totalAnnualCost / 2);
  const monthlyEMIEstimate = Math.round(totalAnnualCost / 12);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Coins className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Smart Scholarship Finder & Net Fee Calculator
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Discover exact government fee waivers (50% to 100%), cash stipends for girls, farmer allowances, and 4-year installment plans for parents.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MahaDBT Verified Schemes</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Calculator Inputs + Real-Time Fee Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Calculator Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-slate-900 font-display flex items-center gap-2 pb-4 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Configure Student Category & College Fee Tier
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Admission Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Caste / Quota Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CandidateCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value="Open">Open / General (EBC 50% waiver if &lt; ₹8L)</option>
                <option value="OBC">OBC (50% Tuition + Exam Fee waiver)</option>
                <option value="SC">SC (100% Tuition Fee waiver + Allowance)</option>
                <option value="ST">ST (100% Tuition Fee waiver + Allowance)</option>
                <option value="EWS">EWS (50% Tuition Fee waiver)</option>
                <option value="TFWS">TFWS (100% Tuition Fee waiver)</option>
                <option value="VJNT">VJNT / NT (50% Tuition + Exam Fee waiver)</option>
                <option value="SBC">SBC (50% Tuition + Exam Fee waiver)</option>
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Annual Family Income
              </label>
              <select
                value={familyIncome}
                onChange={(e) => setFamilyIncome(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value={1.5}>Below ₹2.5 Lakhs (Highest Subsidy + Maintenance)</option>
                <option value={5.0}>₹2.5 Lakhs to ₹8.0 Lakhs (EBC & OBC Eligible)</option>
                <option value={10.0}>Above ₹8.0 Lakhs (No MahaDBT Subsidy)</option>
              </select>
            </div>

            {/* Base Annual Tuition Fee */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Annual College Tuition Fee (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={baseTuitionFee}
                  onChange={(e) => setBaseTuitionFee(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Typical: ₹90,000 (Govt) to ₹1,40,000 (Pvt)</p>
            </div>

            {/* Development Fee */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Annual Development Fee (₹)
              </label>
              <input
                type="number"
                value={developmentFee}
                onChange={(e) => setDevelopmentFee(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">Fixed FRA charge (not waived in TFWS)</p>
            </div>

          </div>

          {/* Additional Checkbox Options */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label htmlFor="hostelToggle" className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  id="hostelToggle"
                  checked={includeHostel}
                  onChange={(e) => setIncludeHostel(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Include Campus Hostel & Mess (₹{hostelAndMessFee.toLocaleString()}/yr)</span>
              </label>
              <span className="font-bold text-slate-700">Optional</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label htmlFor="pragatiToggle" className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  id="pragatiToggle"
                  checked={isFemaleStudent}
                  onChange={(e) => setIsFemaleStudent(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Candidate is a meritorious girl student (AICTE Pragati: +₹50,000 cash grant)</span>
              </label>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                +₹50k Aid
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label htmlFor="farmerToggle" className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  id="farmerToggle"
                  checked={isFarmerChild}
                  onChange={(e) => setIsFarmerChild(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Child of registered farmer / rural laborer (Dr. Panjabrao Deshmukh: +₹30,000 hostel aid)</span>
              </label>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                +₹30k Aid
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() =>
                onAskCopilot(
                  `I am eligible for ${schemeName}. When and how do I apply on the MahaDBT portal, and what documents are required for ${selectedCategory} category fee waiver?`
                )
              }
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask AI Copilot How to Apply on MahaDBT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Net Fee Breakdown & 4-Year Parent Planner */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Net Annual Financial Summary
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {tuitionWaiverPercent}% Tuition Waiver
              </span>
            </div>

            {/* Scheme Applied Pill */}
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-0.5">Applied Scheme:</span>
              <span className="font-bold text-white text-sm">{schemeName}</span>
            </div>

            {/* Fee Calculation Itemized Rows */}
            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Standard Tuition Fee:</span>
                <span className="line-through text-slate-500">₹{baseTuitionFee.toLocaleString()}</span>
              </div>

              {waivedTuitionAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Govt Tuition Waiver:
                  </span>
                  <span>- ₹{waivedTuitionAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Net Tuition Payable:</span>
                <span className="font-bold text-white">₹{netTuitionPayable.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Development & Gymkhana Fee:</span>
                <span>₹{(developmentFee + examAndGymkhanaFee).toLocaleString()}</span>
              </div>

              {includeHostel && (
                <div className="flex justify-between text-slate-300">
                  <span>Hostel & Mess (Annual):</span>
                  <span>₹{hostelAndMessFee.toLocaleString()}</span>
                </div>
              )}

              {cashStipendYearly > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Direct Cash Scholarship Grants:</span>
                  <span>- ₹{cashStipendYearly.toLocaleString()}</span>
                </div>
              )}

              {/* Total Annual Net Payable */}
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-200">Total Net Outflow (1st Year):</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-display">
                  ₹{Math.max(0, totalAnnualCost).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 4-Year Cost Projection */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  4-Year Total Degree Cost
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  ₹{totalFourYearCost.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Per-Semester Installment
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  ₹{semesterFee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-400 space-y-1">
            <p>• Government waivers are disbursed directly to college bank accounts through MahaDBT.</p>
            <p>• Zero interest education loan assistance is available under the Credit Guarantee Fund.</p>
          </div>
        </div>

      </div>

      {/* Available Scholarship Catalog Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Official State & Central Scholarship Directory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCHOLARSHIPS_DATA.map((sch) => {
            const localizedName =
              language === 'mr' ? sch.marathiName : language === 'hi' ? sch.hindiName : sch.name;

            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {sch.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug mb-2">
                    {localizedName}
                  </h4>

                  <p className="text-xs text-slate-500 mb-2">
                    Provider: <strong>{sch.provider}</strong>
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {sch.eligibility}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Max Income: ₹{sch.incomeLimitLakhs} LPA
                  </span>
                  <a
                    href={sch.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
