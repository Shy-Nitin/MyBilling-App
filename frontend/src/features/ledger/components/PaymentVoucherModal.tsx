import React, { useState } from "react";
import { Modal } from "../../../components/common/Modal";
import { CreateVoucherPayload } from "../services/ledgerService";

interface PaymentVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVoucherPayload) => Promise<void>;
}

export const PaymentVoucherModal: React.FC<PaymentVoucherModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [voucherType, setVoucherType] = useState<"EXPENSE" | "BANK_DEPOSIT" | "CASH_WITHDRAWAL">("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) {
      alert("Please provide both valid amount and description.");
      return;
    }

    try {
      setIsSubmitting(true);
      let accountType = "CASH";
      let debit = 0;
      let credit = 0;

      if (voucherType === "EXPENSE") {
        accountType = paymentMode === "CASH" ? "CASH" : "BANK";
        credit = amount; // outflow
      } else if (voucherType === "BANK_DEPOSIT") {
        accountType = "BANK";
        debit = amount; // bank increases
      } else {
        accountType = "CASH";
        debit = amount; // cash drawer increases
      }

      await onSubmit({
        reference_type: voucherType,
        account_type: accountType,
        description,
        debit_amount: debit,
        credit_amount: credit,
        payment_mode: paymentMode,
      });
      onClose();
    } catch (err: any) {
      alert(`Voucher creation failed: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Payment Voucher / Journal Entry"
      subtitle="Record operational expense, cash till settlement, or bank transfer."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Voucher Category */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Transaction Category *
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "EXPENSE", label: "Expense" },
              { id: "BANK_DEPOSIT", label: "Bank Deposit" },
              { id: "CASH_WITHDRAWAL", label: "Till Cash In" },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoucherType(v.id as any)}
                className={`py-2 text-[11px] font-semibold rounded border transition-colors ${
                  voucherType === v.id
                    ? "bg-primary-container text-white border-primary"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Voucher Amount (₹) *
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

        {/* Description */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Particulars / Description *
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Shop Electricity Bill / Delivery Tempo Fuel"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          />
        </div>

        {/* Payment Channel */}
        <div>
          <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
            Account / Source *
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          >
            <option value="CASH">Till Cash Drawer</option>
            <option value="BANK">HDFC Operating Bank Account</option>
            <option value="UPI">Branch UPI Terminal</option>
          </select>
        </div>

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
            className="h-9 px-5 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post to Journal"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
