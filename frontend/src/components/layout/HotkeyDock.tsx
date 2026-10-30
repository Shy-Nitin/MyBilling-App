import React from "react";

interface HotkeyItem {
  key: string;
  label: string;
  action?: () => void;
}

interface HotkeyDockProps {
  hotkeys?: HotkeyItem[];
}

const DEFAULT_HOTKEYS: HotkeyItem[] = [
  { key: "F1", label: "Add Item" },
  { key: "F4", label: "Split Pay" },
  { key: "F6", label: "Barcode Label" },
  { key: "F8", label: "Apply Discount" },
  { key: "F9", label: "Finalize & Print" },
  { key: "Esc", label: "Cancel / Clear" },
];

export const HotkeyDock: React.FC<HotkeyDockProps> = ({ hotkeys = DEFAULT_HOTKEYS }) => {
  return (
    <footer className="fixed bottom-3 right-6 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-3 select-none">
      <div className="flex items-center gap-1 text-[11px] font-mono text-secondary pr-2 border-r border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
        <span className="font-semibold uppercase tracking-wider">Hotkeys</span>
      </div>
      <div className="flex items-center gap-3">
        {hotkeys.map((hk) => (
          <div key={hk.key} className="flex items-center gap-1.5 text-xs text-slate-700">
            <kbd className="font-mono text-[10px] bg-slate-100 text-slate-800 font-semibold px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs">
              {hk.key}
            </kbd>
            <span className="font-medium text-slate-600">{hk.label}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};
