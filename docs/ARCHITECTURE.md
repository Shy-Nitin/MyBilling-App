# MyBilling Architecture Documentation

## 1. System Overview

MyBilling is an enterprise-grade ERP designed for wholesale and high-velocity retail billing operations. It faithfully implements the Google Stitch UI specification (Executive Precision design language) with sub-second operational responsiveness, physical register hotkey ergonomics, double-entry financial journaling, and automated invoice PDF generation.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Vite + React)                │
│  - Tailwind CSS + Lucide Icons + Recharts + Framer Motion   │
│  - Feature-Based Architecture (Billing, Inventory, Udhar...) │
│  - Realtime POS Hotkeys (F1, F2, F4, F6, F8, F9, Alt+K)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API / PDF Stream
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Backend Service                 │
│  - API Layer (/api/v1): Modular REST Endpoints              │
│  - Service Layer: Atomic transactions & Business Logic       │
│  - ReportLab PDF Engine: Realtime Invoice Generation        │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLAlchemy 2.0 ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer (PostgreSQL / SQLite)      │
│  - Invoices & Items with price integrity snapshots          │
│  - Products & Inventory with stock movements                │
│  - Double-Entry General Ledger (Sales, Receipts, Expenses)  │
│  - Shops & Customer Udhar / Credit Ledger                   │
│  - Suppliers & Goods Receipt Notes (GRN)                    │
└─────────────────────────────────────────────────────────────┘
```

## 2. Business Rules & Financial Integrity

1. **Informational MRP vs Active Wholesale Rate**:
   - MRP printed on packaging is purely informational.
   - Line totals are calculated from the agreed wholesale selling rate.
2. **Historical Price Retention**:
   - `InvoiceItem` records historical snapshots of `unit_rate` and `unit_cost` at the moment of billing.
   - Subsequent price alterations in the product catalog never modify prior invoices.
3. **Double-Entry General Ledger**:
   - Every invoice automatically records both sales revenue and receivables / cash drawer inflows.
   - Goods Receipt Notes (GRN) credit accounts payable and debit physical stock.
   - Customer Udhar repayments and supplier disbursements update running account balances and write journal entries.
4. **Realtime Invoice Generation**:
   - ReportLab dynamically generates pixel-perfect PDF bills conforming to the store customization parameters (Header, GSTIN, UPI QR, Barcode, Terms).
