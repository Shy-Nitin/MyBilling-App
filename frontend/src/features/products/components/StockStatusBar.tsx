import React from "react";
import { cn } from "../../../lib/utils";

interface StockStatusBarProps {
  currentStock: number;
  minThreshold: number;
  unit: string;
}

export const StockStatusBar: React.FC<StockStatusBarProps> = ({
  currentStock,
  minThreshold,
  unit,
}) => {
  // Max scale is 2.5x threshold or currentStock, whichever is larger
  const maxRef = Math.max(minThreshold * 2.5, currentStock, 1);
  const percentage = Math.min(100, Math.max(0, (currentStock / maxRef) * 100));

  let barColor = "bg-emerald-600";
  let statusText = "Safe";
  let textColor = "text-emerald-700";

  if (currentStock <= 0) {
    barColor = "bg-rose-600";
    statusText = "Depleted";
    textColor = "text-rose-700";
  } else if (currentStock < minThreshold * 0.5) {
    barColor = "bg-rose-600";
    statusText = "Restock Now";
    textColor = "text-rose-700";
  } else if (currentStock <= minThreshold) {
    barColor = "bg-amber-500";
    statusText = "Moderate";
    textColor = "text-amber-700";
  }

  return (
    <div className="flex flex-col gap-1 w-36">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="font-semibold text-slate-800">
          {currentStock} {unit}
        </span>
        <span className={cn("font-medium", textColor)}>{statusText}</span>
      </div>

      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-[9px] text-slate-400 font-mono">
        Min: {minThreshold} {unit}
      </div>
    </div>
  );
};
