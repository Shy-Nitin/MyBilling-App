import React from "react";
import { FileText, Printer, ExternalLink } from "lucide-react";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatCurrency } from "../../../lib/formatters";
import { apiClient } from "../../../services/api/apiClient";

interface InvoiceRow {
  id: number;
  invoice_number: string;
  shop_customer: string;
  time: string;
  date: string;
  amount: number;
  status: string;
  payment_mode: string;
}

interface RecentInvoicesTableProps {
  invoices: InvoiceRow[];
  onViewAll?: () => void;
}

export const RecentInvoicesTable: React.FC<RecentInvoicesTableProps> = ({ invoices, onViewAll }) => {
  const handlePrintPdf = (invoiceId: number) => {
    const url = apiClient.getPdfUrl(`/billing/invoices/${invoiceId}/pdf`);
    window.open(url, "_blank");
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col justify-between">
      <div className="p-space-lg border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
            Live Register Stream
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Recent Counter Invoices
          </h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:text-indigo-800 transition-colors"
          >
            View Full Ledger →
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200/60">
              <th className="py-2.5 px-4 font-medium">Invoice #</th>
              <th className="py-2.5 px-4 font-medium">Shop / Customer</th>
              <th className="py-2.5 px-4 font-medium">Time</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium text-center">Status</th>
              <th className="py-2.5 px-4 font-medium text-right">Print</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-body-md text-body-md">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary text-sm">
                  No invoices generated yet today. Ready to bill!
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-surface-container-low/60 transition-colors group"
                >
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary">
                      <FileText className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>{inv.invoice_number}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 truncate max-w-[180px]">
                    {inv.shop_customer}
                  </td>
                  <td className="py-2.5 px-4 text-xs font-mono text-secondary">
                    {inv.time}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <StatusBadge status={inv.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handlePrintPdf(inv.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-mono transition-colors shadow-2xs"
                      title="Print PDF Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
