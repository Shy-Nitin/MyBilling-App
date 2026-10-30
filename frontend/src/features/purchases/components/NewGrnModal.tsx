import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../../../components/common/Modal";
import { Supplier, Product } from "../../../types";
import { CreateGrnPayload } from "../services/purchaseService";
import { formatCurrency } from "../../../lib/formatters";

interface NewGrnModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  products: Product[];
  onSubmit: (payload: CreateGrnPayload) => Promise<void>;
}

interface GrnRow {
  product_id: number;
  quantity: number;
  unit_cost: number;
  tax_rate: number;
}

export const NewGrnModal: React.FC<NewGrnModalProps> = ({
  isOpen,
  onClose,
  suppliers,
  products,
  onSubmit,
}) => {
  const [supplierId, setSupplierId] = useState<number>(suppliers[0]?.id || 1);
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<GrnRow[]>([
    {
      product_id: products[0]?.id || 1,
      quantity: 10,
      unit_cost: products[0]?.landed_cost || 1000,
      tax_rate: 5,
    },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        product_id: products[0]?.id || 1,
        quantity: 10,
        unit_cost: products[0]?.landed_cost || 1000,
        tax_rate: 5,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (index: number, field: keyof GrnRow, val: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      if (field === "product_id") {
        const prod = products.find((p) => p.id === val);
        if (prod) next[index].unit_cost = prod.landed_cost;
      }
      return next;
    });
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
  const totalTax = items.reduce((sum, item) => sum + item.quantity * item.unit_cost * (item.tax_rate / 100), 0);
  const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      alert("Please select a Supplier.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        supplier_id: supplierId,
        vendor_invoice_no: vendorInvoiceNo || undefined,
        paid_amount: paidAmount,
        notes: notes || undefined,
        items,
      });
      onClose();
    } catch (err: any) {
      alert(`GRN Creation failed: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inward Goods Receipt Note (GRN)"
      subtitle="Record stock receipt from vendor, calculate tax, and increment inventory."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Top Info: Supplier & Vendor Inv */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[11px] text-slate-500 uppercase block font-semibold mb-1">
              Supplier Partner *
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(parseInt(e.target.value) || 1)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Payable: ₹{s.outstanding_balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[11px] text-slate-500 uppercase block font-semibold mb-1">
              Vendor Bill / Invoice Ref #
            </label>
            <input
              type="text"
              value={vendorInvoiceNo}
              onChange={(e) => setVendorInvoiceNo(e.target.value)}
              placeholder="e.g. AGRO-INV-99201"
              className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>
        </div>

        {/* Inward Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Product Item</th>
                <th className="py-2.5 px-2 text-center w-24">Inward Qty</th>
                <th className="py-2.5 px-2 text-right w-28">Unit Cost (₹)</th>
                <th className="py-2.5 px-2 text-right w-20">Tax %</th>
                <th className="py-2.5 px-3 text-right w-28">Total (₹)</th>
                <th className="py-2.5 px-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm bg-white">
              {items.map((row, idx) => {
                const rowTotal = row.quantity * row.unit_cost * (1 + row.tax_rate / 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3">
                      <select
                        value={row.product_id}
                        onChange={(e) =>
                          handleUpdateItem(idx, "product_id", parseInt(e.target.value) || 1)
                        }
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) =>
                          handleUpdateItem(idx, "quantity", parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1 py-1 focus:bg-white focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={row.unit_cost}
                        onChange={(e) =>
                          handleUpdateItem(idx, "unit_cost", parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        value={row.tax_rate}
                        onChange={(e) =>
                          handleUpdateItem(idx, "tax_rate", parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white focus:outline-none"
                      />
                    </td>

                    <td className="py-2 px-3 text-right font-mono font-semibold text-xs text-slate-900">
                      {formatCurrency(rowTotal)}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        className="text-slate-400 hover:text-error disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-primary font-semibold text-xs border border-slate-200 shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Another Item</span>
            </button>
            <div className="font-mono text-xs text-slate-600">
              Subtotal: <span className="font-semibold">{formatCurrency(subtotal)}</span> | Taxes:{" "}
              <span className="font-semibold">{formatCurrency(totalTax)}</span>
            </div>
          </div>
        </div>

        {/* Payment & Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-low/70 p-3 rounded-xl border border-slate-200/80">
          <div>
            <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
              Advance Paid to Supplier Now (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              className="w-full font-mono text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Remaining ₹{Math.max(0, grandTotal - paidAmount).toLocaleString()} added to Supplier Payable
            </span>
          </div>

          <div className="flex flex-col justify-center items-end text-right font-mono">
            <span className="text-[11px] text-slate-500 uppercase">Total GRN Value</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || grandTotal <= 0}
            className="h-9 px-5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded shadow-xs transition-colors"
          >
            {isSubmitting ? "Receiving Stock..." : "Post GRN & Inward Stock"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
