import { apiClient } from "../../../services/api/apiClient";
import { DashboardMetrics } from "../../../types";

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    return apiClient.get<DashboardMetrics>("/dashboard/metrics");
  },
};
