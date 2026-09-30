import React from 'react';
import { 
  Activity, 
  Languages, 
  Scan, 
  Mic, 
  Zap, 
  Flame, 
  RefreshCw,
  ShieldCheck,
  Building2,
  Clock,
  FileDown
} from 'lucide-react';

interface HeaderProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onOpenScanner: () => void;
  onOpenVoice: () => void;
  onOpenSimulator: () => void;
  onRunReallocation: () => void;
  onOpenDownloadReport: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  activeOutbreakCount: number;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenScanner,
  onOpenVoice,
  onOpenSimulator,
  onRunReallocation,
  onOpenDownloadReport,
  onRefreshData,
  isRefreshing,
  activeOutbreakCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
      {/* Top Emergency Advisory Bar */}
      <div className="bg-amber-950/80 border-b border-amber-800/60 px-4 py-1.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold tracking-wide uppercase text-[11px] text-amber-300">
            NHM Public Health Sentinel
          </span>
          <span className="hidden sm:inline text-amber-400/80">·</span>
          <span className="text-amber-200/90 text-[11px]">
            Purba Bardhaman District Command Center · Active Sentinel Monitoring for Snakebite & Enteric Surges
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-amber-300/80 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            IST (UTC+05:30)
          </span>
          <span>HMIS-WB-PUR-SYNC: LIVE</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Branding & Entity Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                National Health Resource &amp; Supply Chain Platform
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                PHC / CHC Mesh
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ministry of Health &amp; Family Welfare · Autonomous Stockout Defense &amp; Federated Redistribution
            </p>
          </div>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-lg p-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <div className="flex gap-0.5">
              {LANGUAGES.slice(0, 3).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    currentLang === lang.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Multimodal Digitizer */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Scan handwritten Form 35 stock register or pharmacy receipt"
          >
            <Scan className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan Ledger (OCR)</span>
          </button>

          {/* Regional Voice Intake */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Grassroots voice inventory reporting in Bengali/Hindi"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice Intake</span>
          </button>

          {/* Outbreak Simulator */}
          <button
            onClick={onOpenSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeOutbreakCount > 0
                ? 'bg-amber-950/60 border-amber-700 text-amber-300 hover:bg-amber-900/60'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Simulate seasonal epidemic surges (Snakebite, Diarrhea, Dengue)"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Epidemic Simulator ({activeOutbreakCount})</span>
          </button>

          {/* Download Report Button */}
          <button
            onClick={onOpenDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Generate printable facility stockout & logistics PDF report via jsPDF"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Report</span>
          </button>

          {/* Autonomous Reallocation Engine CTA */}
          <button
            onClick={onRunReallocation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors cursor-pointer"
            title="Trigger Gemini Autonomous Reallocation Agent"
          >
            <Zap className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Auto-Reallocate</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Refresh Central Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
