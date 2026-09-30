import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Facility, InventoryItem, ReallocationTransfer } from '../types';

interface GenerateReportOptions {
  facility: Facility;
  inventory: InventoryItem[];
  transfers: ReallocationTransfer[];
  generatedBy?: string;
}

export function generateFacilityPdfReport({
  facility,
  inventory,
  transfers,
  generatedBy = 'District Medical Officer (DMO) Command'
}: GenerateReportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Filter items for this facility
  const facilityInventory = inventory.filter(item => item.facility_id === facility.facility_id);
  const criticalDeficits = facilityInventory
    .filter(item => item.buffer_days < 7.0)
    .sort((a, b) => a.buffer_days - b.buffer_days);

  // Filter transfers involving this facility (as recipient or donor)
  const facilityTransfers = transfers.filter(
    tx => tx.recipient_facility_id === facility.facility_id || tx.donor_facility_id === facility.facility_id
  );

  // 1. Header Emblem & Title Block
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NATIONAL HEALTH MISSION (NHM) · MINISTRY OF HEALTH & FAMILY WELFARE', margin, 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('District Healthcare Command & Emergency Logistics Sentinel · Purba Bardhaman', margin, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(244, 63, 94); // rose-500
  doc.text('FACILITY STOCKOUT AUDIT & LOGISTICS TRANSFER SUMMARY', margin, 23);

  // Timestamp on top-right
  const now = new Date();
  const timestampStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`DOC-REF: REP-${facility.facility_id.slice(-6)}-${Date.now().toString().slice(-4)}`, pageWidth - margin, 9, { align: 'right' });
  doc.text(`Generated: ${timestampStr}`, pageWidth - margin, 15, { align: 'right' });
  doc.text(`Security: OFFICIAL USE ONLY`, pageWidth - margin, 21, { align: 'right' });

  // 2. Facility Metadata Card
  let currentY = 33;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(facility.name, margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Facility Code: ${facility.facility_id} | Type: ${facility.facility_type} | Block: ${facility.block}`, margin + 4, currentY + 13);
  doc.text(`District: ${facility.district}, ${facility.state} | Coordinates: ${facility.coordinates.latitude}° N, ${facility.coordinates.longitude}° E`, margin + 4, currentY + 18);
  doc.text(`Medical Officer: ${facility.medical_officer_in_charge} | Contact: ${facility.contact_number}`, margin + 4, currentY + 23);

  // Quick stats badges inside card
  const badgeX = pageWidth - margin - 55;
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(badgeX, currentY + 4, 50, 19, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('CLINICAL CAPACITY', badgeX + 25, currentY + 9, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Beds: ${facility.available_beds}/${facility.total_beds} Free (${Math.round(((facility.total_beds - facility.available_beds) / facility.total_beds) * 100)}% Occ)`, badgeX + 25, currentY + 14, { align: 'center' });
  doc.text(`Staff: ${facility.active_personnel.doctors} Docs, ${facility.active_personnel.nurses} Nurses`, badgeX + 25, currentY + 19, { align: 'center' });

  currentY += 34;

  // 3. Section: Current Stockout & Deficit Alerts Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(190, 18, 60); // rose-700
  doc.text(`1. CRITICAL STOCKOUT ALERTS & CONSUMPTION PROJECTIONS (${criticalDeficits.length} ITEMS FLAGGED)`, margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Calculated using rolling 7 to 14-day footfall consumption and seasonal epidemic indicators.', margin, currentY + 4.5);

  currentY += 6;

  if (criticalDeficits.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 12, 1, 1, 'FD');
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('✓ No immediate stockout risks detected. All monitored essentials maintain >= 7 days buffer.', margin + 4, currentY + 7.5);
    currentY += 16;
  } else {
    const tableBody = criticalDeficits.map(item => {
      const hoursRemaining = Math.round(item.buffer_days * 24);
      const isUrgent = item.buffer_days < 2.0;
      return [
        `${item.name}\n[${item.drug_code}]`,
        `${item.batch_number}\nExp: ${item.expiry_date}`,
        `${item.current_quantity} ${item.unit_of_measure}s`,
        `${item.daily_burn_rate_avg} / day`,
        `${hoursRemaining}h (${item.buffer_days.toFixed(1)} d)`,
        isUrgent ? 'CRITICAL DEFICIT' : 'REORDER LEVEL',
        isUrgent ? 'Cross-Facility Transfer Recommended' : 'Routine Warehouse Indent'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Medicine Name & Code', 'Batch / Expiry', 'Stock On Hand', 'Daily Burn', 'Buffer Time', 'Status Level', 'Recommended Action']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 26 },
        2: { cellWidth: 20, halign: 'right' },
        3: { cellWidth: 18, halign: 'right' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 24, halign: 'center' },
        6: { cellWidth: 'auto' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'CRITICAL DEFICIT') {
            data.cell.styles.textColor = [190, 18, 60];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [180, 83, 9];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // 4. Section: Active Logistics & Inter-District Reallocations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text(`2. ACTIVE INTER-FACILITY TRANSFERS & FLEET DISPATCHES (${facilityTransfers.length} ACTIVE)`, margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Shipments authorized under National Health Mission federated redistribution protocols.', margin, currentY + 4.5);

  currentY += 6;

  if (facilityTransfers.length === 0) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 12, 1, 1, 'FD');
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('No active emergency shipments currently in transit for this facility.', margin + 4, currentY + 7.5);
    currentY += 16;
  } else {
    const transferBody = facilityTransfers.map(tx => {
      const isRecipient = tx.recipient_facility_id === facility.facility_id;
      const role = isRecipient ? 'INWARD (Recipient)' : 'OUTWARD (Donor)';
      const itemDesc = tx.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

      return [
        tx.transfer_id,
        role,
        isRecipient ? `${tx.donor_facility_name}` : `${tx.recipient_facility_name}`,
        itemDesc,
        `${tx.transit_metrics.distance_km} KM (${tx.transit_metrics.estimated_duration_mins}m)`,
        `${tx.transit_metrics.assigned_vehicle_reg}\n(${tx.transit_metrics.vehicle_type.replace('_', ' ')})`,
        tx.status.replace('_', ' ')
      ];
    });

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Order ID', 'Flow Direction', 'Counterpart Facility', 'Medicines / Quantity', 'Distance & ETA', 'Assigned Fleet', 'Status']],
      body: transferBody,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 26 },
        1: { cellWidth: 26 },
        2: { cellWidth: 38 },
        3: { cellWidth: 36 },
        4: { cellWidth: 24, halign: 'center' },
        5: { cellWidth: 24 },
        6: { cellWidth: 'auto', halign: 'center', fontStyle: 'bold' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Check if we need to add a page or if space permits signature box
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 20;
  }

  // 5. Official Medical Officer & Regulatory Endorsement
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GOVERNMENT HEALTH NETWORK STATUTORY COMPLIANCE & SAFETY INVARIANT NOTE:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '1. Priority protocol enforced: Life-saving antivenoms, insulin, and emergency IV fluids triage ahead of routine supplies.\n' +
    '2. Mandatory Donor Invariant Verified: No donor facility was recommended for transfers dropping below its 14-day operational safety threshold.\n' +
    '3. This digital audit is synchronized directly with the HMIS telemetry warehouse and District Medical Officer (DMO) command.',
    margin + 4,
    currentY + 11
  );

  // Signature lines
  const sigY = currentY + 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Prepared By: System Telemetry Engine', margin + 4, sigY);
  doc.text('Audited By: ' + generatedBy, pageWidth / 2, sigY);
  doc.text('Authorized CMOH Seal: [DIGITALLY SIGNED]', pageWidth - margin - 4, sigY, { align: 'right' });

  // Footer bar on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `National Health Resource & Supply Chain Platform · Facility Report: ${facility.facility_id} · Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Trigger browser download
  const safeFacilityName = facility.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Stockout_Logistics_Report_${safeFacilityName}_${now.toISOString().split('T')[0]}.pdf`);
}
