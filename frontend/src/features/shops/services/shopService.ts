import { apiClient } from "../../../services/api/apiClient";
import { Shop } from "../../../types";

export interface CreateShopPayload {
  name: string;
  owner_name?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  area?: string;
  credit_limit: number;
  tier?: string;
}

export const shopService = {
  getShops: async (search?: string): Promise<Shop[]> => {
    return apiClient.get<Shop[]>("/shops", { search });
  },

  createShop: async (payload: CreateShopPayload): Promise<Shop> => {
    return apiClient.post<Shop>("/shops", payload);
  },

  collectPayment: async (
    shopId: number,
    amount: number,
    paymentMode: string = "CASH",
    notes?: string
  ): Promise<{ message: string; new_balance: number }> => {
    return apiClient.post(`/shops/${shopId}/collect-payment`, {
      amount,
      payment_mode: paymentMode,
      notes,
    });
  },
};
