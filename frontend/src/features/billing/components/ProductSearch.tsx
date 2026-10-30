import React from "react";
import { Search } from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  value,
  onChange,
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-col gap-space-sm">
      {/* Search Input */}
      <div className="flex items-center w-full bg-surface-container-low rounded px-space-md py-space-xs border border-slate-200/60 focus-within:border-primary/50 focus-within:bg-white transition-all shadow-xs">
        <Search className="w-4 h-4 text-on-surface-variant mr-space-sm shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Scan barcode [F1] or type SKU / item name..."
          className="w-full bg-transparent border-0 p-0 text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
        />
        <kbd className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded shadow-2xs select-none">
          F1
        </kbd>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors border ${
                isSelected
                  ? "bg-primary-container text-white border-primary shadow-xs"
                  : "bg-surface-container-low hover:bg-surface-container text-slate-700 border-slate-200/50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
