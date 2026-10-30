import React, { useState } from "react";
import { Modal } from "../../../components/common/Modal";
import { Shop } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";

interface CollectPaymentModalProps {
  shop: Shop | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shopId: number, amount: number, paymentMode: string, notes?: string) => Promise<void>;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  shop,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!shop) return null;

  const handleQuickAmount = (val: number) => {
    setAmount(Math.min(shop.current_balance, val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Please enter a payment amount greater than zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(shop.id, amount, paymentMode, notes);
      onClose();
    } catch (err: any) {
      alert(`Payment recording failed: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Udhar / Debt Repayment"
      subtitle={`Recording customer credit recovery for ${shop.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Balance Card */}
        <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200/60 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-indigo-700 uppercase block font-semibold">
              Current Outstanding Debt
            </span>
            <div className="font-mono text-xl font-bold text-indigo-950 mt-0.5">
              {formatCurrency(shop.current_balance)}
            </div>
          </div>
          <span className="font-mono text-xs bg-white text-indigo-900 font-semibold px-2 py-1 rounded border border-indigo-200 shadow-2xs">
            Limit: {formatCurrency(shop.credit_limit)}
          </span>
        </div>

        {/* Quick Amount Chips */}
        <div>
          <span className="font-mono text-[10px] text-slate-500 uppercase block mb-1 font-semibold">
            Quick Settlement Amount
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleQuickAmount(shop.current_balance)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-primary text-xs font-mono font-medium transition-colors border border-slate-200"
            >
              Full Clear ({formatCurrency(shop.current_balance)})
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(shop.current_balance / 2)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-primary text-xs font-mono font-medium transition-colors border border-slate-200"
            >
              50% Part Pay
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(10000)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-primary text-xs font-mono font-medium transition-colors border border-slate-200"
            >
              ₹10,000
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(25000)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-primary text-xs font-mono font-medium transition-colors border border-slate-200"
            >
              ₹25,000
            </button>
          </div>
        </div>

        {/* Payment Amount input */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Recovery Amount (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full font-mono text-base bg-white border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none font-bold text-slate-900"
          />
        </div>

        {/* Payment Mode */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Payment Mode *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["CASH", "UPI", "BANK"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`py-2 text-xs font-semibold rounded border transition-colors ${
                  paymentMode === mode
                    ? "bg-primary-container text-white border-primary"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Reference / Receipt Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cleared via Cheque #4412 / HDFC UPI"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || amount <= 0}
            className="h-9 px-5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : `Record ₹${amount.toLocaleString()} Receipt`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
