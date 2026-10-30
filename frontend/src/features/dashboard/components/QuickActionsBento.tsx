import React from "react";
import { PlusCircle, Truck, Wallet, LineChart } from "lucide-react";

interface QuickActionsBentoProps {
  onNavigate: (path: string) => void;
}

export const QuickActionsBento: React.FC<QuickActionsBentoProps> = ({ onNavigate }) => {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between">
      <div>
        <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
          Shortcuts & Ergonomics
        </span>
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          Quick Launch Bento
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-space-sm mt-4">
        <button
          type="button"
          onClick={() => onNavigate("/billing")}
          className="p-3 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 text-left transition-all group flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between">
            <PlusCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <kbd className="font-mono text-[10px] bg-white text-indigo-900 font-semibold px-1.5 py-0.5 rounded border border-indigo-200">
              F9
            </kbd>
          </div>
          <div>
            <div className="font-semibold text-xs text-indigo-950">New Sale Bill</div>
            <div className="text-[11px] text-indigo-700">Open POS terminal</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("/purchases")}
          className="p-3 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/60 text-left transition-all group flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between">
            <Truck className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[10px] bg-white text-emerald-900 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
              GRN
            </span>
          </div>
          <div>
            <div className="font-semibold text-xs text-emerald-950">Receive Stock</div>
            <div className="text-[11px] text-emerald-700">Inward supplier bill</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("/shops")}
          className="p-3 rounded-lg bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 text-left transition-all group flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between">
            <Wallet className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[10px] bg-white text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
              UDHAR
            </span>
          </div>
          <div>
            <div className="font-semibold text-xs text-amber-950">Collect Udhar</div>
            <div className="text-[11px] text-amber-700">Recover customer debt</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("/reports")}
          className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-left transition-all group flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between">
            <LineChart className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[10px] bg-white text-slate-800 font-semibold px-1.5 py-0.5 rounded border border-slate-300">
              GST
            </span>
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-900">Profit & Tax</div>
            <div className="text-[11px] text-slate-600">Margins & analytics</div>
          </div>
        </button>
      </div>
    </div>
  );
};
