import React from "react";
import { formatCurrency } from "../../../lib/formatters";

interface UdharLimitGaugeProps {
  currentBalance: number;
  creditLimit: number;
}

export const UdharLimitGauge: React.FC<UdharLimitGaugeProps> = ({
  currentBalance,
  creditLimit,
}) => {
  const percent = creditLimit > 0 ? Math.min(100, (currentBalance / creditLimit) * 100) : 0;

  let barColor = "bg-emerald-600";
  let badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";

  if (percent > 80) {
    barColor = "bg-rose-600";
    badgeColor = "text-rose-700 bg-rose-50 border-rose-200";
  } else if (percent > 50) {
    barColor = "bg-amber-500";
    badgeColor = "text-amber-700 bg-amber-50 border-amber-200";
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-500 text-[10px] block">Outstanding Balance</span>
          <span className="font-bold text-slate-900 text-sm">
            {formatCurrency(currentBalance)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[10px] block">Limit Authorized</span>
          <span className="font-medium text-slate-600">
            {formatCurrency(creditLimit)}
          </span>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-mono">Credit Utilization</span>
        <span className={`font-mono font-semibold px-1.5 py-0.2 rounded border ${badgeColor}`}>
          {percent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
