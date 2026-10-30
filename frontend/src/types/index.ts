export interface Product {
  id: number;
  sku: string;
  barcode?: string;
  name: string;
  brand?: string;
  category: string;
  pack_size: string;
  landed_cost: number;
  wholesale_rate: number;
  mrp: number;
  stock_qty: number;
  min_stock_threshold: number;
  unit: string;
  image_url?: string;
  is_active: boolean;
  stock_status?: "SAFE" | "MODERATE" | "LOW" | "DEPLETED";
  created_at: string;
}

export interface Shop {
  id: number;
  name: string;
  owner_name?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  area?: string;
  credit_limit: number;
  current_balance: number;
  tier: string;
  status: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
  city?: string;
  outstanding_balance: number;
  payment_terms_days: number;
  status: string;
}

export interface InvoiceItem {
  id?: number;
  product_id: number;
  sku: string;
  product_name: string;
  pack_size?: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  mrp?: number;
  discount_percent: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  shop_id?: number;
  customer_name: string;
  customer_phone?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  payment_mode: "CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT";
  payment_status: "PAID" | "PARTIAL" | "UNPAID" | "VOID";
  notes?: string;
  created_at: string;
  items?: InvoiceItem[];
}

export interface LedgerEntry {
  id: number;
  entry_number: string;
  transaction_date: string;
  reference_type: string;
  reference_id?: string;
  shop_id?: number;
  supplier_id?: number;
  account_type: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  running_balance: number;
  payment_mode: string;
}

export interface SystemSettings {
  id: number;
  store_name: string;
  tagline: string;
  branch_name: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  currency_symbol: string;
  tax_rate_default: number;
  bill_header: string;
  bill_footer: string;
  terms_and_conditions: string;
  show_logo: boolean;
  show_barcode: boolean;
  show_qr: boolean;
  upi_id: string;
  enable_sound: boolean;
  playful_mode: boolean;
}

export interface DashboardMetrics {
  gross_revenue_today: number;
  gross_revenue_change: number;
  net_profit_today: number;
  net_profit_change: number;
  unsettled_udhar: number;
  unsettled_udhar_count: number;
  daily_velocity_invoices: number;
  daily_velocity_change: number;
  sales_pulse: Array<{
    time: string;
    sales: number;
    cash_in: number;
    is_forecast: boolean;
  }>;
  recent_invoices: Array<{
    id: number;
    invoice_number: string;
    shop_customer: string;
    time: string;
    date: string;
    amount: number;
    status: string;
    payment_mode: string;
  }>;
}
