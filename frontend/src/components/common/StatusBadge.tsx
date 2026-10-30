import React from "react";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = "md" }) => {
  const normalized = status.toUpperCase();

  let colorClasses = "bg-secondary-container text-on-secondary-fixed border-secondary/20";
  let dotColor = "bg-secondary";

  if (["PAID", "ACTIVE", "SAFE", "RECEIVED"].includes(normalized)) {
    colorClasses = "bg-tertiary-container/10 text-tertiary border-tertiary/20";
    dotColor = "bg-tertiary";
  } else if (["PARTIAL", "MODERATE", "WARNING", "PENDING"].includes(normalized)) {
    colorClasses = "bg-amber-50 text-amber-800 border-amber-200";
    dotColor = "bg-amber-600";
  } else if (["UNPAID", "OVERDUE", "LOW", "DEPLETED", "BLOCKED", "RESTOCK NOW"].includes(normalized)) {
    colorClasses = "bg-error-container/30 text-error border-error/30";
    dotColor = "bg-error";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-label-badge text-label-badge font-semibold uppercase tracking-wider border",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        colorClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      {status}
    </span>
  );
};
