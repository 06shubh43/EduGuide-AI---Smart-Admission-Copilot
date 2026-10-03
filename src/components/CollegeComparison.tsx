import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Coins,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Bus,
  Utensils,
  Award,
} from 'lucide-react';
import { CollegeOption, PersonaMode, AppLanguage } from '../types/admission';
import { COLLEGES_DATA, TRANSLATIONS } from '../data/admissionData';

interface CollegeComparisonProps {
  onAskCopilot: (query: string) => void;
  mode: PersonaMode;
  language: AppLanguage;
}

export const CollegeComparison: React.FC<CollegeComparisonProps> = ({
  onAskCopilot,
  mode,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Selected colleges for comparison (default to COEP, VJTI, and PICT)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'coep_tech',
    'pict_pune',
    'vit_pune',
  ]);

  const toggleSelectCollege = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds((prev) => prev.filter((item) => item !== id));
      } else {
        alert('Please keep at least 2 colleges selected for comparison.');
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds((prev) => [...prev, id]);
      } else {
        // Replace last item
        setSelectedIds((prev) => [prev[0], prev[1], id]);
      }
    }
  };

  const comparedColleges = COLLEGES_DATA.filter((col) => selectedIds.includes(col.id));

  return (
    <div className="space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Side-by-Side College & Branch Comparator
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Compare cutoffs, return on investment (ROI), placement packages, hostel safety, and transport amenities across premier autonomous engineering colleges.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Comparing <strong>{selectedIds.length}</strong> of 3 max institutes
          </span>
        </div>
      </div>

      {/* College Selection Chips */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
          Select Colleges to Compare (Choose 2 or 3):
        </span>
        <div className="flex flex-wrap gap-2.5">
          {COLLEGES_DATA.map((col) => {
            const isSelected = selectedIds.includes(col.id);
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleSelectCollege(col.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{col.shortName}</span>
                <span className="opacity-75 text-[11px]">({col.city})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 sm:p-5 font-bold text-xs uppercase tracking-wider text-slate-500 w-1/4">
                  Feature / Metric
                </th>
                {comparedColleges.map((col) => (
                  <th key={col.id} className="p-4 sm:p-5 font-bold text-slate-900 w-1/4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-slate-900 block">
                          {col.shortName}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {col.type} • {col.city}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {col.naacGrade} NAAC
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              
              {/* Category 1: Academic & Cutoffs */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td colSpan={comparedColleges.length + 1} className="px-5 py-2.5">
                  Academic Cutoffs (General Merit Round 1)
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Computer Engineering Cutoff:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 font-extrabold text-indigo-600 text-sm">
                    {col.cutoffCSPercentile} %ile
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Electronics (E&TC) Cutoff:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 font-bold text-slate-800 text-sm">
                    {col.cutoffENTCPercentile} %ile
                  </td>
                ))}
              </tr>

              {/* Category 2: Placements & ROI */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td colSpan={comparedColleges.length + 1} className="px-5 py-2.5">
                  Placement Statistics & Return on Investment
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Average Package (CTC):
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 font-extrabold text-emerald-600 text-sm">
                    ₹{col.avgPlacementLPA} LPA
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Highest On-Campus Package:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 font-bold text-slate-800 text-sm">
                    ₹{col.highestPlacementLPA} LPA
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Marquee Recruiters:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 text-xs text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {col.topRecruiters.map((r, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category 3: Fees & Financials (Parent Focus) */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td colSpan={comparedColleges.length + 1} className="px-5 py-2.5">
                  Annual Fees & Living Expenses (Open Category)
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Annual Tuition & Dev Fee:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 font-bold text-slate-800 text-sm">
                    ₹{col.annualTuitionFee.toLocaleString()}/yr
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Campus Hostel Fee (Annual):
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 text-xs text-slate-700">
                    ₹{col.hostelFeeYearly.toLocaleString()}/yr
                  </td>
                ))}
              </tr>

              {/* Category 4: Campus Facilities & Safety */}
              <tr className="bg-slate-50/50 font-bold text-xs uppercase tracking-wider text-slate-500">
                <td colSpan={comparedColleges.length + 1} className="px-5 py-2.5">
                  Campus Facilities, Safety & Commute
                </td>
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Campus Safety Rating:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {col.safetyScore} / 10
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Dedicated College Bus:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 text-xs">
                    {col.busFacility ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <Bus className="w-3.5 h-3.5" />
                        Available
                      </span>
                    ) : (
                      <span className="text-slate-400">Public Metro / Bus</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Campus Area & Mess:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5 text-xs text-slate-600">
                    <div>{col.campusAreaAcres} Acres</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{col.messQuality}</div>
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-600 text-xs">
                  Strategic Advice:
                </td>
                {comparedColleges.map((col) => (
                  <td key={col.id} className="p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={() =>
                        onAskCopilot(
                          `In my CAP Round option form, should I place ${col.name} above or below other autonomous colleges? Compare cutoffs and placement return.`
                        )
                      }
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Prioritize in CAP</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
