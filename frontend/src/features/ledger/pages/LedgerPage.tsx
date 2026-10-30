import React, { useState, useEffect } from "react";
import { Plus, Wallet, Building2, ArrowDownLeft, ArrowUpRight, BookOpen } from "lucide-react";
import { MetricCard } from "../../../components/common/MetricCard";
import { PaymentVoucherModal } from "../components/PaymentVoucherModal";
import {
  ledgerService,
  LedgerSummary,
  CreateVoucherPayload,
} from "../services/ledgerService";
import { LedgerEntry } from "../../../types";
import { formatCurrency, formatDate, formatTime } from "../../../lib/formatters";

export const LedgerPage: React.FC = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedAccount]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ents, sum] = await Promise.all([
        ledgerService.getEntries(selectedAccount),
        ledgerService.getSummary(),
      ]);
      setEntries(ents);
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load ledger data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVoucher = async (payload: CreateVoucherPayload) => {
    await ledgerService.createVoucher(payload);
    loadData();
  };

  const accountFilters = [
    { id: "All", label: "All Journal Entries" },
    { id: "CASH", label: "Cash Drawer" },
    { id: "BANK", label: "Bank Account" },
    { id: "ACCOUNTS_RECEIVABLE", label: "Receivables (Udhar)" },
    { id: "ACCOUNTS_PAYABLE", label: "Payables (Suppliers)" },
    { id: "REVENUE", label: "Sales Revenue" },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Balances Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Till Drawer Cash on Hand"
          value={formatCurrency(summary?.cash_in_drawer || 45280)}
          icon={Wallet}
          subtitle="Physical cash in register"
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <MetricCard
          title="Operating Bank Balance"
          value={formatCurrency(summary?.bank_balance || 382400)}
          icon={Building2}
          subtitle="HDFC Current Account"
          iconBgColor="bg-primary-container"
          iconColor="text-white"
        />

        <MetricCard
          title="Accounts Receivable (Udhar)"
          value={formatCurrency(summary?.total_receivables || 489200)}
          icon={ArrowDownLeft}
          subtitle="Owed by retail shops"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-800"
        />

        <MetricCard
          title="Accounts Payable"
          value={formatCurrency(summary?.total_payables || 257500)}
          icon={ArrowUpRight}
          subtitle="Owed to stock distributors"
          iconBgColor="bg-secondary-container"
          iconColor="text-on-secondary-fixed"
        />
      </div>

      {/* Toolbar & Account Tabs */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {accountFilters.map((af) => (
            <button
              key={af.id}
              type="button"
              onClick={() => setSelectedAccount(af.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedAccount === af.id
                  ? "bg-primary-container text-white border-primary"
                  : "bg-surface-container-low text-slate-700 border-slate-200/60 hover:bg-surface-container"
              }`}
            >
              {af.label}
            </button>
          ))}
        </div>

        {/* New Voucher Button */}
        <button
          type="button"
          onClick={() => setIsVoucherModalOpen(true)}
          className="h-9 px-4 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Voucher</span>
        </button>
      </div>

      {/* Double-Entry Ledger Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-medium">Entry #</th>
                <th className="py-3 px-4 font-medium">Date & Time</th>
                <th className="py-3 px-4 font-medium">Reference Type</th>
                <th className="py-3 px-4 font-medium">Account</th>
                <th className="py-3 px-4 font-medium">Particulars</th>
                <th className="py-3 px-4 font-medium text-right">Debit (+) In</th>
                <th className="py-3 px-4 font-medium text-right">Credit (-) Out</th>
                <th className="py-3 px-4 font-medium text-center">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary text-sm">
                    No transactions recorded for the selected account tier.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                      {entry.entry_number}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      <div>{formatDate(entry.transaction_date)}</div>
                      <div className="text-[10px] text-slate-400">
                        {formatTime(entry.transaction_date)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                        {entry.reference_type}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs font-medium text-slate-700">
                      {entry.account_type}
                    </td>

                    <td className="py-3 px-4 text-xs font-medium text-slate-900 max-w-xs truncate">
                      {entry.description}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-xs">
                      {entry.debit_amount > 0 ? (
                        <span className="text-emerald-700 font-bold">
                          + {formatCurrency(entry.debit_amount)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-xs">
                      {entry.credit_amount > 0 ? (
                        <span className="text-rose-700 font-bold">
                          - {formatCurrency(entry.credit_amount)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600">
                      {entry.payment_mode}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Voucher Modal */}
      <PaymentVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSubmit={handleCreateVoucher}
      />
    </div>
  );
};
