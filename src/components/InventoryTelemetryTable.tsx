import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Building2,
  Calendar,
  Zap,
  Edit2
} from 'lucide-react';
import { InventoryItem, Facility, DrugCategory } from '../types';

interface InventoryTelemetryTableProps {
  inventory: InventoryItem[];
  facilities: Facility[];
  onTriggerReallocation: (facilityId: string, itemName: string) => void;
  onSelectFacility: (facilityId: string) => void;
}

export const InventoryTelemetryTable: React.FC<InventoryTelemetryTableProps> = ({
  inventory,
  facilities,
  onTriggerReallocation,
  onSelectFacility
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.drug_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFacility = 
      selectedFacilityFilter === 'ALL' || item.facility_id === selectedFacilityFilter;

    const matchesCategory = 
      selectedCategory === 'ALL' || item.category === selectedCategory;

    return matchesSearch && matchesFacility && matchesCategory;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Essential Clinical Drug &amp; Consumables Inventory
            </h2>
            <p className="text-xs text-slate-400">
              National List of Essential Medicines (NLEM) · Verified against Form 35 ledgers &amp; Central e-Aushadhi
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drug, batch, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Facility Filter */}
          <select
            value={selectedFacilityFilter}
            onChange={(e) => setSelectedFacilityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Facilities (District)</option>
            {facilities.map((fac) => (
              <option key={fac.facility_id} value={fac.facility_id}>
                {fac.name} ({fac.facility_type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills / Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {[
          { id: 'ALL', label: 'All Consumables' },
          { id: 'CRITICAL_LIFE_SAVING', label: 'Life-Saving (ASV, Insulin, ORS)' },
          { id: 'CRITICAL_CARE', label: 'Critical Care (Oxygen, IV Fluids)' },
          { id: 'ROUTINE_CONSUMABLE', label: 'Routine (Paracetamol)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-3">Medicine Name &amp; Code</th>
              <th className="p-3">Facility Location</th>
              <th className="p-3">Batch &amp; Expiry</th>
              <th className="p-3 text-right">Physical Stock</th>
              <th className="p-3 text-right">Daily Burn</th>
              <th className="p-3 text-center">Safety Buffer</th>
              <th className="p-3 text-center">Sync Source</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No matching inventory records found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const fac = facilities.find(f => f.facility_id === item.facility_id);
                const isCritical = item.buffer_days < 3.0;
                const isWarning = item.buffer_days >= 3.0 && item.buffer_days < 14.0;

                return (
                  <tr key={item.item_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {item.drug_code} · {item.dosage_form}
                      </div>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => onSelectFacility(item.facility_id)}
                        className="text-left hover:underline text-slate-300 font-medium"
                      >
                        {fac?.name || item.facility_id}
                      </button>
                      <div className="text-[10px] text-slate-500">
                        {fac?.district}, {fac?.block}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      <div>{item.batch_number}</div>
                      <div className="text-[10px] text-slate-500">
                        Exp: {item.expiry_date}
                      </div>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-white text-sm">
                      {item.current_quantity}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        {item.unit_of_measure}s
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono text-slate-400">
                      {item.daily_burn_rate_avg} / day
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : isWarning
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {item.buffer_days} Days
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                        {item.verification_source.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {isCritical ? (
                        <button
                          onClick={() => onTriggerReallocation(item.facility_id, item.name)}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Reallocate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectFacility(item.facility_id)}
                          className="px-2 py-1 text-slate-400 hover:text-white text-[11px]"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
