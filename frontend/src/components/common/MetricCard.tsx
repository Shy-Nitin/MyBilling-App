import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  badge?: string;
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = "vs yesterday",
  badge,
  subtitle,
  iconBgColor = "bg-primary-fixed/40",
  iconColor = "text-primary",
  className,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        "bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
            {title}
          </span>
          <div className="font-headline-xl text-headline-xl font-mono text-on-surface tracking-tight mt-1">
            {value}
          </div>
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded flex items-center justify-center shrink-0 shadow-sm",
            iconBgColor,
            iconColor
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
        {change !== undefined ? (
          <div className="flex items-center gap-1 font-body-sm text-body-sm">
            <span
              className={cn(
                "flex items-center gap-0.5 font-semibold",
                isPositive ? "text-tertiary" : "text-error"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-secondary">{changeLabel}</span>
          </div>
        ) : badge ? (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded border border-amber-200">
            {badge}
          </span>
        ) : subtitle ? (
          <span className="text-secondary font-body-sm text-body-sm">{subtitle}</span>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
