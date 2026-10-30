import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  className?: string;
  size?: "sm" | "md";
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99999,
  step = 1,
  onChange,
  className,
  size = "md",
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center bg-surface-container-low rounded p-0.5 border border-slate-200/80 shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          "rounded flex items-center justify-center text-slate-700 hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
          size === "sm" ? "w-5 h-5" : "w-6 h-6"
        )}
      >
        <Minus className="w-3 h-3" />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleChange}
        className={cn(
          "text-center font-mono font-semibold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0",
          size === "sm" ? "w-8 text-[11px]" : "w-10 text-[13px]"
        )}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          "rounded flex items-center justify-center text-slate-700 hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
          size === "sm" ? "w-5 h-5" : "w-6 h-6"
        )}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
