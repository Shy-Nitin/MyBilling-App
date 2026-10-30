# MyBilling — Modern POS & Wholesale Billing ERP

A complete, full-stack, enterprise-grade Billing & POS ERP converted directly from Google Stitch designs (Executive Precision design language).

## 🚀 Key Features

1. **Executive Dashboard (`01_Dashboard`)**:
   - Live revenue, net margins (21.6%), customer Udhar receivables, and daily register velocity.
   - Dual-color Hourly Operations Pulse chart with cash collection tracking.
   - Live counter invoices stream with instant PDF printing.
   - Ergonomic quick launch bento.

2. **Dual-Pane Billing Terminal (`11_Billing_POS`)**:
   - Realtime catalog search by barcode/SKU with category filtering.
   - Live editable line items (selling price overrides, discount %, quantity steppers).
   - 4-way payment selector: Cash `[F2]`, UPI QR, Udhar Credit, Split Pay `[F4]`.
   - Realtime stock decrement & double-entry journal posting.
   - Generated ReportLab PDF invoice printing & WhatsApp bill sharing.

3. **Products & Inventory (`14_Products_and_Inventory` & `09_Products_1_Add_Product`)**:
   - Wholesale vs landed cost inventory valuation tracking.
   - Color-coded stock level progress bars (Safe, Moderate, Low, Depleted).
   - Sticky bulk selection toolstrip (`[F6]` Barcode labels, `[Alt+U]` Bulk price update).
   - Comprehensive Add Product modal with automatic SKU generator.

4. **Shops & Udhar Ledger (`10_Shops_and_Udhar`)**:
   - Registered credit clients with authorized credit limits and risk gauges.
   - Quick Udhar debt collection modal with instant journal entries.

5. **Purchases & Suppliers (`12_Purchases_and_Suppliers`, `06`, `07`, `08`)**:
   - Inward Goods Receipt Notes (GRN) with itemized tax and stock incrementing.
   - Vendor directory with payment credit terms.
   - Record Supplier Payment remittance modal with UTR tracking.

6. **Payments & Double-Entry Ledger (`05_Payments_and_Ledgers`)**:
   - Double-entry accounting stream for cash, bank, receivables, and payables.
   - Till drawer cash balance vs operating bank balance reconciliation.
   - Manual voucher entry for operational expenses and deposits.

7. **Reports & Profit Engine (`13_Reports_and_Profits` & `03_Analytics_Chart_Spec`)**:
   - Multi-line comparison graph (Gross Revenue vs Net Profit vs Prior benchmark).
   - Department gross margin breakdown.
   - GST liability ledger (CGST, SGST, Taxable).

8. **Settings & Bill Customization (`02_Settings_Governance` & `04_Bill_Customization`)**:
   - Live paper bill preview studio with customizable store details, logo, barcode, QR, and terms.
   - Audio feedback and playful microcopy toggles.

---

## 🛠️ Quick Start

### 1. Start Backend API Server
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API runs at `http://localhost:8000` (Docs: `http://localhost:8000/docs`)*

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 📚 Documentation
- [Architecture & Business Rules](docs/ARCHITECTURE.md)
- [Folder Structure](docs/FOLDER_STRUCTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Setup & Configuration](docs/SETUP.md)
