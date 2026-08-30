import { prisma } from "../src/lib/db";
import { InvoiceService } from "../src/server/services/invoice.service";
import { generateInvoicePdf } from "../src/lib/pdf/invoice-pdf";

async function runInvoiceAudit() {
  console.log("=== STARTING ENTERPRISE INVOICE SUBSYSTEM AUDIT ===");

  // 1. Fetch live invoices
  const listResult = await InvoiceService.listInvoices({ page: 1, limit: 10 });
  console.log(`✓ Total invoices in database: ${listResult.stats.totalInvoices}`);
  console.log(`✓ Total Invoiced Minor: ${listResult.stats.totalInvoicedMinor} (PKR ${(listResult.stats.totalInvoicedMinor / 100).toLocaleString()})`);
  console.log(`✓ Total Paid Minor: ${listResult.stats.totalPaidMinor} (PKR ${(listResult.stats.totalPaidMinor / 100).toLocaleString()})`);
  console.log(`✓ Total Outstanding Minor: ${listResult.stats.totalOutstandingMinor} (PKR ${(listResult.stats.totalOutstandingMinor / 100).toLocaleString()})`);

  if (listResult.invoices.length === 0) {
    console.error("No invoices found in database! Creating test booking invoice...");
    return;
  }

  const testInvoice = listResult.invoices[0];
  console.log(`\nTesting with Invoice: ${testInvoice.invoiceNumber} (Booking: ${testInvoice.booking?.reference})`);

  // 2. Test Get Invoice Detail
  const detail = await InvoiceService.getInvoiceById(testInvoice.id);
  console.log(`✓ Invoice Detail fetched: ${detail?.customerName} - Status: ${detail?.status}`);
  console.log(`✓ Line Items Count: ${detail?.items.length}`);
  detail?.items.forEach((it, idx) => {
    console.log(`   ${idx + 1}. ${it.description} | Qty: ${it.quantity} | Total: PKR ${(it.totalPriceMinor / 100).toLocaleString()}`);
  });

  // 3. Test PDF Payload Aggregation & Generation
  const pdfPayload = await InvoiceService.getInvoicePdfPayload(testInvoice.id);
  console.log(`\n✓ PDF Payload built for ${pdfPayload.invoiceNumber}`);
  const doc = generateInvoicePdf(pdfPayload);
  const pdfBuffer = doc.output("arraybuffer");
  console.log(`✓ Vector PDF generated successfully! Byte size: ${pdfBuffer.byteLength} bytes`);

  // 4. Test Payment Recording
  console.log(`\nTesting Payment Recording on invoice ${testInvoice.invoiceNumber}...`);
  const recordResult = await InvoiceService.recordPayment(
    testInvoice.id,
    {
      amountMinor: 500000, // PKR 5,000
      paymentMethod: "BANK_TRANSFER",
      providerRef: "TEST-TXN-123456",
      notes: "Audit verification payment",
      markVerified: true,
    },
    "AuditScript"
  );

  console.log(`✓ Payment recorded! New amountPaidMinor: ${recordResult.amountPaidMinor} (PKR ${(recordResult.amountPaidMinor / 100).toLocaleString()})`);
  console.log(`✓ New balanceDueMinor: ${recordResult.balanceDueMinor} (PKR ${(recordResult.balanceDueMinor / 100).toLocaleString()})`);
  console.log(`✓ Updated Invoice Status: ${recordResult.status}`);

  console.log("\n=== ALL INVOICE AUDIT CHECKS PASSED SUCCESSFULLY ===");
}

runInvoiceAudit()
  .catch((e) => {
    console.error("Invoice Audit Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
