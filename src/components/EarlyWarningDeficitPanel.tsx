import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  PackageX,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { InventoryItem, Facility } from '../types';

interface EarlyWarningDeficitPanelProps {
  inventory: InventoryItem[];
  facilities: Facility[];
  onTriggerReallocation: (facilityId: string, itemName: string) => void;
  activeOutbreakTitle?: string;
}

export const EarlyWarningDeficitPanel: React.FC<EarlyWarningDeficitPanelProps> = ({
  inventory,
  facilities,
  onTriggerReallocation,
  activeOutbreakTitle
}) => {
  // Filter inventory items with buffer < 7 days
  const criticalItems = inventory
    .filter(item => item.buffer_days < 7.0)
    .sort((a, b) => a.buffer_days - b.buffer_days);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-rose-950/80 border border-rose-800 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Early Warning Sentinel · 7 to 14-Day Stockout Risk
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic forecast tracking rolling consumption, seasonal epidemiology, and footfall surges.
          </p>
        </div>

        {activeOutbreakTitle && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-md">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {activeOutbreakTitle}
          </span>
        )}
      </div>

      {/* Critical Items Cards */}
      <div className="space-y-3">
        {criticalItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-950/50 rounded-lg border border-slate-800 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            All facilities in Purba Bardhaman district have &ge; 7 days of verified clinical stock.
          </div>
        ) : (
          criticalItems.map((item) => {
            const fac = facilities.find(f => f.facility_id === item.facility_id);
            const hoursLeft = Math.round(item.buffer_days * 24);
            const isEmergency = item.buffer_days <= 2.0;

            return (
              <div
                key={item.item_id}
                className={`relative rounded-xl p-4 transition-all border ${
                  isEmergency
                    ? 'bg-rose-950/30 border-rose-900/60 hover:border-rose-700'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left urgency stripe */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${
                    isEmergency ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">
                        {item.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isEmergency
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {isEmergency ? 'CRITICAL DEFICIT' : 'REORDER LEVEL'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {fac?.name || item.facility_id} · Batch: <span className="font-mono text-slate-300">{item.batch_number}</span>
                    </p>
                  </div>

                  {/* Stockout countdown badge */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{hoursLeft} Hours Remaining</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Depletion: in {item.buffer_days.toFixed(1)} days
                    </span>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center text-xs">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                      Physical Stock
                    </span>
                    <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                      {item.current_quantity} <span className="text-xs font-normal text-slate-400">{item.unit_of_measure}s</span>
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                      Daily Consumption
                    </span>
                    <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                      {item.daily_burn_rate_avg} / day
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                      Safety Reserve
                    </span>
                    <span className="text-sm font-bold text-rose-400 font-mono mt-0.5 block">
                      {item.buffer_days} Days
                    </span>
                  </div>
                </div>

                {/* One-Click Autonomous Reallocation Action */}
                <div className="mt-3 flex items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-slate-400 italic">
                    {isEmergency
                      ? '⚡ Protocol: Requires federated cross-facility stock transfer within 24h.'
                      : 'Standard central warehouse reorder queued.'}
                  </span>

                  <button
                    onClick={() => onTriggerReallocation(item.facility_id, item.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <Zap className="w-3 h-3 text-white" />
                    <span>Auto-Reallocate Stock</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
