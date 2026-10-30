import React from "react";
import { Barcode, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkSelectionBarProps {
  selectedCount: number;
  onClear: () => void;
  onPrintLabels: () => void;
  onBulkPriceUpdate: () => void;
}

export const BulkSelectionBar: React.FC<BulkSelectionBarProps> = ({
  selectedCount,
  onClear,
  onPrintLabels,
  onBulkPriceUpdate,
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#213145] text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-4 select-none"
        >
          <div className="flex items-center gap-2 border-r border-slate-600 pr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs font-semibold">
              {selectedCount} Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrintLabels}
              className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Barcode className="w-3.5 h-3.5" />
              <span>Barcode Labels</span>
              <kbd className="font-mono text-[10px] bg-white/20 px-1 rounded">F6</kbd>
            </button>

            <button
              type="button"
              onClick={onBulkPriceUpdate}
              className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Bulk Price Update</span>
              <kbd className="font-mono text-[10px] bg-white/20 px-1 rounded">Alt+U</kbd>
            </button>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            title="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
