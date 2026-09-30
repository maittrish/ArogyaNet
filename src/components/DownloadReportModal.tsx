import React, { useState } from 'react';
import { 
  FileDown, 
  FileText, 
  Building2, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  X,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { Facility, InventoryItem, ReallocationTransfer } from '../types';
import { generateFacilityPdfReport } from '../utils/generateFacilityReport';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: Facility[];
  inventory: InventoryItem[];
  transfers: ReallocationTransfer[];
  defaultFacilityId?: string | null;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
  facilities,
  inventory,
  transfers,
  defaultFacilityId
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    defaultFacilityId || facilities[0]?.facility_id || 'PHC_WB_PUR_014'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentFacility = facilities.find(f => f.facility_id === selectedFacilityId) || facilities[0];
  const facilityInventory = inventory.filter(i => i.facility_id === currentFacility.facility_id);
  const criticalDeficits = facilityInventory.filter(i => i.buffer_days < 7.0);
  const facilityTransfers = transfers.filter(
    tx => tx.recipient_facility_id === currentFacility.facility_id || tx.donor_facility_id === currentFacility.facility_id
  );

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      generateFacilityPdfReport({
        facility: currentFacility,
        inventory,
        transfers,
        generatedBy: 'CMOH District Emergency Cell'
      });
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Download Printable Facility Audit
                </h2>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
                  jsPDF Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generates official PDF document summarizing current stockout alerts, burn rates, and active logistics transfers.
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          {/* Facility Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Select Target Health Facility:
            </label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {facilities.map((fac) => (
                <option key={fac.facility_id} value={fac.facility_id}>
                  {fac.name} ({fac.facility_type} · {fac.block})
                </option>
              ))}
            </select>
          </div>

          {/* Audit Scope Preview Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="font-bold text-white text-sm">
                {currentFacility.name}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
                {currentFacility.facility_type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Stockout Alerts
                </span>
                <span className="text-base font-bold text-rose-400 font-mono mt-0.5 block">
                  {criticalDeficits.length} Critical Items
                </span>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-400" />
                  Active Transfers
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                  {facilityTransfers.length} En Route
                </span>
              </div>
            </div>

            {/* Included in PDF Preview */}
            <div className="space-y-1 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NLEM inventory balances, daily consumption rates &amp; buffer days.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Inter-facility road distances, transit ETAs &amp; vehicle registrations.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Official DMO / CMOH digital verification seal &amp; compliance note.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {downloadSuccess && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> PDF Report downloaded!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-lg disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download Report (PDF)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
