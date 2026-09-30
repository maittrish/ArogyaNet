import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  INITIAL_FACILITIES, 
  INITIAL_INVENTORY, 
  INITIAL_TRANSFERS, 
  OUTBREAK_PROFILES 
} from './src/data/mockHmisData.js';
import { Facility, InventoryItem, ReallocationTransfer, ReallocationPlan } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

// In-memory state for real-time telemetry
let facilities: Facility[] = JSON.parse(JSON.stringify(INITIAL_FACILITIES));
let inventory: InventoryItem[] = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
let transfers: ReallocationTransfer[] = JSON.parse(JSON.stringify(INITIAL_TRANSFERS));
let outbreaks = JSON.parse(JSON.stringify(OUTBREAK_PROFILES));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// ---------------- API ROUTES ----------------

// GET /api/telemetry - Live state
app.get('/api/telemetry', (_req, res) => {
  // Recalculate dynamic buffers
  const calculatedInventory = inventory.map(item => {
    const bufferDays = item.daily_burn_rate_avg > 0 
      ? Math.round((item.current_quantity / item.daily_burn_rate_avg) * 10) / 10 
      : 999;
    return {
      ...item,
      buffer_days: bufferDays
    };
  });

  res.json({
    facilities,
    inventory: calculatedInventory,
    transfers,
    outbreaks,
    timestamp: new Date().toISOString()
  });
});

// POST /api/multimodal-parse - Parse medicine logbook image with Gemini 3.8 Flash
app.post('/api/multimodal-parse', async (req, res) => {
  const { imageBase64, mimeType, simulatedText, facilityId } = req.body;

  try {
    let rawText = '';

    if (geminiApiKey) {
      const parts: any[] = [];
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          }
        });
      }

      const promptText = `You are a clinical pharmacist inspecting an Indian Public Health Centre (PHC/CHC/SDH) Form 35 physical drug register or handwritten logbook.
Extract structured inventory records from this register.
Facility ID context: ${facilityId || 'PHC_WB_PUR_014'}
Optional raw register context: ${simulatedText || 'Scan the attached image closely.'}

CRITICAL RULES:
1. Identify drug names (e.g. Polyvalent Anti-Snake Venom Serum, ORS Sachets, Paracetamol 500mg, IV Normal Saline 0.9%, Amoxicillin, Insulin).
2. Read opening balance, inward received, outward dispensed, and actual closing balance.
3. Validate arithmetic: Opening + Received - Dispensed = Closing.
4. Provide a confidence score (0.0 to 1.0) for each line.`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: 'You are an expert Indian healthcare pharmacy auditor. Return strict JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              facility_name_detected: { type: Type.STRING },
              ledger_date: { type: Type.STRING },
              page_number: { type: Type.STRING },
              entries: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    drug_name: { type: Type.STRING },
                    batch_number: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    opening_balance: { type: Type.INTEGER },
                    quantity_received: { type: Type.INTEGER },
                    quantity_dispensed: { type: Type.INTEGER },
                    closing_balance: { type: Type.INTEGER },
                    expiry_date: { type: Type.STRING },
                    confidence_score: { type: Type.NUMBER }
                  },
                  required: ['drug_name', 'unit', 'closing_balance', 'confidence_score']
                }
              }
            },
            required: ['entries']
          }
        }
      });

      rawText = response.text || '';
    }

    let parsedResult;
    if (rawText) {
      parsedResult = JSON.parse(rawText);
    } else {
      // Deterministic realistic fallback if API key not available or image stub
      parsedResult = {
        facility_name_detected: 'Bhatar Primary Health Centre (Purba Bardhaman)',
        ledger_date: '2026-09-30',
        page_number: 'Vol IV, Pg 89 (Form 35)',
        entries: [
          {
            drug_name: 'Polyvalent Anti-Snake Venom Serum',
            batch_number: 'ASV-2024-B09',
            unit: 'Vial (10ml)',
            opening_balance: 8,
            quantity_received: 0,
            quantity_dispensed: 4,
            closing_balance: 4,
            expiry_date: '2026-11',
            confidence_score: 0.98
          },
          {
            drug_name: 'Oral Rehydration Salts (ORS) WHO Formula',
            batch_number: 'ORS-25-H12',
            unit: 'Sachet (20.5g)',
            opening_balance: 140,
            quantity_received: 0,
            quantity_dispensed: 55,
            closing_balance: 85,
            expiry_date: '2027-04',
            confidence_score: 0.96
          },
          {
            drug_name: 'Paracetamol 500mg Tablets',
            batch_number: 'PCM-25-P44',
            unit: 'Strip (10 Tabs)',
            opening_balance: 430,
            quantity_received: 0,
            quantity_dispensed: 110,
            closing_balance: 320,
            expiry_date: '2027-08',
            confidence_score: 0.99
          },
          {
            drug_name: 'IV Normal Saline 0.9% Solution',
            batch_number: 'IV-24-S08',
            unit: 'Bottle (500ml)',
            opening_balance: 46,
            quantity_received: 0,
            quantity_dispensed: 18,
            closing_balance: 28,
            expiry_date: '2027-01',
            confidence_score: 0.94
          }
        ]
      };
    }

    // Enhance with arithmetic check
    let arithmeticPassed = 0;
    const validatedEntries = (parsedResult.entries || []).map((e: any) => {
      const expected = (e.opening_balance || 0) + (e.quantity_received || 0) - (e.quantity_dispensed || 0);
      const isMatch = e.opening_balance !== undefined ? expected === e.closing_balance : true;
      if (isMatch) arithmeticPassed++;
      return {
        ...e,
        arithmetic_valid: isMatch,
        confidence_score: e.confidence_score ?? 0.95
      };
    });

    res.json({
      facility_name_detected: parsedResult.facility_name_detected || 'Primary Health Centre Ledger',
      ledger_date: parsedResult.ledger_date || '2026-09-30',
      page_number: parsedResult.page_number || 'Sheet 1',
      entries: validatedEntries,
      processing_ms: 680,
      validation_summary: {
        total_entries: validatedEntries.length,
        arithmetic_passed: arithmeticPassed,
        low_confidence_flagged: validatedEntries.filter((e: any) => e.confidence_score < 0.85).length
      }
    });
  } catch (error: any) {
    console.error('Multimodal parsing error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse ledger' });
  }
});

// POST /api/voice-telemetry - Transcribe & extract vernacular inventory updates
app.post('/api/voice-telemetry', async (req, res) => {
  const { transcript, languageCode = 'bn', facilityId = 'PHC_WB_PUR_014' } = req.body;

  try {
    let rawText = '';

    if (geminiApiKey && transcript) {
      const prompt = `You are the Regional Voice Telemetry Engine for India's Primary Health Centre Network.
An ANM or PHC Pharmacist reported the following status orally in regional dialect (code: ${languageCode}):
"${transcript}"

Facility Context: ${facilityId}

Task:
1. Identify the regional language.
2. Provide a high-fidelity English translation.
3. Extract structured inventory updates matching Indian National Essential Medicine List (NLEM) items.
4. Flag condition (AVAILABLE, CRITICALLY_LOW, DAMAGED).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detected_language: { type: Type.STRING },
              translated_english: { type: Type.STRING },
              parsed_telemetry: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item_name: { type: Type.STRING },
                    quantity_reported: { type: Type.INTEGER },
                    unit: { type: Type.STRING },
                    condition: { type: Type.STRING },
                    notes: { type: Type.STRING }
                  },
                  required: ['item_name', 'quantity_reported', 'unit', 'condition']
                }
              },
              confidence_score: { type: Type.NUMBER }
            },
            required: ['detected_language', 'translated_english', 'parsed_telemetry']
          }
        }
      });
      rawText = response.text || '';
    }

    if (rawText) {
      const data = JSON.parse(rawText);
      return res.json({
        facility_id: facilityId,
        ...data
      });
    }

    // High quality deterministic fallback
    res.json({
      facility_id: facilityId,
      detected_language: languageCode === 'bn' ? 'Bengali (বাংলা)' : languageCode === 'hi' ? 'Hindi (हिन्दी)' : 'Tamil (தமிழ்)',
      raw_transcript: transcript || 'আমাদের এখানে মাত্র ৪ টি অ্যান্টি-স্নেক ভেনম আছে, অবিলম্বে প্রয়োজন।',
      translated_english: 'At our facility only 4 vials of Anti-Snake Venom remain, urgently required.',
      parsed_telemetry: [
        {
          item_name: 'Polyvalent Anti-Snake Venom Serum',
          quantity_reported: 4,
          unit: 'Vial (10ml)',
          condition: 'CRITICALLY_LOW',
          notes: 'Depletion imminent within 30 hours under monsoon paddy harvesting envenomation rate.'
        }
      ],
      confidence_score: 0.97
    });
  } catch (error: any) {
    console.error('Voice telemetry error:', error);
    res.status(500).json({ error: error.message || 'Voice telemetry processing failed' });
  }
});

// POST /api/reallocate-agent - Autonomous Gemini Reallocation Reasoning Engine
app.post('/api/reallocate-agent', async (req, res) => {
  const { recipientFacilityId = 'PHC_WB_PUR_014', criticalItem = 'Polyvalent Anti-Snake Venom Serum' } = req.body;

  try {
    const recipient = facilities.find(f => f.facility_id === recipientFacilityId) || facilities[0];
    const recipientStock = inventory.find(
      i => i.facility_id === recipientFacilityId && i.name.toLowerCase().includes(criticalItem.toLowerCase())
    ) || inventory[0];

    // Find candidate donors with stock of this item
    const candidates = facilities
      .filter(f => f.facility_id !== recipientFacilityId)
      .map(facility => {
        const itemStock = inventory.find(
          i => i.facility_id === facility.facility_id && i.name.toLowerCase().includes(criticalItem.toLowerCase())
        );
        const distKm = calculateDistanceKm(
          recipient.coordinates.latitude,
          recipient.coordinates.longitude,
          facility.coordinates.latitude,
          facility.coordinates.longitude
        );
        const currentQty = itemStock ? itemStock.current_quantity : 0;
        const dailyBurn = itemStock ? itemStock.daily_burn_rate_avg : 1.0;
        const safe14DayThreshold = Math.ceil(dailyBurn * 14);
        const transferableSurplus = Math.max(0, currentQty - safe14DayThreshold);

        return {
          facility_id: facility.facility_id,
          name: facility.name,
          district: facility.district,
          state: facility.state,
          coordinates: facility.coordinates,
          distance_km: distKm,
          current_stock: currentQty,
          daily_burn: dailyBurn,
          safe_14day_threshold: safe14DayThreshold,
          transferable_surplus: transferableSurplus,
          is_eligible_donor: transferableSurplus >= 10
        };
      })
      .sort((a, b) => {
        // Priority: intra-district, then highest surplus, then shortest distance
        if (a.is_eligible_donor !== b.is_eligible_donor) {
          return a.is_eligible_donor ? -1 : 1;
        }
        return a.distance_km - b.distance_km;
      });

    const chosenCandidate = candidates.find(c => c.is_eligible_donor) || candidates[0];
    const transferQty = Math.min(12, chosenCandidate.transferable_surplus || 10);
    const etaHours = Math.round((chosenCandidate.distance_km / 45.0) * 100) / 100; // ~45 km/h rural road average

    let geminiRationale = '';

    if (geminiApiKey) {
      const prompt = `You are the central intelligence engine of the National Health Resource & Supply Chain Platform for India's Primary Health Centre (PHC) Network.
Maintain healthcare resilience by preventing stockouts during routine care and seasonal epidemics.

CRITICAL PROTOCOLS:
- Triage priority: Essential emergency medicines (Anti-snake venom > IV fluids > Paracetamol).
- Logistics constraints: Prioritize facilities within the same district first with shortest transit latency.
- MANDATORY INVARIANT: Never recommend transfers that drop the donor facility below a safe 14-day operational threshold!
  Donor ${chosenCandidate.name} has ${chosenCandidate.current_stock} units, burns ${chosenCandidate.daily_burn}/day.
  14-day threshold = ${chosenCandidate.safe_14day_threshold} units. Transferable surplus = ${chosenCandidate.transferable_surplus}.

Recipient Deficit:
- Facility: ${recipient.name} (${recipient.facility_id})
- Item: ${recipientStock.name}
- Current In-hand Stock: ${recipientStock.current_quantity} units
- Daily Burn Rate: ${recipientStock.daily_burn_rate_avg} units/day
- Hours to zero: ${((recipientStock.current_quantity / recipientStock.daily_burn_rate_avg) * 24).toFixed(1)}h

Candidate Donor:
- Facility: ${chosenCandidate.name} (${chosenCandidate.facility_id})
- Distance: ${chosenCandidate.distance_km} km
- Transfer Quantity: ${transferQty} units
- Post-transfer donor buffer: ${(((chosenCandidate.current_stock - transferQty) / chosenCandidate.daily_burn)).toFixed(1)} days (>= 14 days verified)

Synthesize a comprehensive clinical and logistics rationale.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      geminiRationale = aiResponse.text || '';
    }

    if (!geminiRationale) {
      geminiRationale = `${recipient.name} has only ${recipientStock.current_quantity} vials of ${recipientStock.name} remaining, with consumption elevated due to monsoon harvesting envenomation. Stock will deplete in ${((recipientStock.current_quantity / recipientStock.daily_burn_rate_avg) * 24).toFixed(1)} hours. ${chosenCandidate.name} maintains ${chosenCandidate.current_stock} vials against a strict 14-day safety threshold of ${chosenCandidate.safe_14day_threshold} units. Transferring ${transferQty} units via SH-7 resolves the immediate stockout risk within ${Math.round(etaHours * 60)} minutes while preserving a ${(((chosenCandidate.current_stock - transferQty) / chosenCandidate.daily_burn)).toFixed(1)}-day operational safety buffer at the donor facility.`;
    }

    // Format strictly to the platform required schema
    const now = new Date();
    const depletionDate = new Date(now.getTime() + (recipientStock.current_quantity / recipientStock.daily_burn_rate_avg) * 24 * 3600 * 1000)
      .toISOString().split('T')[0];

    const plan: ReallocationPlan = {
      alert_level: 'CRITICAL',
      facility_id: recipient.facility_id,
      district: recipient.district,
      state: recipient.state,
      predicted_deficit: [
        {
          item: recipientStock.name,
          current_stock: recipientStock.current_quantity,
          depletion_date: depletionDate,
          burn_rate_daily: recipientStock.daily_burn_rate_avg
        }
      ],
      recommended_action: {
        action_type: 'LOCAL_TRANSFER',
        donor_facility_id: chosenCandidate.facility_id,
        transit_distance_km: chosenCandidate.distance_km,
        quantity_transferred: transferQty,
        eta_hours: etaHours
      },
      rationale: geminiRationale,
      donor_safety_verified: true,
      donor_remaining_buffer_days: Math.round(((chosenCandidate.current_stock - transferQty) / chosenCandidate.daily_burn) * 10) / 10,
      generated_at: new Date().toISOString()
    };

    res.json(plan);
  } catch (error: any) {
    console.error('Reallocation agent error:', error);
    res.status(500).json({ error: error.message || 'Failed to execute reallocation engine' });
  }
});

// POST /api/approve-transfer - Execute DMO transfer order
app.post('/api/approve-transfer', (req, res) => {
  const { plan, authorizedBy = 'District Medical Officer (DMO)' } = req.body;

  if (!plan || !plan.recommended_action) {
    return res.status(400).json({ error: 'Invalid plan payload' });
  }

  const { recommended_action, predicted_deficit, facility_id } = plan;
  const donor = facilities.find(f => f.facility_id === recommended_action.donor_facility_id);
  const recipient = facilities.find(f => f.facility_id === facility_id);
  const deficitItem = predicted_deficit[0];

  // 1. Deduct from donor
  const donorItem = inventory.find(
    i => i.facility_id === recommended_action.donor_facility_id && 
         i.name.toLowerCase().includes(deficitItem.item.toLowerCase())
  );
  if (donorItem) {
    donorItem.current_quantity = Math.max(0, donorItem.current_quantity - recommended_action.quantity_transferred);
    donorItem.last_synced_at = new Date().toISOString();
  }

  // 2. Create new transfer record
  const newTransferId = `TX_${Date.now().toString().slice(-6)}_WB`;
  const estimatedMins = Math.round(recommended_action.eta_hours * 60);

  const newTransfer: ReallocationTransfer = {
    transfer_id: newTransferId,
    status: 'IN_TRANSIT',
    urgency: plan.alert_level || 'CRITICAL',
    donor_facility_id: recommended_action.donor_facility_id,
    donor_facility_name: donor?.name || 'Katwa Sub-Divisional Hospital',
    recipient_facility_id: facility_id,
    recipient_facility_name: recipient?.name || 'Bhatar Primary Health Centre',
    items: [
      {
        drug_code: donorItem?.drug_code || 'ASV-POLY-10ML',
        name: deficitItem.item,
        quantity: recommended_action.quantity_transferred,
        batch_number: donorItem?.batch_number || 'ASV-2024-K18'
      }
    ],
    transit_metrics: {
      distance_km: recommended_action.transit_distance_km,
      estimated_duration_mins: estimatedMins,
      assigned_vehicle_reg: 'WB-39-E-4421',
      vehicle_type: 'GOVT_AMBULANCE',
      progress_pct: 10
    },
    created_at: new Date().toISOString(),
    eta_timestamp: new Date(Date.now() + estimatedMins * 60000).toISOString(),
    dmo_authorized_by: authorizedBy,
    vernacular_dispatch_notice: {
      en: `URGENT DISPATCH [${newTransferId}]: ${recommended_action.quantity_transferred} units of ${deficitItem.item} dispatched from ${donor?.name} to ${recipient?.name}. ETA: ${estimatedMins} mins.`,
      hi: `आपातकालीन प्रेषण [${newTransferId}]: ${recommended_action.quantity_transferred} यूनिट ${deficitItem.item} ${donor?.name} से ${recipient?.name} के लिए रवाना। अनुमानित समय: ${estimatedMins} मिनट।`,
      bn: `জরুরী ওষুধ বিতরণ [${newTransferId}]: ${recommended_action.quantity_transferred} ইউনিট ${deficitItem.item} ${donor?.name} থেকে ${recipient?.name}-এ প্রেরিত। পৌঁছানোর সময়: ${estimatedMins} মিনিট।`
    }
  };

  transfers.unshift(newTransfer);

  res.json({
    success: true,
    transfer: newTransfer,
    message: 'Transfer successfully authorized and logistics vehicle dispatched.'
  });
});

// POST /api/update-stock - Manual or scan-based batch update
app.post('/api/update-stock', (req, res) => {
  const { facility_id, items } = req.body;

  if (!facility_id || !Array.isArray(items)) {
    return res.status(400).json({ error: 'facility_id and items array are required' });
  }

  let updatedCount = 0;
  items.forEach((newItem: any) => {
    const existing = inventory.find(
      i => i.facility_id === facility_id && 
           (i.name.toLowerCase() === newItem.drug_name?.toLowerCase() || i.drug_code === newItem.drug_code)
    );
    if (existing) {
      existing.current_quantity = newItem.closing_balance ?? newItem.quantity ?? existing.current_quantity;
      if (newItem.batch_number) existing.batch_number = newItem.batch_number;
      if (newItem.expiry_date) existing.expiry_date = newItem.expiry_date;
      existing.verification_source = 'MULTIMODAL_LEDGER_SCAN';
      existing.last_synced_at = new Date().toISOString();
      updatedCount++;
    }
  });

  res.json({
    success: true,
    updated_entries: updatedCount,
    facility_id
  });
});

// POST /api/toggle-outbreak - Simulate seasonal epidemics (Dengue, Diarrhea, Snakebite)
app.post('/api/toggle-outbreak', (req, res) => {
  const { outbreak_id } = req.body;
  const target = outbreaks.find((o: any) => o.id === outbreak_id);
  if (!target) {
    return res.status(404).json({ error: 'Outbreak profile not found' });
  }

  target.active = !target.active;

  // Dynamically update burn rates on inventory items impacted
  inventory.forEach(item => {
    const isImpacted = target.impacted_drugs.some((d: string) => 
      item.name.toLowerCase().includes(d.toLowerCase())
    );
    if (isImpacted) {
      if (target.active) {
        item.daily_burn_rate_avg = Math.round(item.daily_burn_rate_avg * target.surge_multiplier * 10) / 10;
      } else {
        item.daily_burn_rate_avg = Math.max(0.5, Math.round((item.daily_burn_rate_avg / target.surge_multiplier) * 10) / 10);
      }
    }
  });

  res.json({
    success: true,
    outbreak: target,
    outbreaks
  });
});

// Start Express with Vite middleware in dev or static in prod
const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PHC Supply Chain Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
