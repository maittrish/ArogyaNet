export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type FacilityType = 'PHC' | 'CHC' | 'SDH' | 'DH';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ActivePersonnel {
  doctors: number;
  nurses: number;
  pharmacists: number;
  ambulances: number;
}

export interface Facility {
  facility_id: string;
  name: string;
  facility_type: FacilityType;
  district: string;
  state: string;
  block: string;
  coordinates: Coordinates;
  total_beds: number;
  available_beds: number;
  icu_beds: number;
  available_icu_beds: number;
  active_personnel: ActivePersonnel;
  contact_number: string;
  medical_officer_in_charge: string;
  has_cold_chain: boolean;
  has_blood_storage: boolean;
}

export type DrugCategory = 
  | 'CRITICAL_LIFE_SAVING'
  | 'CRITICAL_CARE'
  | 'ESSENTIAL_ANTIBIOTIC'
  | 'MATERNAL_CHILD'
  | 'ROUTINE_CONSUMABLE';

export interface InventoryItem {
  item_id: string;
  facility_id: string;
  drug_code: string;
  name: string;
  category: DrugCategory;
  dosage_form: string;
  batch_number: string;
  expiry_date: string;
  current_quantity: number;
  unit_of_measure: string;
  reorder_level: number;
  daily_burn_rate_avg: number;
  buffer_days: number;
  last_synced_at: string;
  verification_source: 'MULTIMODAL_LEDGER_SCAN' | 'VOICE_INTAKE' | 'MANUAL_ENTRY' | 'CENTRAL_ERP';
}

export interface DeficitPrediction {
  item: string;
  current_stock: number;
  depletion_date: string;
  burn_rate_daily: number;
  hours_remaining: number;
  criticality: AlertLevel;
}

export interface RecommendedAction {
  action_type: 'LOCAL_TRANSFER' | 'CENTRAL_REORDER' | 'STAFF_REDISTRIBUTION';
  donor_facility_id: string;
  transit_distance_km: number;
  quantity_transferred: number;
  eta_hours: number;
  vehicle_type?: string;
  route_corridor?: string;
}

export interface ReallocationPlan {
  alert_level: AlertLevel;
  facility_id: string;
  district: string;
  state: string;
  predicted_deficit: Array<{
    item: string;
    current_stock: number;
    depletion_date: string;
    burn_rate_daily: number;
  }>;
  recommended_action: {
    action_type: 'LOCAL_TRANSFER' | 'CENTRAL_REORDER' | 'STAFF_REDISTRIBUTION';
    donor_facility_id: string;
    transit_distance_km: number;
    quantity_transferred: number;
    eta_hours: number;
  };
  rationale: string;
  donor_safety_verified?: boolean;
  donor_remaining_buffer_days?: number;
  generated_at?: string;
}

export interface TransferTransitMetrics {
  distance_km: number;
  estimated_duration_mins: number;
  assigned_vehicle_reg: string;
  vehicle_type: 'GOVT_AMBULANCE' | 'MEDICAL_LOGISTICS_VAN' | 'DRONE_AIRLIFT';
  current_lat?: number;
  current_lng?: number;
  progress_pct: number;
}

export interface ReallocationTransfer {
  transfer_id: string;
  status: 'PENDING_APPROVAL' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  urgency: AlertLevel;
  donor_facility_id: string;
  donor_facility_name: string;
  recipient_facility_id: string;
  recipient_facility_name: string;
  items: Array<{
    drug_code: string;
    name: string;
    quantity: number;
    batch_number: string;
  }>;
  transit_metrics: TransferTransitMetrics;
  created_at: string;
  eta_timestamp: string;
  dmo_authorized_by?: string;
  vernacular_dispatch_notice?: {
    en: string;
    hi: string;
    bn: string;
  };
}

export interface OutbreakProfile {
  id: string;
  name: string;
  disease_vector: string;
  season: string;
  risk_level: 'HIGH' | 'SEVERE' | 'MODERATE';
  surge_multiplier: number;
  impacted_drugs: string[];
  description: string;
  active: boolean;
}

export interface LedgerEntryParsed {
  drug_name: string;
  batch_number: string;
  unit: string;
  opening_balance: number;
  quantity_received: number;
  quantity_dispensed: number;
  closing_balance: number;
  expiry_date: string;
  confidence_score: number;
  arithmetic_valid: boolean;
}

export interface LedgerScanResult {
  facility_name_detected: string;
  ledger_date: string;
  page_number: string;
  entries: LedgerEntryParsed[];
  processing_ms: number;
  validation_summary: {
    total_entries: number;
    arithmetic_passed: number;
    low_confidence_flagged: number;
  };
}

export interface VoiceInventoryDelta {
  item_name: string;
  quantity_reported: number;
  unit: string;
  condition: 'AVAILABLE' | 'DAMAGED' | 'CRITICALLY_LOW';
  notes: string;
}

export interface VoiceTelemetryResult {
  facility_id: string;
  detected_language: string;
  raw_transcript: string;
  translated_english: string;
  parsed_telemetry: VoiceInventoryDelta[];
  confidence_score: number;
}
