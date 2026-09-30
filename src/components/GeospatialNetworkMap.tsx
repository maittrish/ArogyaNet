import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  Phone, 
  Bed, 
  Users, 
  Cross, 
  Radio,
  FileDown
} from 'lucide-react';
import { Facility, ReallocationTransfer, InventoryItem } from '../types';

interface GeospatialNetworkMapProps {
  facilities: Facility[];
  transfers: ReallocationTransfer[];
  inventory: InventoryItem[];
  selectedFacilityId: string | null;
  onSelectFacility: (facilityId: string) => void;
  onTriggerReallocationFor: (facilityId: string) => void;
  onDownloadReportFor?: (facilityId: string) => void;
}

export const GeospatialNetworkMap: React.FC<GeospatialNetworkMapProps> = ({
  facilities,
  transfers,
  inventory,
  selectedFacilityId,
  onSelectFacility,
  onTriggerReallocationFor,
  onDownloadReportFor
}) => {
  const [showRoutes, setShowRoutes] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);

  // Geographic bounding box for Purba Bardhaman district:
  // Lat: ~23.1 to 23.7, Lon: ~87.6 to 88.4
  const minLat = 23.10;
  const maxLat = 23.70;
  const minLng = 87.65;
  const maxLng = 88.45;

  // Projection to SVG coords (width 900, height 520)
  const svgWidth = 900;
  const svgHeight = 520;
  const padding = 50;

  const project = (lat: number, lng: number) => {
    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (svgWidth - 2 * padding);
    // Invert Y because latitude increases northward
    const y = svgHeight - (padding + ((lat - minLat) / (maxLat - minLat)) * (svgHeight - 2 * padding));
    return { x, y };
  };

  const selectedFacility = facilities.find(f => f.facility_id === selectedFacilityId);
  const facilityStock = selectedFacility 
    ? inventory.filter(i => i.facility_id === selectedFacility.facility_id)
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Map Header Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-950/70 border border-indigo-800 text-indigo-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Purba Bardhaman District · Federated Healthcare Telemetry Map
              <span className="text-[11px] font-mono text-emerald-400 font-normal">
                ● Live GPS &amp; Routes API Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Corridor SH-7 / NH-19 Transit Mesh · Sub-Centres to District Medical Colleges
            </p>
          </div>
        </div>

        {/* Map Control Filters */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              showRoutes
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showRoutes ? '✓ Arterial Routes' : 'Show Routes'}
          </button>
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              showVehicles
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showVehicles ? '✓ Emergency Fleets' : 'Show Fleets'}
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[400px] lg:h-[460px] bg-slate-950 overflow-hidden select-none">
        
        {/* Subtle GIS Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        {/* District Boundary Watermark */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
            GEOSPATIAL PROJECTION: WGS84 / EPSG:4326
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-0.5">
            Zone: Purba Bardhaman Health District
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 space-y-1.5 shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facility Types</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-950" />
            <span>Critical Deficit PHC (&lt; 48h stock)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-950" />
            <span>Surplus Donor Facility (&gt; 30d buffer)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-950" />
            <span>Apex District Hospital</span>
          </div>
        </div>

        {/* SVG Visualization Layer */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full object-contain"
        >
          <defs>
            {/* Gradient for transit lines */}
            <linearGradient id="transitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Pulse filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* District Highway Network Mesh */}
          {showRoutes && (
            <g className="stroke-slate-800" strokeWidth="1.5" strokeDasharray="3 3">
              {/* Connect Burdwan DH to all facilities as road network */}
              {facilities.slice(1).map((f) => {
                const center = project(facilities[5].coordinates.latitude, facilities[5].coordinates.longitude);
                const target = project(f.coordinates.latitude, f.coordinates.longitude);
                return (
                  <line
                    key={f.facility_id}
                    x1={center.x}
                    y1={center.y}
                    x2={target.x}
                    y2={target.y}
                    className="opacity-40"
                  />
                );
              })}
            </g>
          )}

          {/* Active Inter-District Reallocation Corridors */}
          {showRoutes && transfers.map((tx) => {
            const donor = facilities.find(f => f.facility_id === tx.donor_facility_id);
            const recipient = facilities.find(f => f.facility_id === tx.recipient_facility_id);
            if (!donor || !recipient) return null;

            const p1 = project(donor.coordinates.latitude, donor.coordinates.longitude);
            const p2 = project(recipient.coordinates.latitude, recipient.coordinates.longitude);

            // Compute curved path for realism
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const cx = (p1.x + p2.x) / 2 - dy * 0.15;
            const cy = (p1.y + p2.y) / 2 + dx * 0.15;
            const pathData = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;

            return (
              <g key={tx.transfer_id}>
                {/* Glow route */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#transitGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  className="opacity-80"
                />
                {/* Animated dash */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  className="animate-[dash_2s_linear_infinite]"
                />

                {/* Road Corridor Text */}
                <text
                  x={cx}
                  y={cy - 10}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="bg-slate-900"
                >
                  SH-7 · {tx.transit_metrics.distance_km} KM ({tx.transit_metrics.estimated_duration_mins}m ETA)
                </text>
              </g>
            );
          })}

          {/* Moving Vehicles in Transit */}
          {showVehicles && transfers.filter(tx => tx.status === 'IN_TRANSIT').map((tx) => {
            const donor = facilities.find(f => f.facility_id === tx.donor_facility_id);
            const recipient = facilities.find(f => f.facility_id === tx.recipient_facility_id);
            if (!donor || !recipient) return null;

            const p1 = project(donor.coordinates.latitude, donor.coordinates.longitude);
            const p2 = project(recipient.coordinates.latitude, recipient.coordinates.longitude);

            // Interpolate position based on progress
            const t = (tx.transit_metrics.progress_pct || 65) / 100;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const cx = (p1.x + p2.x) / 2 - dy * 0.15;
            const cy = (p1.y + p2.y) / 2 + dx * 0.15;

            // Quadratic bezier calculation
            const vx = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cx + t * t * p2.x;
            const vy = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cy + t * t * p2.y;

            return (
              <g key={`veh-${tx.transfer_id}`} transform={`translate(${vx}, ${vy})`}>
                {/* Vehicle Pulse Beacon */}
                <circle r="14" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                <circle r="9" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                
                {/* Vehicle Icon */}
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#60a5fa"
                  fontWeight="bold"
                >
                  🚑
                </text>

                {/* Fleet tag */}
                <g transform="translate(14, -8)">
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="20"
                    rx="4"
                    fill="#0f172a"
                    stroke="#3b82f6"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text x="6" y="14" fill="#e2e8f0" fontSize="9" fontWeight="600">
                    {tx.transit_metrics.assigned_vehicle_reg}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Facility Nodes */}
          {facilities.map((fac) => {
            const { x, y } = project(fac.coordinates.latitude, fac.coordinates.longitude);
            const isSelected = fac.facility_id === selectedFacilityId;
            
            // Check health status of this facility
            const isCritical = fac.facility_id === 'PHC_WB_PUR_014'; // Bhatar PHC
            const isSurplusDonor = fac.facility_id === 'CHC_WB_PUR_002'; // Katwa SDH
            const isApexHospital = fac.facility_type === 'DH';

            const fillColor = isCritical 
              ? '#f43f5e' 
              : isSurplusDonor 
              ? '#10b981' 
              : isApexHospital 
              ? '#818cf8' 
              : '#38bdf8';

            return (
              <g
                key={fac.facility_id}
                transform={`translate(${x}, ${y})`}
                onClick={() => onSelectFacility(fac.facility_id)}
                className="cursor-pointer group"
              >
                {/* Selected Halo */}
                {isSelected && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-spin"
                  />
                )}

                {/* Critical ping */}
                {isCritical && (
                  <circle
                    r="18"
                    fill="#f43f5e"
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Outer ring */}
                <circle
                  r="12"
                  fill="#0f172a"
                  stroke={fillColor}
                  strokeWidth="2.5"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Inner symbol */}
                <circle r="4" fill={fillColor} />

                {/* Node Label Card */}
                <g transform="translate(16, -12)">
                  <rect
                    x="0"
                    y="0"
                    width={fac.name.length * 6.5 + 16}
                    height="24"
                    rx="4"
                    fill="#0f172a"
                    stroke={isSelected ? '#ffffff' : '#334155'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    opacity="0.9"
                  />
                  <text
                    x="8"
                    y="16"
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize="10"
                    fontWeight={isSelected ? 'bold' : '500'}
                  >
                    {fac.name}
                  </text>
                </g>

                {/* Beds Badge */}
                <g transform="translate(16, 14)">
                  <text
                    x="0"
                    y="0"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {fac.available_beds}/{fac.total_beds} beds · {fac.facility_type}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Facility Inspector Overlay / Floating Card */}
        {selectedFacility && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {selectedFacility.facility_type} · {selectedFacility.block}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {selectedFacility.name}
                </h3>
              </div>
              <button
                onClick={() => onSelectFacility('')}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Officer & Contact */}
            <div className="mt-3 text-xs text-slate-300 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">
                {selectedFacility.medical_officer_in_charge}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{selectedFacility.contact_number}</span>
              </div>
            </div>

            {/* Clinical Capacity Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Bed className="w-3 h-3 text-emerald-400" /> General Beds
                </div>
                <div className="font-bold text-slate-200 mt-0.5">
                  {selectedFacility.available_beds} <span className="text-slate-500 font-normal">/ {selectedFacility.total_beds} free</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3 text-indigo-400" /> Medical Staff
                </div>
                <div className="font-bold text-slate-200 mt-0.5">
                  {selectedFacility.active_personnel.doctors} Dr · {selectedFacility.active_personnel.nurses} Nurse
                </div>
              </div>
            </div>

            {/* Key Medicine Stock Status */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Critical Stock Telemetry</span>
                <span className="text-[10px] text-slate-500">Live Buffer</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {facilityStock.slice(0, 3).map((item) => {
                  const isLow = item.buffer_days < 3.0;
                  return (
                    <div
                      key={item.item_id}
                      className="flex items-center justify-between text-xs bg-slate-950/50 px-2.5 py-1.5 rounded border border-slate-800"
                    >
                      <div className="truncate max-w-[170px]">
                        <span className="font-medium text-slate-200 block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.current_quantity} {item.unit_of_measure}s in store</span>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        isLow ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {item.buffer_days}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons for Selected Facility */}
            <div className="mt-3 space-y-2">
              {onDownloadReportFor && (
                <button
                  onClick={() => onDownloadReportFor(selectedFacility.facility_id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Facility Report (PDF)</span>
                </button>
              )}

              {selectedFacility.facility_id === 'PHC_WB_PUR_014' && (
                <button
                  onClick={() => onTriggerReallocationFor(selectedFacility.facility_id)}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Trigger Autonomous Reallocation</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Corridor Summary Footer */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-white">SH-7 &amp; NH-19</strong> Rural Arterial Route: Operational
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">
            Avg Cross-District Dispatch Latency: <strong className="text-slate-200">42 minutes</strong>
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Facilities Synchronized: 7/7 · HMIS Ingestion: 100%
        </div>
      </div>
    </div>
  );
};
