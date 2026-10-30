import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Product } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";
import { StockStatusBar } from "./StockStatusBar";

interface ProductTableProps {
  products: Product[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}) => {
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/70 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 font-medium min-w-[220px]">Product & SKU Identity</th>
              <th className="py-3 px-3 font-medium min-w-[90px]">Pack Size</th>
              <th className="py-3 px-3 font-medium text-right min-w-[100px]">Landed Cost</th>
              <th className="py-3 px-3 font-medium text-right min-w-[120px]">Wholesale / MRP</th>
              <th className="py-3 px-3 font-medium min-w-[160px]">Stock Status & Reorder</th>
              <th className="py-3 px-3 font-medium text-right min-w-[110px]">Valuation</th>
              <th className="py-3 px-3 font-medium text-center min-w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-secondary text-sm">
                  No inventory products found matching the criteria.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                const valuation = p.wholesale_rate * Math.max(0, p.stock_qty);
                const isDepleted = p.stock_qty <= 0;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-surface-container-low/60 transition-colors ${
                      isSelected ? "bg-indigo-50/40" : ""
                    } ${isDepleted ? "bg-rose-50/20" : ""}`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(p.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-semibold text-xs text-slate-900 leading-snug">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] bg-primary-fixed/40 text-primary font-semibold px-1 py-0.2 rounded">
                              {p.sku}
                            </span>
                            <span className="text-[11px] text-slate-500 font-sans">
                              {p.brand} • {p.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-xs text-slate-700 font-medium font-sans">
                      {p.pack_size}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-xs text-slate-600">
                      {formatCurrency(p.landed_cost)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {formatCurrency(p.wholesale_rate)}
                      </div>
                      {p.mrp > p.wholesale_rate && (
                        <div className="font-mono text-[10px] text-slate-400 line-through">
                          MRP: {formatCurrency(p.mrp)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <StockStatusBar
                        currentStock={p.stock_qty}
                        minThreshold={p.min_stock_threshold}
                        unit={p.unit}
                      />
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-semibold text-xs text-slate-900">
                      {formatCurrency(valuation)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          className="p-1 rounded text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          className="p-1 rounded text-slate-500 hover:text-error hover:bg-red-50 transition-colors"
                          title="Deactivate Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
