import React from "react";
import { Banknote, QrCode, Store, Layers } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMode: "CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT";
  onSelectMode: (mode: "CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT") => void;
  hasShopSelected: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMode,
  onSelectMode,
  hasShopSelected,
}) => {
  const modes: Array<{
    id: "CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT";
    label: string;
    icon: React.ElementType;
    requiresShop?: boolean;
  }> = [
    { id: "CASH", label: "Cash [F2]", icon: Banknote },
    { id: "UPI", label: "UPI / QR", icon: QrCode },
    { id: "UDHAR_CREDIT", label: "Udhar Credit", icon: Store, requiresShop: true },
    { id: "SPLIT", label: "Split Pay [F4]", icon: Layers },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
        Payment Mode
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {modes.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMode === m.id;
          const isDisabled = m.requiresShop && !hasShopSelected;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              disabled={isDisabled}
              title={isDisabled ? "Please select a registered Shop for Udhar" : undefined}
              className={`p-2 rounded-lg border text-left flex flex-col justify-between h-14 transition-all ${
                isSelected
                  ? "bg-primary-container text-white border-primary shadow-xs"
                  : isDisabled
                  ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                  : "bg-surface-container-low hover:bg-surface-container text-slate-800 border-slate-200/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                {m.requiresShop && (
                  <span className="text-[9px] font-mono px-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Udhar
                  </span>
                )}
              </div>
              <span className="font-semibold text-[11px] truncate">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
