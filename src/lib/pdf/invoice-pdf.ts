import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export interface InvoicePdfData {
  invoiceNumber: string;
  bookingReference: string;
  status: string; // PAID, PARTIALLY_PAID, UNPAID, CANCELLED, VOID
  issueDate: Date | string;
  dueDate: Date | string;
  paidAt?: Date | string | null;
  customer: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
  };
  event: {
    eventType: string;
    eventDate: Date | string;
    startTime: string;
    endTime: string;
    guestCount: number;
    city: string;
    venueLocation: string;
    packageTitle?: string | null;
    themeTitle?: string | null;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPriceMinor: number;
    totalPriceMinor: number;
  }>;
  financials: {
    subtotalMinor: number;
    discountMinor: number;
    additionalChargesMinor?: number;
    taxMinor: number;
    totalAmountMinor: number;
    amountPaidMinor: number;
    balanceDueMinor: number;
    depositRequiredMinor?: number;
    currency: string;
  };
  payments?: Array<{
    paymentMethod: string;
    amountMinor: number;
    status: string;
    providerRef?: string | null;
    paidAt?: Date | string | null;
    createdAt?: Date | string;
  }>;
  notes?: {
    customerNotes?: string | null;
    terms?: string | null;
  };
  businessSettings?: {
    name?: string;
    tagline?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    bankName?: string;
    accountTitle?: string;
    accountNumber?: string;
    iban?: string;
  };
}

const formatPKRMinor = (minor: number) => {
  const pkr = Math.round(minor / 100);
  return `PKR ${pkr.toLocaleString("en-PK")}`;
};

export function generateInvoicePdf(data: InvoicePdfData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryNavy = [10, 25, 47]; // #0A192F
  const secondaryGold = [212, 175, 55]; // #D4AF37
  const darkSlate = [51, 65, 85]; // #334155
  const lightBg = [248, 246, 240]; // #F8F6F0
  const borderGrey = [226, 232, 240]; // #E2E8F0
  const successGreen = [16, 185, 129];
  const alertRose = [225, 29, 72];
  const pendingAmber = [217, 119, 6];

  let currentY = 16;

  // 1. TOP LUXURY ACCENT BAR
  doc.setFillColor(secondaryGold[0], secondaryGold[1], secondaryGold[2]);
  doc.rect(0, 0, pageWidth, 4, "F");

  // 2. HEADER BRANDING & INVOICE TITLE
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(data.businessSettings?.name || "AR EVENTS CO.", margin, currentY + 4);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(
    data.businessSettings?.tagline || "Islamabad & Rawalpindi's Premier Birthday & Event Planners",
    margin,
    currentY + 9
  );
  doc.text(
    `Phone: ${data.businessSettings?.phone || "+92 300 8555123"} | Email: ${data.businessSettings?.email || "info@areventsco.com"}`,
    margin,
    currentY + 13.5
  );

  // Right-aligned INVOICE Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("INVOICE", pageWidth - margin, currentY + 4, { align: "right" });

  // Status Badge
  const statusUpper = data.status.toUpperCase();
  let statusColor = pendingAmber;
  if (statusUpper === "PAID") statusColor = successGreen;
  else if (statusUpper === "CANCELLED" || statusUpper === "VOID") statusColor = alertRose;

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - margin - 32, currentY + 8, 32, 7, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(statusUpper.replace(/_/g, " "), pageWidth - margin - 16, currentY + 12.8, { align: "center" });

  currentY += 21;

  // Thin separator rule
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // 3. METADATA CARDS (INVOICE INFO, BILL TO, EVENT SPECS)
  const colWidth = (contentWidth - 6) / 3;

  // Box 1: Invoice Details
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, currentY, colWidth, 38, 2, 2, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, currentY, colWidth, 38, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("INVOICE DETAILS", margin + 4, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`Invoice #: ${data.invoiceNumber}`, margin + 4, currentY + 12);
  doc.text(`Booking Ref: ${data.bookingReference}`, margin + 4, currentY + 17);
  doc.text(
    `Issue Date: ${format(new Date(data.issueDate), "dd MMM yyyy")}`,
    margin + 4,
    currentY + 22
  );
  doc.text(
    `Due Date: ${format(new Date(data.dueDate), "dd MMM yyyy")}`,
    margin + 4,
    currentY + 27
  );
  if (data.paidAt) {
    doc.text(
      `Paid Date: ${format(new Date(data.paidAt), "dd MMM yyyy")}`,
      margin + 4,
      currentY + 32
    );
  }

  // Box 2: Bill To
  const billToX = margin + colWidth + 3;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(billToX, currentY, colWidth, 38, 2, 2, "F");
  doc.roundedRect(billToX, currentY, colWidth, 38, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("BILL TO (CLIENT)", billToX + 4, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont("helvetica", "bold");
  doc.text(data.customer.name, billToX + 4, currentY + 12);
  doc.setFont("helvetica", "normal");
  doc.text(`Phone: ${data.customer.phone || "N/A"}`, billToX + 4, currentY + 17);
  doc.text(`Email: ${data.customer.email}`, billToX + 4, currentY + 22);
  const cityLine = data.customer.city ? `City: ${data.customer.city}` : "Territory: Twin Cities";
  doc.text(cityLine, billToX + 4, currentY + 27);
  if (data.customer.address) {
    const splitAddr = doc.splitTextToSize(data.customer.address, colWidth - 8);
    doc.text(splitAddr[0] || "", billToX + 4, currentY + 32);
  }

  // Box 3: Event Specifications
  const eventX = billToX + colWidth + 3;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(eventX, currentY, colWidth, 38, 2, 2, "F");
  doc.roundedRect(eventX, currentY, colWidth, 38, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("EVENT SPECIFICATIONS", eventX + 4, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(
    `Date: ${format(new Date(data.event.eventDate), "EEE, dd MMM yyyy")}`,
    eventX + 4,
    currentY + 12
  );
  doc.text(
    `Timing: ${data.event.startTime} - ${data.event.endTime}`,
    eventX + 4,
    currentY + 17
  );
  doc.text(
    `Type / City: ${data.event.eventType} (${data.event.city})`,
    eventX + 4,
    currentY + 22
  );
  doc.text(`Guest Count: ${data.event.guestCount} Guests`, eventX + 4, currentY + 27);
  const venueShort = data.event.venueLocation
    ? doc.splitTextToSize(`Venue: ${data.event.venueLocation}`, colWidth - 8)
    : ["Venue: Private Residence / Venue"];
  doc.text(venueShort[0] || "", eventX + 4, currentY + 32);

  currentY += 44;

  // 4. LINE ITEMS TABLE (autoTable)
  const tableRows = data.items.map((item, idx) => [
    (idx + 1).toString(),
    item.description,
    item.quantity.toString(),
    formatPKRMinor(item.unitPriceMinor),
    formatPKRMinor(item.totalPriceMinor),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["#", "ITEM DESCRIPTION & SERVICE SPECIFICATION", "QTY", "UNIT PRICE", "TOTAL AMOUNT"]],
    body: tableRows,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [10, 25, 47],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 95 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 30, halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 6;

  // 5. FINANCIAL TOTALS & PAYMENT DETAILS SECTION
  const summaryBoxWidth = 80;
  const summaryX = pageWidth - margin - summaryBoxWidth;
  const leftInfoWidth = contentWidth - summaryBoxWidth - 6;

  // Left column: Bank Transfer Details & Payment Instructions
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, currentY, leftInfoWidth, 42, 2, 2, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, currentY, leftInfoWidth, 42, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("BANK TRANSFER & PAYMENT DETAILS", margin + 4, currentY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`Bank: ${data.businessSettings?.bankName || "Meezan Bank Ltd."}`, margin + 4, currentY + 12);
  doc.text(`Account Title: ${data.businessSettings?.accountTitle || "AR Events Co."}`, margin + 4, currentY + 17);
  doc.text(`Account Number: ${data.businessSettings?.accountNumber || "02010108932014"}`, margin + 4, currentY + 22);
  doc.text(`IBAN: ${data.businessSettings?.iban || "PK89MEZN0002010108932014"}`, margin + 4, currentY + 27);
  doc.text(
    "Please send screenshot/proof of deposit via WhatsApp to +92 300 8555123",
    margin + 4,
    currentY + 33
  );
  doc.text("Official receipts will be generated upon transaction clearance.", margin + 4, currentY + 37.5);

  // Right column: Financial Summary Box
  let totalsY = currentY;
  const rowH = 6;

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text("Subtotal:", summaryX, totalsY + 4);
  doc.text(formatPKRMinor(data.financials.subtotalMinor), pageWidth - margin, totalsY + 4, { align: "right" });
  totalsY += rowH;

  // Discount (if any)
  if (data.financials.discountMinor > 0) {
    doc.setTextColor(successGreen[0], successGreen[1], successGreen[2]);
    doc.text("Discount Applied:", summaryX, totalsY + 4);
    doc.text(`- ${formatPKRMinor(data.financials.discountMinor)}`, pageWidth - margin, totalsY + 4, {
      align: "right",
    });
    totalsY += rowH;
  }

  // Additional Charges / Travel (if any)
  if (data.financials.additionalChargesMinor && data.financials.additionalChargesMinor > 0) {
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text("Additional Setup / Travel:", summaryX, totalsY + 4);
    doc.text(
      `+ ${formatPKRMinor(data.financials.additionalChargesMinor)}`,
      pageWidth - margin,
      totalsY + 4,
      { align: "right" }
    );
    totalsY += rowH;
  }

  // Tax (if configured)
  if (data.financials.taxMinor > 0) {
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text("Tax / Surcharge:", summaryX, totalsY + 4);
    doc.text(formatPKRMinor(data.financials.taxMinor), pageWidth - margin, totalsY + 4, { align: "right" });
    totalsY += rowH;
  }

  // Divider
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.line(summaryX, totalsY + 1, pageWidth - margin, totalsY + 1);
  totalsY += 3;

  // Grand Total Box
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.roundedRect(summaryX, totalsY, summaryBoxWidth, 9, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("TOTAL AMOUNT:", summaryX + 4, totalsY + 6);
  doc.text(formatPKRMinor(data.financials.totalAmountMinor), pageWidth - margin - 4, totalsY + 6, {
    align: "right",
  });
  totalsY += 12;

  // Amount Paid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(successGreen[0], successGreen[1], successGreen[2]);
  doc.text("Amount Paid:", summaryX, totalsY + 3);
  doc.text(formatPKRMinor(data.financials.amountPaidMinor), pageWidth - margin, totalsY + 3, {
    align: "right",
  });
  totalsY += 6;

  // Outstanding Balance Due
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(
    data.financials.balanceDueMinor > 0 ? alertRose[0] : darkSlate[0],
    data.financials.balanceDueMinor > 0 ? alertRose[1] : darkSlate[1],
    data.financials.balanceDueMinor > 0 ? alertRose[2] : darkSlate[2]
  );
  doc.text("Remaining Balance Due:", summaryX, totalsY + 3);
  doc.text(formatPKRMinor(data.financials.balanceDueMinor), pageWidth - margin, totalsY + 3, {
    align: "right",
  });

  currentY = Math.max(currentY + 48, totalsY + 10);

  // 6. PAYMENT HISTORY TABLE (If any verified/recorded payments exist)
  if (data.payments && data.payments.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text("RECORDED PAYMENTS HISTORY", margin, currentY);
    currentY += 2;

    const paymentRows = data.payments.map((p, idx) => [
      `PAY-${idx + 1}`,
      p.paidAt ? format(new Date(p.paidAt), "dd MMM yyyy") : "Pending",
      p.paymentMethod.replace(/_/g, " "),
      p.providerRef || "Direct Bank Transfer",
      formatPKRMinor(p.amountMinor),
      p.status.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["ID", "DATE", "METHOD", "REFERENCE", "AMOUNT", "STATUS"]],
      body: paymentRows,
      theme: "plain",
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [51, 65, 85],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [248, 246, 240],
        textColor: [10, 25, 47],
        fontStyle: "bold",
      },
      columnStyles: {
        4: { halign: "right", fontStyle: "bold" },
        5: { halign: "center" },
      },
      margin: { left: margin, right: margin },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 6;
  }

  // 7. FOOTER & THANK YOU
  const footerY = pageHeight - 16;
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text("Thank you for choosing AR Events Co. to celebrate your milestone!", pageWidth / 2, footerY, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(
    `AR Events Co. • ${data.businessSettings?.website || "areventsco.com"} • ${data.businessSettings?.phone || "+92 300 8555123"} • Page 1 of 1`,
    pageWidth / 2,
    footerY + 4.5,
    { align: "center" }
  );

  return doc;
}
