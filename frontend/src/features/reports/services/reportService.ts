import { apiClient } from "../../../services/api/apiClient";

export interface ProfitAnalyticsPoint {
  label: string;
  gross_revenue: number;
  net_profit: number;
  prior_revenue: number;
  margin_percent: number;
}

export interface CategoryMargin {
  category: string;
  items_sold: number;
  revenue: number;
  cogs: number;
  gross_profit: number;
  margin_percent: number;
}

export interface TaxSummary {
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax: number;
}

export const reportService = {
  getProfitTrends: async (): Promise<ProfitAnalyticsPoint[]> => {
    return apiClient.get<ProfitAnalyticsPoint[]>("/reports/profit-trends");
  },

  getCategoryMargins: async (): Promise<CategoryMargin[]> => {
    return apiClient.get<CategoryMargin[]>("/reports/category-margins");
  },

  getTaxSummary: async (): Promise<TaxSummary> => {
    return apiClient.get<TaxSummary>("/reports/tax-summary");
  },
};
