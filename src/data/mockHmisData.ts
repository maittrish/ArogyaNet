import { Facility, InventoryItem, ReallocationTransfer, OutbreakProfile } from '../types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    facility_id: 'PHC_WB_PUR_014',
    name: 'Bhatar Primary Health Centre',
    facility_type: 'PHC',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Bhatar Block',
    coordinates: { latitude: 23.4214, longitude: 87.9147 },
    total_beds: 12,
    available_beds: 3,
    icu_beds: 0,
    available_icu_beds: 0,
    active_personnel: {
      doctors: 2,
      nurses: 4,
      pharmacists: 1,
      ambulances: 1
    },
    contact_number: '+91-342-258911',
    medical_officer_in_charge: 'Dr. Anirban Mukherjee, MBBS (BMOH)',
    has_cold_chain: true,
    has_blood_storage: false
  },
  {
    facility_id: 'CHC_WB_PUR_002',
    name: 'Katwa Sub-Divisional Hospital (SDH)',
    facility_type: 'SDH',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Katwa Sub-Division',
    coordinates: { latitude: 23.6441, longitude: 88.1332 },
    total_beds: 120,
    available_beds: 24,
    icu_beds: 8,
    available_icu_beds: 2,
    active_personnel: {
      doctors: 14,
      nurses: 32,
      pharmacists: 4,
      ambulances: 4
    },
    contact_number: '+91-3453-255030',
    medical_officer_in_charge: 'Dr. Subhashish Sengupta, MS (Superintendent)',
    has_cold_chain: true,
    has_blood_storage: true
  },
  {
    facility_id: 'SDH_WB_PUR_005',
    name: 'Kalna Sub-Divisional Hospital',
    facility_type: 'SDH',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Kalna Sub-Division',
    coordinates: { latitude: 23.2209, longitude: 88.3644 },
    total_beds: 100,
    available_beds: 19,
    icu_beds: 6,
    available_icu_beds: 1,
    active_personnel: {
      doctors: 12,
      nurses: 28,
      pharmacists: 3,
      ambulances: 3
    },
    contact_number: '+91-3454-255222',
    medical_officer_in_charge: 'Dr. Debabrata Roy, MD',
    has_cold_chain: true,
    has_blood_storage: true
  },
  {
    facility_id: 'PHC_WB_PUR_029',
    name: 'Memari Rural Hospital & CHC',
    facility_type: 'CHC',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Memari-I Block',
    coordinates: { latitude: 23.1812, longitude: 88.1130 },
    total_beds: 30,
    available_beds: 6,
    icu_beds: 2,
    available_icu_beds: 0,
    active_personnel: {
      doctors: 5,
      nurses: 11,
      pharmacists: 2,
      ambulances: 2
    },
    contact_number: '+91-342-225014',
    medical_officer_in_charge: 'Dr. Tapas Ghosh, MBBS, DCH',
    has_cold_chain: true,
    has_blood_storage: false
  },
  {
    facility_id: 'CHC_WB_PUR_018',
    name: 'Purbasthali Community Health Centre',
    facility_type: 'CHC',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Purbasthali-II',
    coordinates: { latitude: 23.4502, longitude: 88.3411 },
    total_beds: 30,
    available_beds: 8,
    icu_beds: 0,
    available_icu_beds: 0,
    active_personnel: {
      doctors: 4,
      nurses: 9,
      pharmacists: 2,
      ambulances: 1
    },
    contact_number: '+91-3454-266120',
    medical_officer_in_charge: 'Dr. Kaushik Chatterjee, MBBS',
    has_cold_chain: true,
    has_blood_storage: false
  },
  {
    facility_id: 'DH_WB_PUR_001',
    name: 'Burdwan Medical College & District Hospital',
    facility_type: 'DH',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Burdwan Sadar',
    coordinates: { latitude: 23.2324, longitude: 87.8615 },
    total_beds: 650,
    available_beds: 72,
    icu_beds: 48,
    available_icu_beds: 6,
    active_personnel: {
      doctors: 86,
      nurses: 180,
      pharmacists: 16,
      ambulances: 12
    },
    contact_number: '+91-342-2558641',
    medical_officer_in_charge: 'Prof. (Dr.) S. Bandyopadhyay, MS (Principal & MSVP)',
    has_cold_chain: true,
    has_blood_storage: true
  },
  {
    facility_id: 'PHC_WB_PUR_042',
    name: 'Galsi Primary Health Centre',
    facility_type: 'PHC',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    block: 'Galsi-I Block',
    coordinates: { latitude: 23.3312, longitude: 87.7123 },
    total_beds: 10,
    available_beds: 2,
    icu_beds: 0,
    available_icu_beds: 0,
    active_personnel: {
      doctors: 2,
      nurses: 3,
      pharmacists: 1,
      ambulances: 1
    },
    contact_number: '+91-342-273210',
    medical_officer_in_charge: 'Dr. P. K. Soren, MBBS',
    has_cold_chain: true,
    has_blood_storage: false
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Bhatar PHC (Critical Recipient - Facing Monsoon Snakebite Surge)
  {
    item_id: 'MED_WB_ASV_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'ASV-POLY-10ML',
    name: 'Polyvalent Anti-Snake Venom Serum',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'ASV-2024-B09',
    expiry_date: '2026-11-30',
    current_quantity: 4, // 30 hours buffer at 3.2 burn rate!
    unit_of_measure: 'Vial',
    reorder_level: 20,
    daily_burn_rate_avg: 3.2,
    buffer_days: 1.25,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'MULTIMODAL_LEDGER_SCAN'
  },
  {
    item_id: 'MED_WB_ORS_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'ORS-WHO-20.5G',
    name: 'Oral Rehydration Salts (ORS) WHO Formula',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Sachet (20.5g)',
    batch_number: 'ORS-25-H12',
    expiry_date: '2027-04-15',
    current_quantity: 85,
    unit_of_measure: 'Sachet',
    reorder_level: 300,
    daily_burn_rate_avg: 55.0,
    buffer_days: 1.5,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'VOICE_INTAKE'
  },
  {
    item_id: 'MED_WB_PCM_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'PCM-TAB-500MG',
    name: 'Paracetamol 500mg Tablets',
    category: 'ROUTINE_CONSUMABLE',
    dosage_form: 'Strip of 10 Tabs',
    batch_number: 'PCM-25-P44',
    expiry_date: '2027-08-30',
    current_quantity: 320,
    unit_of_measure: 'Strip',
    reorder_level: 500,
    daily_burn_rate_avg: 110.0,
    buffer_days: 2.9,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'MULTIMODAL_LEDGER_SCAN'
  },
  {
    item_id: 'MED_WB_NS_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'IV-NS-500ML',
    name: 'IV Normal Saline 0.9% Solution',
    category: 'CRITICAL_CARE',
    dosage_form: 'FFS Bottle (500ml)',
    batch_number: 'IV-24-S08',
    expiry_date: '2027-01-30',
    current_quantity: 28,
    unit_of_measure: 'Bottle',
    reorder_level: 100,
    daily_burn_rate_avg: 18.0,
    buffer_days: 1.55,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'CENTRAL_ERP'
  },
  {
    item_id: 'MED_WB_INS_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'INS-REG-40IU',
    name: 'Human Normal Soluble Insulin 40IU/ml',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'INS-24-N03',
    expiry_date: '2026-12-15',
    current_quantity: 6,
    unit_of_measure: 'Vial',
    reorder_level: 15,
    daily_burn_rate_avg: 1.2,
    buffer_days: 5.0,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'MANUAL_ENTRY'
  },
  {
    item_id: 'MED_WB_OXY_001',
    facility_id: 'PHC_WB_PUR_014',
    drug_code: 'MED-O2-BTYPE',
    name: 'Medical Oxygen Cylinder (B-Type 10L)',
    category: 'CRITICAL_CARE',
    dosage_form: 'Cylinder',
    batch_number: 'CYL-2026-09',
    expiry_date: '2030-01-01',
    current_quantity: 2,
    unit_of_measure: 'Cylinder',
    reorder_level: 6,
    daily_burn_rate_avg: 1.0,
    buffer_days: 2.0,
    last_synced_at: '2026-09-30T10:45:00Z',
    verification_source: 'MANUAL_ENTRY'
  },

  // Katwa SDH (Potential Donor Facility - Has high surplus!)
  {
    item_id: 'MED_WB_ASV_002',
    facility_id: 'CHC_WB_PUR_002',
    drug_code: 'ASV-POLY-10ML',
    name: 'Polyvalent Anti-Snake Venom Serum',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'ASV-2024-K18',
    expiry_date: '2027-02-28',
    current_quantity: 68, // Safe surplus! Daily burn = 1.5, 14-day threshold = 21, Surplus = 47
    unit_of_measure: 'Vial',
    reorder_level: 25,
    daily_burn_rate_avg: 1.5,
    buffer_days: 45.3,
    last_synced_at: '2026-09-30T10:30:00Z',
    verification_source: 'CENTRAL_ERP'
  },
  {
    item_id: 'MED_WB_ORS_002',
    facility_id: 'CHC_WB_PUR_002',
    drug_code: 'ORS-WHO-20.5G',
    name: 'Oral Rehydration Salts (ORS) WHO Formula',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Sachet (20.5g)',
    batch_number: 'ORS-25-K88',
    expiry_date: '2027-05-30',
    current_quantity: 1450,
    unit_of_measure: 'Sachet',
    reorder_level: 400,
    daily_burn_rate_avg: 28.0,
    buffer_days: 51.7,
    last_synced_at: '2026-09-30T10:30:00Z',
    verification_source: 'CENTRAL_ERP'
  },
  {
    item_id: 'MED_WB_NS_002',
    facility_id: 'CHC_WB_PUR_002',
    drug_code: 'IV-NS-500ML',
    name: 'IV Normal Saline 0.9% Solution',
    category: 'CRITICAL_CARE',
    dosage_form: 'FFS Bottle (500ml)',
    batch_number: 'IV-25-K02',
    expiry_date: '2027-06-30',
    current_quantity: 580,
    unit_of_measure: 'Bottle',
    reorder_level: 200,
    daily_burn_rate_avg: 22.0,
    buffer_days: 26.3,
    last_synced_at: '2026-09-30T10:30:00Z',
    verification_source: 'CENTRAL_ERP'
  },

  // Kalna SDH (Alternative Potential Donor)
  {
    item_id: 'MED_WB_NS_003',
    facility_id: 'SDH_WB_PUR_005',
    drug_code: 'IV-NS-500ML',
    name: 'IV Normal Saline 0.9% Solution',
    category: 'CRITICAL_CARE',
    dosage_form: 'FFS Bottle (500ml)',
    batch_number: 'IV-24-KL11',
    expiry_date: '2026-10-30',
    current_quantity: 620,
    unit_of_measure: 'Bottle',
    reorder_level: 180,
    daily_burn_rate_avg: 19.0,
    buffer_days: 32.6,
    last_synced_at: '2026-09-30T10:15:00Z',
    verification_source: 'CENTRAL_ERP'
  },
  {
    item_id: 'MED_WB_ASV_003',
    facility_id: 'SDH_WB_PUR_005',
    drug_code: 'ASV-POLY-10ML',
    name: 'Polyvalent Anti-Snake Venom Serum',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'ASV-24-KL04',
    expiry_date: '2026-08-30',
    current_quantity: 42,
    unit_of_measure: 'Vial',
    reorder_level: 20,
    daily_burn_rate_avg: 1.2,
    buffer_days: 35.0,
    last_synced_at: '2026-09-30T10:15:00Z',
    verification_source: 'CENTRAL_ERP'
  },

  // Memari Rural Hospital (Cannot donate ASV - below threshold!)
  {
    item_id: 'MED_WB_ASV_004',
    facility_id: 'PHC_WB_PUR_029',
    drug_code: 'ASV-POLY-10ML',
    name: 'Polyvalent Anti-Snake Venom Serum',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'ASV-24-M01',
    expiry_date: '2026-12-31',
    current_quantity: 11, // Daily burn = 0.8 -> 14-day safety = 11.2! Cannot donate.
    unit_of_measure: 'Vial',
    reorder_level: 15,
    daily_burn_rate_avg: 0.8,
    buffer_days: 13.7,
    last_synced_at: '2026-09-30T09:40:00Z',
    verification_source: 'MULTIMODAL_LEDGER_SCAN'
  },

  // Burdwan Medical College (Apex Central Hub)
  {
    item_id: 'MED_WB_ASV_005',
    facility_id: 'DH_WB_PUR_001',
    drug_code: 'ASV-POLY-10ML',
    name: 'Polyvalent Anti-Snake Venom Serum',
    category: 'CRITICAL_LIFE_SAVING',
    dosage_form: 'Vial (10ml)',
    batch_number: 'ASV-25-BMC01',
    expiry_date: '2027-10-31',
    current_quantity: 240,
    unit_of_measure: 'Vial',
    reorder_level: 80,
    daily_burn_rate_avg: 6.0,
    buffer_days: 40.0,
    last_synced_at: '2026-09-30T10:00:00Z',
    verification_source: 'CENTRAL_ERP'
  }
];

export const INITIAL_TRANSFERS: ReallocationTransfer[] = [
  {
    transfer_id: 'TX_20260930_WB_0091',
    status: 'IN_TRANSIT',
    urgency: 'CRITICAL',
    donor_facility_id: 'CHC_WB_PUR_002',
    donor_facility_name: 'Katwa Sub-Divisional Hospital (SDH)',
    recipient_facility_id: 'PHC_WB_PUR_014',
    recipient_facility_name: 'Bhatar Primary Health Centre',
    items: [
      {
        drug_code: 'ASV-POLY-10ML',
        name: 'Polyvalent Anti-Snake Venom Serum',
        quantity: 12,
        batch_number: 'ASV-2024-K18'
      }
    ],
    transit_metrics: {
      distance_km: 28.4,
      estimated_duration_mins: 38,
      assigned_vehicle_reg: 'WB-39-E-4421',
      vehicle_type: 'GOVT_AMBULANCE',
      current_lat: 23.5320,
      current_lng: 88.0240,
      progress_pct: 65
    },
    created_at: '2026-09-30T10:10:00Z',
    eta_timestamp: '2026-09-30T10:48:00Z',
    dmo_authorized_by: 'Dr. R. K. Hazra, Chief Medical Officer of Health (CMOH)',
    vernacular_dispatch_notice: {
      en: 'URGENT MEDICAL DISPATCH: 12 vials of Polyvalent ASV en route from Katwa SDH to Bhatar PHC via SH-7. Driver contact: +91-9832104421.',
      hi: 'तत्काल चिकित्सा प्रेषण: 12 शीशी एंटी-स्नेक वेनम कटवा एसडीएच से भातार पीएचसी के लिए राज्य राजमार्ग 7 द्वारा रवाना। चालक संपर्क: +91-9832104421।',
      bn: 'জরুরী ওষুধ প্রেরণ: ১২টি অ্যান্টি-স্নেক ভেনম কাটোয়া এসডিএইচ থেকে রাজ্য সড়ক ৭ দিয়ে ভাতাড় পিএইচসিতে প্রেরিত হচ্ছে। চালকের নম্বর: +91-9832104421।'
    }
  },
  {
    transfer_id: 'TX_20260930_WB_0092',
    status: 'DISPATCHED',
    urgency: 'HIGH',
    donor_facility_id: 'SDH_WB_PUR_005',
    donor_facility_name: 'Kalna Sub-Divisional Hospital',
    recipient_facility_id: 'CHC_WB_PUR_018',
    recipient_facility_name: 'Purbasthali Community Health Centre',
    items: [
      {
        drug_code: 'IV-NS-500ML',
        name: 'IV Normal Saline 0.9%',
        quantity: 120,
        batch_number: 'IV-24-KL11'
      },
      {
        drug_code: 'ORS-WHO-20.5G',
        name: 'ORS WHO Formula Sachets',
        quantity: 400,
        batch_number: 'ORS-25-K88'
      }
    ],
    transit_metrics: {
      distance_km: 34.1,
      estimated_duration_mins: 46,
      assigned_vehicle_reg: 'WB-42-B-8902',
      vehicle_type: 'MEDICAL_LOGISTICS_VAN',
      current_lat: 23.2750,
      current_lng: 88.3520,
      progress_pct: 20
    },
    created_at: '2026-09-30T10:25:00Z',
    eta_timestamp: '2026-09-30T11:11:00Z',
    dmo_authorized_by: 'Dy. CMOH-II, Purba Bardhaman',
    vernacular_dispatch_notice: {
      en: 'DISPATCH: 120 bottles IV Saline and 400 ORS sachets moving from Kalna SDH to Purbasthali CHC.',
      hi: 'प्रेषण: 120 बोतल आईवी सलाइन और 400 ओआरएस पैकेट कालना एसडीएच से पूर्वस्थली सीएचसी जा रहे हैं।',
      bn: 'বিতরণ: ১২০ বোতল আইভি স্যালাইন এবং ৪০০ ওআরএস কালনা এসডিএইচ থেকে পূর্বস্থলী সিএইচসিতে পাঠানো হয়েছে।'
    }
  }
];

export const OUTBREAK_PROFILES: OutbreakProfile[] = [
  {
    id: 'OUTBREAK_SNAKEBITE',
    name: 'Monsoon Paddy Harvest Snakebite Surge',
    disease_vector: 'Viper / Krait Envenomation',
    season: 'Monsoon (July - October)',
    risk_level: 'SEVERE',
    surge_multiplier: 3.4,
    impacted_drugs: ['Polyvalent Anti-Snake Venom Serum', 'IV Normal Saline 0.9%', 'Paracetamol 500mg Tablets'],
    description: 'Intense agricultural field activities during monsoon flooding displace Russell’s vipers and common kraits, causing a 3.4x spike in venomous bites across rural blocks.',
    active: true
  },
  {
    id: 'OUTBREAK_DIARRHEA',
    name: 'Flood-Induced Acute Diarrheal Disease (ADD)',
    disease_vector: 'Waterborne Pathogens / Vibrio cholerae',
    season: 'Post-Monsoon Floods',
    risk_level: 'HIGH',
    surge_multiplier: 2.8,
    impacted_drugs: ['Oral Rehydration Salts (ORS) WHO Formula', 'IV Normal Saline 0.9%', 'Zinc Sulfate Tablets'],
    description: 'Submerged drinking tube-wells lead to acute enteritis clusters requiring heavy fluid replacement and ORS mobilization.',
    active: false
  },
  {
    id: 'OUTBREAK_DENGUE',
    name: 'Peri-Urban Vector-Borne Dengue Wave',
    disease_vector: 'Aedes aegypti Mosquito',
    season: 'August - November',
    risk_level: 'HIGH',
    surge_multiplier: 2.5,
    impacted_drugs: ['Paracetamol 500mg Tablets', 'IV Normal Saline 0.9%', 'Platelet Transfusion Consumables'],
    description: 'Post-rain water stagnation spurs Aedes larval proliferation with high febrile footfalls across block sub-centres.',
    active: false
  }
];

// Sample ledger photos and handwritten logbook fixtures for testing multimodal digitization
export const SAMPLE_LEDGER_PRESETS = [
  {
    id: 'PRESET_PHC_FORM35',
    title: 'Bhatar PHC - Form 35 Emergency Register (Sept 2026)',
    facility: 'Bhatar Primary Health Centre',
    date: '2026-09-30',
    description: 'Official State Govt Drug Register with physical count of snake venom vials, ORS, and IV fluids.',
    thumbnailLabel: 'Form 35 Register (Handwritten)',
    simulatedText: `FORM 35 - PRIMARY HEALTH CENTRE BHATAR
DISTRICT: PURBA BARDHAMAN | DATE: 30/09/2026
1. Anti-Snake Venom 10ml | Batch: ASV-2024-B09 | Opening: 8 | Recd: 0 | Dispensed: 4 | Closing: 4 | Exp: 11/2026
2. ORS Sachets 20.5g | Batch: ORS-25-H12 | Opening: 140 | Recd: 0 | Dispensed: 55 | Closing: 85 | Exp: 04/2027
3. Paracetamol 500mg (Strips) | Batch: PCM-25-P44 | Opening: 430 | Recd: 0 | Dispensed: 110 | Closing: 320 | Exp: 08/2027
4. IV Normal Saline 500ml | Batch: IV-24-S08 | Opening: 46 | Recd: 0 | Dispensed: 18 | Closing: 28 | Exp: 01/2027
Signed: S. Mondal, Pharmacist-in-Charge`
  },
  {
    id: 'PRESET_KATWA_BATCH',
    title: 'Katwa SDH - Cold-Chain Biological Ledger (Sept 2026)',
    facility: 'Katwa Sub-Divisional Hospital (SDH)',
    date: '2026-09-29',
    description: 'Sub-divisional cold-chain central biological stock showing ASV surplus batches.',
    thumbnailLabel: 'SDH Biological Ledger',
    simulatedText: `KATWA SUB-DIVISIONAL HOSPITAL PHARMACY CENTRAL STORE
COLD CHAIN REGISTER - SECTION B (ANTI-VENOM & VACCINES)
DATE: 29-SEP-2026
Item: Polyvalent Anti Snake Venom Serum (Liquid 10ml)
Batch No: ASV-2024-K18 | Manufacturer: Haffkine / Bharat Serums
Opening Bal: 70 | Received from CMS: 0 | Issued to Wards: 2 | Balance in ILR: 68
Storage Temp: 4.2°C (OK)
Verified By: Dr. S. Sengupta (Superintendent)`
  },
  {
    id: 'PRESET_PURBASTHALI_DELIVERY',
    title: 'Purbasthali CHC - Inward Batch Consignment Chalan',
    facility: 'Purbasthali Community Health Centre',
    date: '2026-09-28',
    description: 'Warehouse delivery receipt for IV Saline and Antibiotics.',
    thumbnailLabel: 'Inward Delivery Chalan',
    simulatedText: `GOVT OF WEST BENGAL - HEALTH & FAMILY WELFARE
INWARD STORE RECEIPT CHALAN # CHL-2026-098
Consignee: Purbasthali CHC, Dist Purba Bardhaman
1. IV Normal Saline 0.9% 500ml - Qty: 150 Bottles - Batch: IV-25-KL11 - Exp: 10/2027
2. Amoxicillin 500mg Caps - Qty: 500 Caps - Batch: AMX-26-004 - Exp: 03/2028
Received in good seal condition. Pharmacist: R. Das`
  }
];

export const SAMPLE_VOICE_PROMPTS = [
  {
    id: 'VOICE_BN_CRITICAL',
    language: 'bn',
    languageLabel: 'Bengali (বাংলা)',
    speakerRole: 'Bhatar PHC Pharmacist (অনিল মন্ডল)',
    transcript: 'আমাদের ভাতাড় পিএইচসিতে মাত্র ৪ টি অ্যান্টি-স্নেক ভেনম বাকি আছে। আজ সকালে দু’জন সাপে কাটা রোগী ভর্তি হয়েছে। আরও ১০ থেকে ১২ ভায়াল অবিলম্বে প্রয়োজন, নাহলে সন্ধ্যা নাগাদ স্টক শেষ হয়ে যাবে।',
    englishTranslation: 'At our Bhatar PHC, only 4 vials of Anti-Snake Venom remain. Two snakebite patients were admitted this morning. We urgently need 10 to 12 more vials, otherwise stock will be completely exhausted by evening.',
    facilityId: 'PHC_WB_PUR_014'
  },
  {
    id: 'VOICE_HI_ORS',
    language: 'hi',
    languageLabel: 'Hindi (हिन्दी)',
    speakerRole: 'ANM Grassroots Worker (रीता देवी)',
    transcript: 'नमस्ते सर, भातार उप-केंद्र में ओआरएस के केवल 85 पैकेट बचे हैं। दस्त के मरीजों की संख्या बढ़ रही है, कम से कम 200 पैकेट और 30 बोतल आईवी सलाइन की तुरंत जरूरत है।',
    englishTranslation: 'Hello Sir, only 85 packets of ORS are left at Bhatar sub-centre. Diarrhea patients are increasing, we urgently require at least 200 packets and 30 bottles of IV Saline.',
    facilityId: 'PHC_WB_PUR_014'
  },
  {
    id: 'VOICE_TA_EMERGENCY',
    language: 'ta',
    languageLabel: 'Tamil (தமிழ்)',
    speakerRole: 'District Logistics Officer',
    transcript: 'அவசர நிலை: கட்வா மருத்துவமனையில் 68 பாம்பு விஷ முறிவு மருந்துகள் உள்ளன. 12 மருந்துகளை உடனடியாக பாதார் ஆரம்ப சுகாதார நிலையத்திற்கு அனுப்ப பரிந்துரைக்கப்படுகிறது.',
    englishTranslation: 'Emergency alert: Katwa SDH has 68 vials of Anti-Snake Venom. Recommended immediate dispatch of 12 vials to Bhatar PHC.',
    facilityId: 'CHC_WB_PUR_002'
  }
];
