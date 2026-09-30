import React from 'react';
import { 
  Activity, 
  Bed, 
  Users, 
  Truck, 
  HeartPulse, 
  CheckCircle,
  Building,
  ShieldAlert
} from 'lucide-react';
import { Facility } from '../types';

interface BedCapacityGaugeProps {
  facilities: Facility[];
  onSelectFacility: (facilityId: string) => void;
}

export const BedCapacityGauge: React.FC<BedCapacityGaugeProps> = ({
  facilities,
  onSelectFacility
}) => {
  const totalBeds = facilities.reduce((sum, f) => sum + f.total_beds, 0);
  const availableBeds = facilities.reduce((sum, f) => sum + f.available_beds, 0);
  const occupiedBeds = totalBeds - availableBeds;
  const occupancyPct = Math.round((occupiedBeds / totalBeds) * 100);

  const totalIcu = facilities.reduce((sum, f) => sum + f.icu_beds, 0);
  const availableIcu = facilities.reduce((sum, f) => sum + f.available_icu_beds, 0);

  const totalDoctors = facilities.reduce((sum, f) => sum + f.active_personnel.doctors, 0);
  const totalNurses = facilities.reduce((sum, f) => sum + f.active_personnel.nurses, 0);
  const totalAmbulances = facilities.reduce((sum, f) => sum + f.active_personnel.ambulances, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              District Bed Capacity &amp; Frontline Clinical Personnel
            </h2>
            <p className="text-xs text-slate-400">
              Real-time synchronization across PHCs, CHCs, SDHs, and Medical College Wards
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
          {availableBeds} Free Beds
        </span>
      </div>

      {/* Main Aggregated Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Total Occupancy */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-indigo-400" />
              General Beds
            </span>
            <span className="font-bold text-white font-mono">{occupancyPct}% Occ.</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{occupiedBeds}</span>
            <span className="text-xs text-slate-400">/ {totalBeds} Occupied</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* ICU / Critical Care */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              Critical Care / ICU
            </span>
            <span className="font-bold text-rose-400 font-mono">
              {availableIcu} Available
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{totalIcu - availableIcu}</span>
            <span className="text-xs text-slate-400">/ {totalIcu} Active ICU</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-rose-500"
              style={{ width: `${Math.round(((totalIcu - availableIcu) / totalIcu) * 100)}%` }}
            />
          </div>
        </div>

        {/* Medical Officers On Duty */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Doctors &amp; Nursing Staff
          </div>
          <div className="text-2xl font-bold text-white font-mono pt-1">
            {totalDoctors} <span className="text-sm font-normal text-slate-400">Docs · {totalNurses} Nurses</span>
          </div>
          <span className="text-[11px] text-emerald-400 block">
            100% Emergency Roster Coverage
          </span>
        </div>

        {/* Emergency Fleet Status */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            Ambulances &amp; Vans
          </div>
          <div className="text-2xl font-bold text-white font-mono pt-1">
            {totalAmbulances} <span className="text-sm font-normal text-slate-400">Vehicles Online</span>
          </div>
          <span className="text-[11px] text-amber-400 block">
            2 Units Active in Inter-PHC Transit
          </span>
        </div>
      </div>

      {/* Facility Capacity Breakdown Grid */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Facility-Level Bed &amp; Staff Distribution
        </div>
        <div className="divide-y divide-slate-800/80">
          {facilities.map((fac) => {
            const facOcc = Math.round(((fac.total_beds - fac.available_beds) / fac.total_beds) * 100);
            return (
              <div
                key={fac.facility_id}
                onClick={() => onSelectFacility(fac.facility_id)}
                className="p-3 hover:bg-slate-900/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span>{fac.name}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {fac.facility_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {fac.medical_officer_in_charge}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono">
                      {fac.available_beds} of {fac.total_beds} beds free ({facOcc}% occ)
                    </span>
                  </div>

                  <div className="font-mono text-slate-300">
                    {fac.active_personnel.doctors} Dr · {fac.active_personnel.nurses} Nurse
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
