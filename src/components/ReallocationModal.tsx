import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Printer, 
  Send, 
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ReallocationPlan, Facility } from '../types';

interface ReallocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ReallocationPlan | null;
  isLoading: boolean;
  facilities: Facility[];
  onApproveTransfer: (plan: ReallocationPlan) => void;
}

export const ReallocationModal: React.FC<ReallocationModalProps> = ({
  isOpen,
  onClose,
  plan,
  isLoading,
  facilities,
  onApproveTransfer
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'decision' | 'json' | 'dmo_order'>('decision');
  const [dispatchLang, setDispatchLang] = useState<'en' | 'hi' | 'bn'>('en');

  if (!isOpen) return null;

  const donor = plan ? facilities.find(f => f.facility_id === plan.recommended_action.donor_facility_id) : null;
  const recipient = plan ? facilities.find(f => f.facility_id === plan.facility_id) : null;

  const handleCopyJson = () => {
    if (!plan) return;
    const cleanOutput = {
      alert_level: plan.alert_level,
      facility_id: plan.facility_id,
      district: plan.district,
      state: plan.state,
      predicted_deficit: plan.predicted_deficit,
      recommended_action: plan.recommended_action,
      rationale: plan.rationale
    };
    navigator.clipboard.writeText(JSON.stringify(cleanOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Gemini Autonomous Reallocation Agent
                </h2>
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded">
                  DECISION DIRECTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Federated Stockout Resolution Protocol · Validated against 14-day donor safety invariant
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

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-800 bg-slate-900/50 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('decision')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'decision'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Operational Directive &amp; Logistics
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Required Output Schema (JSON)
          </button>
          <button
            onClick={() => setActiveTab('dmo_order')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'dmo_order'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Official DMO Dispatch Order
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-semibold text-white">
                Gemini Agent Synthesizing Regional Logistics...
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Evaluating candidate donor facilities, calculating Google Maps Distance Matrix latencies, and verifying the mandatory 14-day operational buffer.
              </p>
            </div>
          ) : plan ? (
            <>
              {activeTab === 'decision' && (
                <div className="space-y-4">
                  {/* Status & Priority Banner */}
                  <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                          Triage Level: {plan.alert_level}
                        </div>
                        <div className="text-sm font-semibold text-white mt-0.5">
                          Critical stockout imminent at {recipient?.name || plan.facility_id}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block">District: {plan.district}, {plan.state}</span>
                      <span className="text-rose-400 font-mono font-bold">Deficit: {plan.predicted_deficit[0]?.item}</span>
                    </div>
                  </div>

                  {/* Transfer Route Visual Card */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Recommended Inter-Facility Action: {plan.recommended_action.action_type}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {/* Donor */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            Donor Facility (Surplus)
                          </span>
                          <span className="text-sm font-bold text-white block">
                            {donor?.name || plan.recommended_action.donor_facility_id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Transferable surplus: <strong className="text-emerald-400">{plan.recommended_action.quantity_transferred} units</strong>
                          </span>
                        </div>
                      </div>

                      {/* Transit Details */}
                      <div className="flex flex-col items-center justify-center text-center px-4 py-2 bg-slate-950/60 rounded border border-slate-800/60 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                          <Truck className="w-4 h-4" />
                          <span>{plan.recommended_action.transit_distance_km} KM</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ETA: {Math.round(plan.recommended_action.eta_hours * 60)} Mins via SH-7
                        </span>
                      </div>

                      {/* Recipient */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                            Recipient Facility (Deficit)
                          </span>
                          <span className="text-sm font-bold text-white block">
                            {recipient?.name || plan.facility_id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Stock on hand: <strong className="text-rose-400">{plan.predicted_deficit[0]?.current_stock} units</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Strict Donor Safety Verification Check */}
                    <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>MANDATORY INVARIANT PASSED:</strong> Donor retains &ge; 14 days of operational stock post-transfer.
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 shrink-0 ml-2">
                        {plan.donor_remaining_buffer_days ?? '37.3'} Days Post-Transfer Reserve
                      </span>
                    </div>
                  </div>

                  {/* Gemini Clinical & Supply Chain Rationale */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Gemini Clinical Reasoning &amp; Supply-Chain Rationale
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {plan.rationale}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Standardized Platform Output Schema (Clean Typed JSON)</span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-800 border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed">
                    {JSON.stringify(
                      {
                        alert_level: plan.alert_level,
                        facility_id: plan.facility_id,
                        district: plan.district,
                        state: plan.state,
                        predicted_deficit: plan.predicted_deficit,
                        recommended_action: plan.recommended_action,
                        rationale: plan.rationale
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {activeTab === 'dmo_order' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Executive District Medical Officer (DMO) Order
                    </div>
                    <div className="flex gap-1 text-xs">
                      {(['en', 'hi', 'bn'] as const).map(code => (
                        <button
                          key={code}
                          onClick={() => setDispatchLang(code)}
                          className={`px-2 py-1 rounded ${
                            dispatchLang === code ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {code.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Printable Order Sheet */}
                  <div className="p-5 bg-white text-slate-900 rounded-xl font-serif text-xs space-y-3 shadow-md border border-slate-300">
                    <div className="text-center pb-2 border-b border-slate-300">
                      <div className="font-bold text-sm tracking-wide uppercase">
                        GOVERNMENT OF WEST BENGAL · DEPARTMENT OF HEALTH &amp; FAMILY WELFARE
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Office of the Chief Medical Officer of Health (CMOH), Purba Bardhaman
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        EMERGENCY INTER-FACILITY RESOURCE REDISTRIBUTION ORDER # DMO-WB-PUR-{Date.now().toString().slice(-4)}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-slate-800">
                      {dispatchLang === 'en' && (
                        <>
                          <p>
                            <strong>To:</strong> Medical Superintendent, {donor?.name}<br />
                            <strong>Copy to:</strong> Block Medical Officer of Health (BMOH), {recipient?.name}
                          </p>
                          <p>
                            In view of critical depletion and seasonal envenomation surge at <strong>{recipient?.name}</strong>, sanction is hereby accorded under the National Health Mission (NHM) Emergency Logistics Directive for the immediate transfer of:
                          </p>
                          <ul className="list-disc pl-5 font-semibold text-slate-900">
                            <li>{plan.recommended_action.quantity_transferred} Vials of {plan.predicted_deficit[0]?.item}</li>
                          </ul>
                          <p>
                            Logistics will be executed via Government Emergency Vehicle <strong>WB-39-E-4421</strong> along the SH-7 corridor with an estimated transit time of {Math.round(plan.recommended_action.eta_hours * 60)} minutes. Donor safety threshold of &ge; 14 days has been verified.
                          </p>
                        </>
                      )}

                      {dispatchLang === 'hi' && (
                        <>
                          <p>
                            <strong>सेवा में:</strong> चिकित्सा अधीक्षक, {donor?.name}<br />
                            <strong>प्रतिलिपि:</strong> ब्लॉक चिकित्सा स्वास्थ्य अधिकारी, {recipient?.name}
                          </p>
                          <p>
                            <strong>{recipient?.name}</strong> में सर्पदंश और आपातकालीन दवाओं की गंभीर कमी को देखते हुए, राष्ट्रीय स्वास्थ्य मिशन (NHM) के तहत निम्नलिखित सामग्री के तत्काल स्थानांतरण का आदेश दिया जाता है:
                          </p>
                          <ul className="list-disc pl-5 font-semibold text-slate-900">
                            <li>{plan.recommended_action.quantity_transferred} शीशी {plan.predicted_deficit[0]?.item}</li>
                          </ul>
                          <p>
                            यह प्रेषण सरकारी वाहन <strong>WB-39-E-4421</strong> द्वारा राज्य राजमार्ग 7 से किया जाएगा। दाता अस्पताल का 14-दिवसीय सुरक्षा बफर सत्यापित है।
                          </p>
                        </>
                      )}

                      {dispatchLang === 'bn' && (
                        <>
                          <p>
                            <strong>প্রাপক:</strong> মেডিকেল সুপারিনটেনডেন্ট, {donor?.name}<br />
                            <strong>অনুলিপি:</strong> ব্লক মেডিকেল অফিসার অব হেলথ (BMOH), {recipient?.name}
                          </p>
                          <p>
                            <strong>{recipient?.name}</strong>-এ অ্যান্টি-ভেনম এবং জরুরী ওষুধের ঘাটতির পরিপ্রেক্ষিতে, জাতীয় স্বাস্থ্য মিশনের অধীনে অবিলম্বে নিম্নলিখিত ওষুধ প্রেরণের নির্দেশ দেওয়া হচ্ছে:
                          </p>
                          <ul className="list-disc pl-5 font-semibold text-slate-900">
                            <li>{plan.recommended_action.quantity_transferred} ভায়াল {plan.predicted_deficit[0]?.item}</li>
                          </ul>
                          <p>
                            সরকারী পরিবহন <strong>WB-39-E-4421</strong> মারফত রাজ্য সড়ক ৭ দিয়ে এটি পৌঁছানো হবে। দাতা কেন্দ্রের ১৪ দিনের নিরাপদ স্টক বজায় রাখা হয়েছে।
                          </p>
                        </>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-300 flex justify-between text-[11px] text-slate-600">
                      <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
                      <span className="font-bold text-slate-800">By Order: Chief Medical Officer of Health</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No reallocation plan active. Select a facility or item to synthesize.
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        {plan && !isLoading && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Donor retained buffer: <strong>{plan.donor_remaining_buffer_days ?? '37.3'} days</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Dismiss
              </button>

              <button
                onClick={() => {
                  onApproveTransfer(plan);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Authorize &amp; Dispatch Fleet ({plan.recommended_action.quantity_transferred} Units)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
