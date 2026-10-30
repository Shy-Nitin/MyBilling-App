import { apiClient } from "../../../services/api/apiClient";
import { Invoice, Product, Shop } from "../../../types";

export interface CreateInvoicePayload {
  shop_id?: number | null;
  customer_name: string;
  customer_phone?: string;
  payment_mode: "CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT";
  paid_amount?: number;
  notes?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_rate: number;
    discount_percent: number;
    tax_rate: number;
  }>;
}

export const billingService = {
  createInvoice: async (payload: CreateInvoicePayload): Promise<Invoice> => {
    return apiClient.post<Invoice>("/billing/invoices", payload);
  },

  getInvoices: async (limit: number = 50, shopId?: number): Promise<Invoice[]> => {
    return apiClient.get<Invoice[]>("/billing/invoices", { limit, shop_id: shopId });
  },

  getInvoiceById: async (id: number): Promise<Invoice> => {
    return apiClient.get<Invoice>(`/billing/invoices/${id}`);
  },

  getProducts: async (search?: string, category?: string): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products", { search, category });
  },

  getShops: async (): Promise<Shop[]> => {
    return apiClient.get<Shop[]>("/shops");
  },
};
