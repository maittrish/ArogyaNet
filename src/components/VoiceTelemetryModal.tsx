import React, { useState } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  Languages, 
  ArrowRight, 
  CheckCircle, 
  Database, 
  X, 
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_VOICE_PROMPTS } from '../data/mockHmisData';
import { VoiceTelemetryResult } from '../types';

interface VoiceTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceTelemetry: (result: VoiceTelemetryResult) => void;
}

export const VoiceTelemetryModal: React.FC<VoiceTelemetryModalProps> = ({
  isOpen,
  onClose,
  onApplyVoiceTelemetry
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_VOICE_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<VoiceTelemetryResult | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleProcessVoice = async (promptData = selectedPrompt) => {
    setIsProcessing(true);
    setResult(null);
    setApplied(false);

    try {
      const response = await fetch('/api/voice-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: promptData.facilityId,
          transcript: promptData.transcript,
          languageCode: promptData.language
        })
      });

      if (!response.ok) {
        throw new Error('Voice telemetry error');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Voice error:', err);
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const handleSimulateRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      handleProcessVoice(selectedPrompt);
    }, 1800);
  };

  const handleApply = () => {
    if (!result) return;
    onApplyVoiceTelemetry(result);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Regional Voice Inventory Telemetry
                </h2>
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
                  Cloud Speech &amp; Translation API
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hands-free oral status reporting for ANMs, ASHA workers, and rural pharmacists in native Indian languages.
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
          {/* Preset Dialects Selector */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Select Field Voice Dialect Preset:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_VOICE_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPrompt.id === prompt.id
                      ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-indigo-400">
                    {prompt.languageLabel}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {prompt.speakerRole}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Waveform Recording Stage */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5 h-10">
              {/* Dynamic waveform simulation */}
              {[40, 70, 25, 90, 60, 85, 30, 95, 50, 80, 45, 65, 35].map((h, i) => (
                <span
                  key={i}
                  style={{ height: isRecording ? `${h}%` : '20%' }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="text-xs font-medium text-slate-300">
              {isRecording ? (
                <span className="text-rose-400 animate-pulse font-semibold">
                  ● Capturing 16kHz audio stream in {selectedPrompt.languageLabel}...
                </span>
              ) : isProcessing ? (
                <span className="text-indigo-400 font-semibold">
                  Synthesizing Speech-to-Text &amp; Translation via Gemini 3.8 Flash...
                </span>
              ) : (
                <span>Ready to capture grassroots voice status</span>
              )}
            </div>

            <button
              onClick={handleSimulateRecord}
              disabled={isRecording || isProcessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
              } disabled:opacity-50`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Listening...' : 'Simulate Voice Input'}</span>
            </button>
          </div>

          {/* Vernacular Audio Transcript Preview */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              Grassroots Verbal Input ({selectedPrompt.languageLabel})
            </div>
            <p className="text-xs text-slate-200 italic font-serif">
              &ldquo;{selectedPrompt.transcript}&rdquo;
            </p>
          </div>

          {/* Processed Structured Result */}
          {result && (
            <div className="space-y-3 animate-in fade-in">
              {/* Canonical Translation */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-900/60 rounded-xl">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  Canonical English Translation
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {result.translated_english}
                </p>
              </div>

              {/* Extracted Structured Records */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Extracted Telemetry Deltas (NLEM Verified)
                </div>
                <div className="p-3 space-y-2">
                  {result.parsed_telemetry.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          {item.item_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.notes}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-500 block">Reported Qty</span>
                          <span className="font-mono font-bold text-slate-200 text-sm">
                            {item.quantity_reported} {item.unit}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded border ${
                            item.condition === 'CRITICALLY_LOW'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {applied ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Telemetry Applied to Facility Record!
              </span>
            ) : (
              <span>Converts spoken language directly into typed Firestore inventory state.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>

            {result && !applied && (
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-lg"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Apply to Central Health Records</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
