import React from "react";
import { CategoryMargin } from "../services/reportService";
import { formatCurrency } from "../../../lib/formatters";

interface MarginBreakdownTableProps {
  margins: CategoryMargin[];
}

export const MarginBreakdownTable: React.FC<MarginBreakdownTableProps> = ({ margins }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/70 overflow-hidden flex flex-col justify-between">
      <div className="p-space-md border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
            Category Profitability
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-slate-900">
            Gross Margin by Department
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
              <th className="py-2.5 px-3">Product Category</th>
              <th className="py-2.5 px-3 text-right">Revenue</th>
              <th className="py-2.5 px-3 text-right">COGS Cost</th>
              <th className="py-2.5 px-3 text-right">Gross Profit</th>
              <th className="py-2.5 px-3 text-right">Margin %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
            {margins.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-800 text-xs">
                  {m.category}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-900">
                  {formatCurrency(m.revenue)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-500">
                  {formatCurrency(m.cogs)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-xs font-bold text-emerald-700">
                  {formatCurrency(m.gross_profit)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-xs font-bold text-primary">
                  {m.margin_percent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
