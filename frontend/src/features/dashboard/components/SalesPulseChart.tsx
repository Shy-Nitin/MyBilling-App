import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "../../../lib/formatters";

interface SalesPulseChartProps {
  data: Array<{
    time: string;
    sales: number;
    cash_in: number;
    is_forecast: boolean;
  }>;
}

export const SalesPulseChart: React.FC<SalesPulseChartProps> = ({ data }) => {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
            Hourly Operations Pulse
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Sales & Collection Velocity
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-primary-container inline-block" />
            <span className="text-slate-700 font-medium">Billed Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#10b981] inline-block" />
            <span className="text-slate-700 font-medium">Cash Collected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
            <span className="text-slate-400 font-medium">Projected (Forecast)</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), ""]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "Geist",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="sales" name="Billed Sales" fill="#4338ca" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cash_in" name="Cash Collected" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
