# MyBilling Database Schema

The database models are designed using SQLAlchemy 2.0 with full support for PostgreSQL and SQLite.

## Entity Relationship Overview

```
[shops] ──────────┐ (1:N)
                  ▼
[products] ◄── [invoice_items] ──► [invoices]
      ▲                                   │
      │ (1:N)                             │ (1:1/1:N)
      │                                   ▼
[purchase_items] ──► [purchase_orders] ──► [ledger_entries]
                             ▲                    ▲
                             │ (1:N)              │
                        [suppliers] ──────────────┘
```

## Tables & Columns

### 1. `products`
- `id` (Integer, Primary Key)
- `sku` (String 50, Unique, Indexed)
- `barcode` (String 50, Indexed)
- `name` (String 200, Not Null)
- `brand` (String 100)
- `category` (String 100, Indexed)
- `pack_size` (String 50)
- `landed_cost` (Float) — Historical purchase landed cost
- `wholesale_rate` (Float) — Current default selling rate
- `mrp` (Float) — Maximum Retail Price (Informational)
- `stock_qty` (Float) — Physical on-hand stock
- `min_stock_threshold` (Float) — Reorder notification point
- `unit` (String 20) — PCS, BAG, TIN, BOX, CASE, etc.
- `is_active` (Boolean)

### 2. `shops` (Udhar Accounts)
- `id` (Integer, Primary Key)
- `name` (String 200)
- `owner_name` (String 100)
- `phone` (String 20, Indexed)
- `gstin` (String 30)
- `address` (String 300)
- `area` (String 100)
- `credit_limit` (Float) — Maximum allowable Udhar balance
- `current_balance` (Float) — Outstanding receivables
- `tier` (String 20) — Standard, Regular, VIP Wholesaler
- `status` (String 20) — Active, Warning, Blocked

### 3. `suppliers`
- `id` (Integer, Primary Key)
- `name` (String 200)
- `contact_person` (String 100)
- `phone` (String 20)
- `email` (String 100)
- `gstin` (String 30)
- `address` (String 300)
- `city` (String 100)
- `outstanding_balance` (Float) — Accounts payable
- `payment_terms_days` (Integer)

### 4. `invoices`
- `id` (Integer, Primary Key)
- `invoice_number` (String 50, Unique, Indexed)
- `shop_id` (ForeignKey `shops.id`, Nullable)
- `customer_name` (String 150)
- `customer_phone` (String 20)
- `subtotal` (Float)
- `discount_amount` (Float)
- `tax_amount` (Float)
- `total_amount` (Float)
- `paid_amount` (Float)
- `balance_amount` (Float)
- `payment_mode` (String 30) — CASH, UPI, UDHAR_CREDIT, SPLIT
- `payment_status` (String 30) — PAID, PARTIAL, UNPAID
- `notes` (Text)
- `created_at` (DateTime)

### 5. `invoice_items`
- `id` (Integer, Primary Key)
- `invoice_id` (ForeignKey `invoices.id`)
- `product_id` (ForeignKey `products.id`)
- `sku` (String 50)
- `product_name` (String 200)
- `pack_size` (String 50)
- `quantity` (Float)
- `unit` (String 20)
- `unit_rate` (Float) — Snapshot of selling rate at sale moment
- `unit_cost` (Float) — Snapshot of landed cost at sale moment
- `mrp` (Float)
- `discount_percent` (Float)
- `discount_amount` (Float)
- `tax_rate` (Float)
- `tax_amount` (Float)
- `total_amount` (Float)

### 6. `purchase_orders` (GRN)
- `id` (Integer, Primary Key)
- `po_number` (String 50, Unique, Indexed)
- `supplier_id` (ForeignKey `suppliers.id`)
- `vendor_invoice_no` (String 100)
- `order_date` (DateTime)
- `received_date` (DateTime)
- `subtotal` (Float)
- `tax_amount` (Float)
- `total_amount` (Float)
- `paid_amount` (Float)
- `balance_amount` (Float)
- `status` (String 30) — RECEIVED, PENDING, CANCELLED

### 7. `ledger_entries` (Double-Entry Journal)
- `id` (Integer, Primary Key)
- `entry_number` (String 50, Unique, Indexed)
- `transaction_date` (DateTime, Indexed)
- `reference_type` (String 50) — SALE_INVOICE, PURCHASE_GRN, PAYMENT_RECEIVED, SUPPLIER_PAYMENT, EXPENSE
- `reference_id` (String 50)
- `shop_id` (ForeignKey `shops.id`, Nullable)
- `supplier_id` (ForeignKey `suppliers.id`, Nullable)
- `account_type` (String 50) — CASH, BANK, ACCOUNTS_RECEIVABLE, ACCOUNTS_PAYABLE, REVENUE
- `description` (String 300)
- `debit_amount` (Float)
- `credit_amount` (Float)
- `running_balance` (Float)
- `payment_mode` (String 30)

### 8. `system_settings`
- Store identity, GSTIN, branch, address, contact, bill header, bill footer, terms and conditions, barcode/logo/QR visibility flags.
