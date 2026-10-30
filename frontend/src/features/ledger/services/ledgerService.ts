import { apiClient } from "../../../services/api/apiClient";
import { LedgerEntry } from "../../../types";

export interface LedgerSummary {
  cash_in_drawer: number;
  bank_balance: number;
  total_receivables: number;
  total_payables: number;
}

export interface CreateVoucherPayload {
  reference_type: string;
  reference_id?: string;
  account_type: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
  payment_mode: string;
}

export const ledgerService = {
  getEntries: async (accountType?: string, referenceType?: string): Promise<LedgerEntry[]> => {
    return apiClient.get<LedgerEntry[]>("/ledger", {
      account_type: accountType !== "All" ? accountType : undefined,
      reference_type: referenceType !== "All" ? referenceType : undefined,
    });
  },

  getSummary: async (): Promise<LedgerSummary> => {
    return apiClient.get<LedgerSummary>("/ledger/summary");
  },

  createVoucher: async (payload: CreateVoucherPayload): Promise<LedgerEntry> => {
    return apiClient.post<LedgerEntry>("/ledger", payload);
  },
};
