import React from "react";
import { Receipt, Download } from "lucide-react";
import { TaxSummary } from "../services/reportService";
import { formatCurrency } from "../../../lib/formatters";

interface TaxSummaryCardProps {
  tax: TaxSummary | null;
}

export const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({ tax }) => {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-slate-900">
              GST Tax Liability Ledger
            </h3>
            <p className="text-[11px] text-slate-500">GSTR-1 & 3B Reconciled</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Downloading GSTR-1 Excel / CSV filing sheet...")}
          className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Export GSTR</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
        <div className="bg-surface-container-low p-2.5 rounded-lg border border-slate-200/50">
          <span className="text-slate-400 text-[10px] block">Taxable Turn-over</span>
          <span className="font-bold text-slate-800">{formatCurrency(tax?.taxable_amount || 0)}</span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg border border-slate-200/50">
          <span className="text-slate-400 text-[10px] block">Total GST Due</span>
          <span className="font-bold text-primary">{formatCurrency(tax?.total_tax || 0)}</span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg border border-slate-200/50">
          <span className="text-slate-400 text-[10px] block">CGST (9%)</span>
          <span className="font-semibold text-slate-700">{formatCurrency(tax?.cgst_amount || 0)}</span>
        </div>
        <div className="bg-surface-container-low p-2.5 rounded-lg border border-slate-200/50">
          <span className="text-slate-400 text-[10px] block">SGST (9%)</span>
          <span className="font-semibold text-slate-700">{formatCurrency(tax?.sgst_amount || 0)}</span>
        </div>
      </div>
    </div>
  );
};
