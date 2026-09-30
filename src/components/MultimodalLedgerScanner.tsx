import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Check, 
  FileSpreadsheet, 
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { SAMPLE_LEDGER_PRESETS } from '../data/mockHmisData';
import { LedgerScanResult, LedgerEntryParsed } from '../types';

interface MultimodalLedgerScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitInventory: (facilityId: string, items: LedgerEntryParsed[]) => void;
}

export const MultimodalLedgerScanner: React.FC<MultimodalLedgerScannerProps> = ({
  isOpen,
  onClose,
  onCommitInventory
}) => {
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_LEDGER_PRESETS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<LedgerScanResult | null>(null);
  const [committed, setCommitted] = useState(false);

  if (!isOpen) return null;

  const handleRunScan = async (preset = selectedPreset) => {
    setIsScanning(true);
    setScanResult(null);
    setCommitted(false);

    try {
      const response = await fetch('/api/multimodal-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: 'PHC_WB_PUR_014',
          simulatedText: preset.simulatedText,
          imageBase64: uploadedImage || ''
        })
      });

      if (!response.ok) {
        throw new Error('Server scan error');
      }

      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommit = () => {
    if (!scanResult) return;
    onCommitInventory('PHC_WB_PUR_014', scanResult.entries);
    setCommitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Multimodal Pharmacy Ledger Digitization
                </h2>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                  Gemini 3.8 Flash OCR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Frontline OCR for handwritten registers, Form 35 ledgers, and cold-chain receipts with automatic arithmetic balance validation.
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
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Preset Selector & Upload Bar */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Select Sample Register Document or Upload Photo:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_LEDGER_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id && !uploadedImage;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setUploadedImage(null);
                      setScanResult(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400 mb-1">
                      {preset.thumbnailLabel}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {preset.facility}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Photo Upload */}
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload Physical Document Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedImage && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Photo attached
                </span>
              )}

              <button
                onClick={() => handleRunScan()}
                disabled={isScanning}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Structured Table...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-3.5 h-3.5" />
                    <span>Run Multimodal Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Document Preview Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden">
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center space-y-2">
                <div className="w-full h-1 bg-emerald-500 animate-[bounce_1.5s_infinite]" />
                <span className="text-xs font-semibold text-emerald-300 font-mono">
                  [GEMINI_VISION_OCR]: Rectifying optical character ambiguity &amp; balancing arithmetic...
                </span>
              </div>
            )}

            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span>DOCUMENT SOURCE: {uploadedImage ? 'Custom Photo' : selectedPreset.title}</span>
              <span>FORMAT: FORM 35 / REGISTER</span>
            </div>

            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {uploadedImage ? (
                <div className="flex items-center gap-3">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Ledger"
                    className="max-h-32 rounded border border-slate-700 object-contain"
                  />
                  <div className="text-xs text-slate-400">
                    Uploaded image ready for Gemini 3.8 Flash multimodal recognition.
                  </div>
                </div>
              ) : (
                selectedPreset.simulatedText
              )}
            </div>
          </div>

          {/* Parsed Results Table */}
          {scanResult && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-white">
                    {scanResult.facility_name_detected}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Date Identified: {scanResult.ledger_date} · Reference: {scanResult.page_number}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {scanResult.validation_summary.arithmetic_passed}/{scanResult.validation_summary.total_entries} Rows Arithmetic Verified
                  </span>
                  <span className="text-slate-400">
                    {scanResult.processing_ms}ms
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Medicine / Item</th>
                      <th className="p-3">Batch &amp; Expiry</th>
                      <th className="p-3 text-right">Opening</th>
                      <th className="p-3 text-right">Recd (+)</th>
                      <th className="p-3 text-right">Disp (-)</th>
                      <th className="p-3 text-right">Closing Balance</th>
                      <th className="p-3 text-center">Confidence</th>
                      <th className="p-3 text-center">Arithmetic Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {scanResult.entries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 font-medium text-slate-200">
                          {entry.drug_name}
                          <span className="text-[10px] text-slate-500 block">{entry.unit}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {entry.batch_number || 'N/A'}
                          <span className="text-[10px] text-slate-500 block">Exp: {entry.expiry_date || 'N/A'}</span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400">{entry.opening_balance ?? '-'}</td>
                        <td className="p-3 text-right font-mono text-emerald-400">+{entry.quantity_received ?? 0}</td>
                        <td className="p-3 text-right font-mono text-rose-400">-{entry.quantity_dispensed ?? 0}</td>
                        <td className="p-3 text-right font-mono font-bold text-white text-sm">
                          {entry.closing_balance}
                        </td>
                        <td className="p-3 text-center font-mono">
                          <span className="text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-emerald-400">
                            {Math.round(entry.confidence_score * 100)}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {entry.arithmetic_valid ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                              ⚠ Discrepancy
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {committed ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Live Central Inventory Updated Successfully!
              </span>
            ) : (
              <span>Verified data will directly update Firestore telemetry &amp; Early Warning system.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            {scanResult && !committed && (
              <button
                onClick={handleCommit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-lg"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Commit to Live Inventory</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
