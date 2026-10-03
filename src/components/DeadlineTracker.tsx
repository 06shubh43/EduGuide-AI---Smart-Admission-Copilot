import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Bell,
  CheckCircle2,
  Hourglass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TimelineMilestone, AppLanguage, PersonaMode } from '../types/admission';
import { ADMISSION_MILESTONES, TRANSLATIONS } from '../data/admissionData';

interface DeadlineTrackerProps {
  onAskCopilot: (query: string) => void;
  language: AppLanguage;
  mode: PersonaMode;
}

export const DeadlineTracker: React.FC<DeadlineTrackerProps> = ({
  onAskCopilot,
  language,
  mode,
}) => {
  const t = TRANSLATIONS[language];
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(ADMISSION_MILESTONES);
  const [alertSimulated, setAlertSimulated] = useState(false);

  // Find the next upcoming or ongoing milestone for the countdown timer
  const activeMilestone =
    milestones.find((m) => m.status === 'ongoing') ||
    milestones.find((m) => m.status === 'upcoming') ||
    milestones[0];

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Download .ics calendar file
  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EduGuide AI//Admission Tracker//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:CAP Round Option Form Filling Deadline
DESCRIPTION:Final deadline to fill and lock college option choices in CAP Round 1.
DTSTART:20260720T090000Z
DTEND:20260723T235959Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CAP_Admission_Deadlines_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateNotification = () => {
    setAlertSimulated(true);
    setTimeout(() => setAlertSimulated(false), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Admission Deadline & CAP Schedule Tracker
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Strict deadlines govern Maharashtra State CET Cell CAP rounds. Track critical registration, scrutiny, grievance, and option-filling cutoffs.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Sync to Calendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* Countdown Timer Widget for Active Deadline */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-indigo-900/60 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Active Urgent Milestone
              </span>
              <span className="text-xs text-slate-400">Strict Official Cutoff</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeMilestone.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {activeMilestone.description}
            </p>

            {activeMilestone.urgentNotice && (
              <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{activeMilestone.urgentNotice}</span>
              </p>
            )}
          </div>

          {/* Countdown Blocks */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 min-w-16">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Days
              </span>
            </div>

            <span className="text-xl font-bold text-slate-400">:</span>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 min-w-16">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Hours
              </span>
            </div>

            <span className="text-xl font-bold text-slate-400">:</span>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 min-w-16">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Mins
              </span>
            </div>

            <span className="text-xl font-bold text-slate-400">:</span>

            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 min-w-16">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Secs
              </span>
            </div>
          </div>
        </div>

        {/* Reminder notification simulation */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Never miss an allotment result or verification window.
          </span>
          <button
            type="button"
            onClick={handleSimulateNotification}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Simulate SMS / WhatsApp Reminder</span>
          </button>
        </div>

        {alertSimulated && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Reminder alert simulated: "Alert: Only 48 hours left to confirm document verification at FC center!"</span>
          </div>
        )}
      </div>

      {/* Timeline Steps List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
            Complete CAP 2026 Milestone Roadmap
          </span>
          <span className="text-xs text-slate-500">
            Chronological Order
          </span>
        </div>

        <div className="p-6">
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-8">
            {milestones.map((m, idx) => {
              const localizedTitle =
                language === 'mr' ? m.marathiTitle : language === 'hi' ? m.hindiTitle : m.title;

              return (
                <div key={m.id} className="relative pl-6 sm:pl-8 group">
                  {/* Status Node Dot */}
                  <div
                    className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                      m.status === 'completed'
                        ? 'border-emerald-600 text-emerald-600'
                        : m.status === 'ongoing'
                        ? 'border-rose-600 text-rose-600 animate-pulse'
                        : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        m.status === 'completed'
                          ? 'bg-emerald-600'
                          : m.status === 'ongoing'
                          ? 'bg-rose-600'
                          : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {localizedTitle}
                      </h4>
                      {m.status === 'completed' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      )}
                      {m.status === 'ongoing' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                          Live Now
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 shrink-0">
                      {m.dateStr}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {m.description}
                  </p>

                  {m.urgentNotice && (
                    <p className="text-xs text-amber-700 font-semibold mt-1">
                      ⚠️ {m.urgentNotice}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
