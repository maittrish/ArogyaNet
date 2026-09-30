import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  X, 
  Check, 
  TrendingUp, 
  Zap,
  Info,
  Calendar,
  CloudRain
} from 'lucide-react';
import { OutbreakProfile } from '../types';

interface OutbreakSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  outbreaks: OutbreakProfile[];
  onToggleOutbreak: (outbreakId: string) => void;
}

export const OutbreakSimulator: React.FC<OutbreakSimulatorProps> = ({
  isOpen,
  onClose,
  outbreaks,
  onToggleOutbreak
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Seasonal Epidemic &amp; Footfall Surge Simulator
                </h2>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                  Epidemiological Stress-Test
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate monsoonal surges and disease vectors to test Early Warning and Autonomous Reallocation responsiveness.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="p-3 bg-amber-950/30 border border-amber-900/60 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Toggling an outbreak immediately recalculates daily burn rates across all block PHCs and CHCs based on historical HMIS disease incidence multipliers.
            </span>
          </div>

          <div className="space-y-3">
            {outbreaks.map((outbreak) => (
              <div
                key={outbreak.id}
                className={`p-4 rounded-xl border transition-all ${
                  outbreak.active
                    ? 'bg-amber-950/30 border-amber-600/80 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">
                        {outbreak.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          outbreak.active
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {outbreak.active ? 'ACTIVE SURGE' : 'DORMANT'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Vector: <strong>{outbreak.disease_vector}</strong></span>
                      <span>Season: {outbreak.season}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleOutbreak(outbreak.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      outbreak.active
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {outbreak.active ? 'Deactivate Surge' : 'Activate Surge'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {outbreak.description}
                </p>

                {/* Multiplier & Impacted Supplies */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Burn Rate Surge: <strong>{outbreak.surge_multiplier}x Normal</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Impacted: {outbreak.impacted_drugs.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
