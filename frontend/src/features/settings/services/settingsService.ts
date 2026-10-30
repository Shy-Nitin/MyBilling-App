import { apiClient } from "../../../services/api/apiClient";
import { SystemSettings } from "../../../types";

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    return apiClient.get<SystemSettings>("/settings");
  },

  updateSettings: async (payload: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiClient.put<SystemSettings>("/settings", payload);
  },
};
