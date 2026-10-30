import { apiClient } from "../../../services/api/apiClient";
import { Supplier, Product } from "../../../types";

export interface PurchaseOrderData {
  id: number;
  po_number: string;
  supplier_id: number;
  vendor_invoice_no?: string;
  order_date: string;
  received_date?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: string;
  items: any[];
}

export interface CreateGrnPayload {
  supplier_id: number;
  vendor_invoice_no?: string;
  paid_amount: number;
  notes?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_cost: number;
    tax_rate: number;
  }>;
}

export interface CreateSupplierPayload {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
  city?: string;
  payment_terms_days?: number;
}

export const purchaseService = {
  getSuppliers: async (search?: string): Promise<Supplier[]> => {
    return apiClient.get<Supplier[]>("/purchases/suppliers", { search });
  },

  createSupplier: async (payload: CreateSupplierPayload): Promise<Supplier> => {
    return apiClient.post<Supplier>("/purchases/suppliers", payload);
  },

  getPurchases: async (supplierId?: number): Promise<PurchaseOrderData[]> => {
    return apiClient.get<PurchaseOrderData[]>("/purchases", { supplier_id: supplierId });
  },

  createPurchaseOrder: async (payload: CreateGrnPayload): Promise<PurchaseOrderData> => {
    return apiClient.post<PurchaseOrderData>("/purchases", payload);
  },

  paySupplier: async (
    supplierId: number,
    amount: number,
    paymentMode: string = "BANK",
    notes?: string
  ): Promise<{ message: string; new_balance: number }> => {
    return apiClient.post("/purchases/pay-supplier", {
      supplier_id: supplierId,
      amount,
      payment_mode: paymentMode,
      notes,
    });
  },

  getProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products");
  },
};
