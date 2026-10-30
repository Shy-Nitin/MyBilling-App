import React from "react";
import { ReceiptText, TrendingUp, Store, Zap } from "lucide-react";
import { MetricCard } from "../../../components/common/MetricCard";
import { formatCurrency } from "../../../lib/formatters";
import { DashboardMetrics } from "../../../types";

interface KpiMetricGridProps {
  metrics: DashboardMetrics;
}

export const KpiMetricGrid: React.FC<KpiMetricGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg">
      <MetricCard
        title="Gross Revenue (Today)"
        value={formatCurrency(metrics.gross_revenue_today)}
        icon={ReceiptText}
        change={metrics.gross_revenue_change}
        changeLabel="vs yesterday"
        iconBgColor="bg-primary-container"
        iconColor="text-white"
      />

      <MetricCard
        title="Net Profit (21.6% Margin)"
        value={formatCurrency(metrics.net_profit_today)}
        icon={TrendingUp}
        change={metrics.net_profit_change}
        changeLabel="vs prior period"
        iconBgColor="bg-tertiary-container"
        iconColor="text-white"
      />

      <MetricCard
        title="Unsettled Udhar (Receivables)"
        value={formatCurrency(metrics.unsettled_udhar)}
        icon={Store}
        badge={`${metrics.unsettled_udhar_count} Shops Outstanding`}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-800"
      />

      <MetricCard
        title="Daily Velocity"
        value={`${metrics.daily_velocity_invoices} Bills`}
        icon={Zap}
        change={metrics.daily_velocity_change}
        changeLabel="vs average velocity"
        iconBgColor="bg-secondary-container"
        iconColor="text-on-secondary-fixed"
      />
    </div>
  );
};
