import React from "react";
import { X } from "lucide-react";
import { QuantityStepper } from "../../../components/common/QuantityStepper";
import { formatCurrency } from "../../../lib/formatters";

export interface CartItem {
  product_id: number;
  sku: string;
  name: string;
  pack_size: string;
  unit: string;
  quantity: number;
  unit_rate: number;
  discount_percent: number;
  tax_rate: number;
  mrp: number;
}

interface BillItemsTableProps {
  items: CartItem[];
  onUpdateQty: (productId: number, qty: number) => void;
  onUpdateRate: (productId: number, rate: number) => void;
  onUpdateDiscount: (productId: number, disc: number) => void;
  onRemoveItem: (productId: number) => void;
}

export const BillItemsTable: React.FC<BillItemsTableProps> = ({
  items,
  onUpdateQty,
  onUpdateRate,
  onUpdateDiscount,
  onRemoveItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-300">
        <p className="font-semibold text-slate-700 text-sm">Cart is currently empty</p>
        <p className="text-xs text-slate-500 mt-1">
          Click any product on the left or scan barcode [F1] to add line items.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[380px] overflow-y-auto border border-slate-200/80 rounded-xl shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-surface-container-low text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200 z-10">
          <tr>
            <th className="py-2 px-3 font-medium">Item & Pack</th>
            <th className="py-2 px-2 font-medium text-center">Qty</th>
            <th className="py-2 px-2 font-medium text-right">Rate (₹)</th>
            <th className="py-2 px-2 font-medium text-right">Disc %</th>
            <th className="py-2 px-3 font-medium text-right">Total</th>
            <th className="py-2 px-2 font-medium text-center">×</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm bg-white">
          {items.map((item) => {
            const subtotal = item.quantity * item.unit_rate;
            const discount = subtotal * (item.discount_percent / 100);
            const taxable = subtotal - discount;
            const tax = taxable * (item.tax_rate / 100);
            const total = taxable + tax;

            return (
              <tr key={item.product_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-xs text-slate-900 leading-tight">
                    {item.name}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {item.sku} • {item.pack_size}
                  </div>
                </td>

                <td className="py-2.5 px-2 text-center">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(val) => onUpdateQty(item.product_id, val)}
                    size="sm"
                  />
                </td>

                <td className="py-2.5 px-2 text-right">
                  <input
                    type="number"
                    value={item.unit_rate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        onUpdateRate(item.product_id, val);
                      }
                    }}
                    className="w-16 text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>

                <td className="py-2.5 px-2 text-right">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount_percent}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0 && val <= 100) {
                        onUpdateDiscount(item.product_id, val);
                      }
                    }}
                    className="w-12 text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                  {formatCurrency(total)}
                </td>

                <td className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product_id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-error hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
