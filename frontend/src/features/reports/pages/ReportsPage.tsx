import React, { useState, useEffect } from "react";
import { ProfitAnalyticsChart } from "../components/ProfitAnalyticsChart";
import { MarginBreakdownTable } from "../components/MarginBreakdownTable";
import { TaxSummaryCard } from "../components/TaxSummaryCard";
import {
  reportService,
  ProfitAnalyticsPoint,
  CategoryMargin,
  TaxSummary,
} from "../services/reportService";

export const ReportsPage: React.FC = () => {
  const [trends, setTrends] = useState<ProfitAnalyticsPoint[]>([]);
  const [margins, setMargins] = useState<CategoryMargin[]>([]);
  const [tax, setTax] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tr, mg, tx] = await Promise.all([
        reportService.getProfitTrends(),
        reportService.getCategoryMargins(),
        reportService.getTaxSummary(),
      ]);
      setTrends(tr);
      setMargins(mg);
      setTax(tx);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* High-Fidelity Multi-Line Analytics Chart from Stitch Specification */}
      <ProfitAnalyticsChart data={trends} />

      {/* 2-Column Split: Category Margins (8) & Tax Summary (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8">
          <MarginBreakdownTable margins={margins} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <TaxSummaryCard tax={tax} />

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70">
            <h4 className="font-semibold text-xs text-slate-900 mb-1">
              Auditor Export Packages
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              One-click consolidated accounting extracts for CA audit.
            </p>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => alert("Exported Tally XML / Prime Package")}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 text-left transition-colors flex justify-between items-center"
              >
                <span>Tally Prime XML Sync</span>
                <span className="font-mono text-[10px] text-slate-400">XML</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Exported Profit & Loss Statement (PDF)")}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 text-left transition-colors flex justify-between items-center"
              >
                <span>Annual P&L Schedule</span>
                <span className="font-mono text-[10px] text-slate-400">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
