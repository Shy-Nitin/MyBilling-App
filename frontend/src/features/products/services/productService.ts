import { apiClient } from "../../../services/api/apiClient";
import { Product } from "../../../types";

export interface CreateProductPayload {
  sku: string;
  barcode?: string;
  name: string;
  brand?: string;
  category?: string;
  pack_size?: string;
  landed_cost: number;
  wholesale_rate: number;
  mrp: number;
  stock_qty: number;
  min_stock_threshold: number;
  unit?: string;
}

export const productService = {
  getProducts: async (search?: string, category?: string, status?: string): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products", { search, category, status });
  },

  getValuation: async (): Promise<{
    cost_valuation: number;
    wholesale_valuation: number;
    total_sku_count: number;
    low_stock_count: number;
  }> => {
    return apiClient.get("/products/valuation");
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    return apiClient.post<Product>("/products", payload);
  },

  updateProduct: async (id: number, payload: Partial<CreateProductPayload>): Promise<Product> => {
    return apiClient.put<Product>(`/products/${id}`, payload);
  },

  deleteProduct: async (id: number): Promise<{ message: string }> => {
    return apiClient.delete(`/products/${id}`);
  },
};
