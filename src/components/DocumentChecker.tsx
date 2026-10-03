import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ShieldAlert,
  Sparkles,
  Info,
  Check,
  FileCheck,
} from 'lucide-react';
import {
  DocumentItem,
  CandidateCategory,
  StudentProfile,
  AppLanguage,
  PersonaMode,
} from '../types/admission';
import { DOCUMENT_CATALOG, TRANSLATIONS } from '../data/admissionData';

interface DocumentCheckerProps {
  profile: StudentProfile;
  onAskCopilot: (query: string) => void;
  language: AppLanguage;
  mode: PersonaMode;
}

export const DocumentChecker: React.FC<DocumentCheckerProps> = ({
  profile,
  onAskCopilot,
  language,
  mode,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<CandidateCategory>(profile.category);
  const [hasGapYear, setHasGapYear] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(() => [...DOCUMENT_CATALOG]);

  // Filter documents relevant to the chosen category
  const relevantDocs = documents.filter((doc) => {
    if (doc.id === 'gap_certificate' && !hasGapYear) return false;
    return doc.categoryRelevance.includes(selectedCategory);
  });

  const verifiedCount = relevantDocs.filter((d) => d.status === 'verified').length;
  const inProgressCount = relevantDocs.filter((d) => d.status === 'in_progress').length;
  const pendingCount = relevantDocs.filter((d) => d.status === 'pending').length;
  const completionPercentage = Math.round((verifiedCount / (relevantDocs.length || 1)) * 100);

  const updateDocStatus = (id: string, status: 'verified' | 'in_progress' | 'pending') => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Personalized Admission Document Checker
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Never lose an admission seat due to missing paperwork. Check which documents are mandatory for your category and track their verification status.
          </p>
        </div>

        {/* Action: Print / PDF Checklist */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official FC Docket</span>
          </button>
        </div>
      </div>

      {/* Progress & Category Filter Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Meter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Document Readiness Score
              </span>
              <span className="text-base font-extrabold text-indigo-600">
                {completionPercentage}% Ready
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${
                  completionPercentage >= 80
                    ? 'bg-emerald-500'
                    : completionPercentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                <span className="block font-bold text-emerald-700 text-sm">{verifiedCount}</span>
                <span className="text-[11px] text-emerald-600">Ready</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                <span className="block font-bold text-amber-700 text-sm">{inProgressCount}</span>
                <span className="text-[11px] text-amber-600">In Process</span>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-2">
                <span className="block font-bold text-rose-700 text-sm">{pendingCount}</span>
                <span className="text-[11px] text-rose-600">Missing</span>
              </div>
            </div>
          </div>

          {completionPercentage < 100 && (
            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Bring 3 self-attested photocopies of all originals to the Facilitation Center (FC).</span>
            </p>
          )}
        </div>

        {/* Dynamic Category Switcher */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Select Candidate Category Quota
            </span>

            <div className="flex flex-wrap gap-2 mb-4">
              {(['Open', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'VJNT', 'SBC', 'Minority'] as CandidateCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Gap Year Checkbox */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <input
                type="checkbox"
                id="gapYearToggle"
                checked={hasGapYear}
                onChange={(e) => setHasGapYear(e.target.checked)}
                className="w-4 h-4 rounded-sm text-indigo-600 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="gapYearToggle" className="text-xs text-slate-700 font-medium cursor-pointer">
                Student took a 1+ year study break / preparation gap after 10th or 12th (Include Gap Affidavit)
              </label>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {relevantDocs.length} required documents for <strong>{selectedCategory} Quota</strong></span>
            <button
              type="button"
              onClick={() =>
                onAskCopilot(
                  `What are the emergency rules if my ${selectedCategory} caste validity or income certificate is delayed before CAP Round 1?`
                )
              }
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI About Missing Docs</span>
            </button>
          </div>
        </div>

      </div>

      {/* Document Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Mandatory Documents for {selectedCategory} Category
          </span>
          <span className="text-xs text-slate-500">
            Click status pill to mark your readiness
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {relevantDocs.map((doc) => {
            const localizedTitle =
              language === 'mr' && doc.marathiTitle
                ? doc.marathiTitle
                : language === 'hi' && doc.hindiTitle
                ? doc.hindiTitle
                : doc.title;

            return (
              <div
                key={doc.id}
                className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900">
                      {localizedTitle}
                    </h4>
                    {doc.isMandatory ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 uppercase">
                        Conditional
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>
                      Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                    </span>
                    {doc.validityNotice && (
                      <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        ⚠️ {doc.validityNotice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="shrink-0 flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => updateDocStatus(doc.id, 'verified')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      doc.status === 'verified'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDocStatus(doc.id, 'in_progress')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      doc.status === 'in_progress'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Process</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDocStatus(doc.id, 'pending')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      doc.status === 'pending'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Missing</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Document Help Card */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Facilitation Center (FC) Scrutiny Guidelines</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-amber-800 leading-relaxed">
          <li>
            <strong>Physical Scrutiny vs e-Scrutiny:</strong> Physical scrutiny is recommended if you have name variation affidavits or pending caste token receipts, as FC officers can verify original copies on the spot.
          </li>
          <li>
            <strong>Non-Creamy Layer (NCL) validity:</strong> For OBC/VJNT candidates, ensure your NCL mentions validity <em>“Valid up to 31/03/2027”</em>. Certificates issued with single financial year validity are often rejected.
          </li>
          <li>
            <strong>Missing Caste Validity:</strong> If not received yet, upload the online application receipt (acknowledged by Scrutiny Committee) and submit the Proforma H undertaking at your FC center.
          </li>
        </ul>
      </div>

    </div>
  );
};
