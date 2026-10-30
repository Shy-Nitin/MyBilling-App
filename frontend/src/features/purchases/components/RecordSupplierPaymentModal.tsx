import React, { useState } from "react";
import { Modal } from "../../../components/common/Modal";
import { Supplier } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";

interface RecordSupplierPaymentModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplierId: number, amount: number, paymentMode: string, notes?: string) => Promise<void>;
}

export const RecordSupplierPaymentModal: React.FC<RecordSupplierPaymentModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("BANK");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!supplier) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Please enter disbursement amount greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(supplier.id, amount, paymentMode, notes);
      onClose();
    } catch (err: any) {
      alert(`Supplier payment failed: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Supplier Payment / Remittance"
      subtitle={`Disburse accounts payable to ${supplier.name}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Payable Info */}
        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-amber-800 uppercase block font-semibold">
              Current Accounts Payable
            </span>
            <div className="font-mono text-xl font-bold text-amber-950 mt-0.5">
              {formatCurrency(supplier.outstanding_balance)}
            </div>
          </div>
          <span className="font-mono text-xs bg-white text-slate-800 font-semibold px-2 py-1 rounded border border-slate-200">
            Terms: {supplier.payment_terms_days} Days
          </span>
        </div>

        {/* Amount */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Payment Amount (₹) *
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

        {/* Mode */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Payment Channel *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["BANK", "NEFT/RTGS", "CASH"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMode(m)}
                className={`py-2 text-xs font-semibold rounded border transition-colors ${
                  paymentMode === m
                    ? "bg-primary-container text-white border-primary"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Bank Ref / UTR / Cheque #
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. UTR #HDFC009918234 / Chq #551201"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          />
        </div>

        {/* Buttons */}
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
            className="h-9 px-5 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded shadow-xs transition-colors"
          >
            {isSubmitting ? "Processing..." : `Disburse ₹${amount.toLocaleString()}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
