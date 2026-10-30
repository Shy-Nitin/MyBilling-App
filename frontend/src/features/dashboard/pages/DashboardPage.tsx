import React, { useState, useEffect } from "react";
import { KpiMetricGrid } from "../components/KpiMetricGrid";
import { SalesPulseChart } from "../components/SalesPulseChart";
import { RecentInvoicesTable } from "../components/RecentInvoicesTable";
import { QuickActionsBento } from "../components/QuickActionsBento";
import { dashboardService } from "../services/dashboardService";
import { DashboardMetrics } from "../../../types";

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d">("today");

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary-container border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-secondary">Loading register metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Welcome & Controls Band */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-slate-200/60">
        <div className="flex flex-col gap-space-2xs min-w-0">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Welcome back, Boss. Let's see how business is looking.
            </span>
            <span className="px-space-xs py-space-2xs bg-tertiary-container/10 text-tertiary font-label-badge text-label-badge rounded flex items-center gap-1.5 border border-tertiary/20 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              LIVE SYNC
            </span>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Real-time overview of wholesale sales, cash flow, and inventory health.
          </p>
        </div>

        {/* Date Range Tabs */}
        <div className="flex items-center gap-space-sm flex-wrap self-start lg:self-auto">
          <div className="flex items-center bg-surface-container-low p-space-2xs rounded border border-slate-200/60">
            <button
              type="button"
              onClick={() => setDateRange("today")}
              className={`px-space-md py-space-xs rounded font-body-sm text-body-sm transition-colors ${
                dateRange === "today"
                  ? "bg-surface-container-lowest font-semibold text-primary shadow-xs"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateRange("7d")}
              className={`px-space-md py-space-xs rounded font-body-sm text-body-sm transition-colors ${
                dateRange === "7d"
                  ? "bg-surface-container-lowest font-semibold text-primary shadow-xs"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setDateRange("30d")}
              className={`px-space-md py-space-xs rounded font-body-sm text-body-sm transition-colors ${
                dateRange === "30d"
                  ? "bg-surface-container-lowest font-semibold text-primary shadow-xs"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricGrid metrics={metrics} />

      {/* 12-Column Mid Split: Operations Pulse Chart (8) & Quick Actions (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-8">
          <SalesPulseChart data={metrics.sales_pulse} />
        </div>
        <div className="lg:col-span-4">
          <QuickActionsBento onNavigate={onNavigate} />
        </div>
      </div>

      {/* Recent Invoices Table */}
      <RecentInvoicesTable
        invoices={metrics.recent_invoices}
        onViewAll={() => onNavigate("/ledger")}
      />
    </div>
  );
};
