import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ReallocationTransfer } from '../types';

interface ActiveTransfersFeedProps {
  transfers: ReallocationTransfer[];
  currentLang: string;
}

export const ActiveTransfersFeed: React.FC<ActiveTransfersFeedProps> = ({
  transfers,
  currentLang
}) => {
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Active Inter-District Reallocations &amp; Logistics Fleets
            </h2>
            <p className="text-xs text-slate-400">
              Coordinated via Google Maps Routes API &amp; District Medical Officer (DMO) Dispatches
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded">
          {transfers.filter(t => t.status === 'IN_TRANSIT').length} In Transit
        </span>
      </div>

      {/* Transfers List */}
      <div className="space-y-3">
        {transfers.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No active emergency transfers en route.
          </div>
        ) : (
          transfers.map((tx) => {
            const isNoticeOpen = selectedNoticeId === tx.transfer_id;
            const noticeText = 
              currentLang === 'hi' 
                ? tx.vernacular_dispatch_notice?.hi 
                : currentLang === 'bn' 
                ? tx.vernacular_dispatch_notice?.bn 
                : tx.vernacular_dispatch_notice?.en;

            return (
              <div
                key={tx.transfer_id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl p-4 space-y-3"
              >
                {/* Top Row: Items & Urgency */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {tx.items[0]?.name}
                        </span>
                        <span className="font-mono text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900">
                          {tx.items[0]?.quantity} Units
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Batch: {tx.items[0]?.batch_number} · Order: {tx.transfer_id}
                      </div>
                    </div>
                  </div>

                  {/* Status & Urgency */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        tx.urgency === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {tx.urgency}
                    </span>

                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      <Truck className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                      {tx.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Facilities Route Line */}
                <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tx.donor_facility_name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tx.recipient_facility_name}</span>
                  </div>
                </div>

                {/* Transit Metrics & Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Road Distance</span>
                    <span className="font-mono font-bold text-slate-200">
                      {tx.transit_metrics.distance_km} KM (SH-7 Corridor)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Estimated ETA</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tx.transit_metrics.estimated_duration_mins} Minutes
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block">Assigned Fleet</span>
                    <span className="font-mono font-bold text-slate-200">
                      {tx.transit_metrics.assigned_vehicle_reg} ({tx.transit_metrics.vehicle_type.replace('_', ' ')})
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Dispatched</span>
                    <span>Transit Progress: {tx.transit_metrics.progress_pct}%</span>
                    <span>Arrival</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${tx.transit_metrics.progress_pct}%` }}
                    />
                  </div>
                </div>

                {/* Vernacular Notice Toggle */}
                {noticeText && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => setSelectedNoticeId(isNoticeOpen ? null : tx.transfer_id)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{isNoticeOpen ? 'Hide Dispatch Notice' : 'View Vernacular Dispatch Notice'}</span>
                    </button>

                    {isNoticeOpen && (
                      <div className="mt-2 p-2.5 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300 font-serif leading-relaxed">
                        {noticeText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
