import React from "react";
import { CheckCircle2, Printer, Share2, Plus, ArrowRight } from "lucide-react";
import { Modal } from "../../../components/common/Modal";
import { Invoice } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";
import { apiClient } from "../../../services/api/apiClient";

interface InvoiceSuccessModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onNewBill: () => void;
}

export const InvoiceSuccessModal: React.FC<InvoiceSuccessModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onNewBill,
}) => {
  if (!invoice) return null;

  const handlePrintPdf = () => {
    const url = apiClient.getPdfUrl(`/billing/invoices/${invoice.id}/pdf`);
    window.open(url, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${invoice.customer_name}, your invoice #${invoice.invoice_number} for ${formatCurrency(
        invoice.total_amount
      )} is ready! Thank you for doing business with MyBilling Wholesale.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All squared away, Boss! 🎉"
      subtitle="Invoice recorded and inventory debited in realtime."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono text-xs font-semibold text-primary block">
            {invoice.invoice_number}
          </span>
          <h3 className="font-headline-md text-xl font-bold text-slate-900 mt-1">
            {invoice.customer_name}
          </h3>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(invoice.total_amount)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paid via <span className="font-semibold text-slate-700">{invoice.payment_mode}</span> • Status: <span className="text-emerald-700 font-semibold">{invoice.payment_status}</span>
          </p>
        </div>

        {/* Action Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={handlePrintPdf}
            className="h-10 px-3 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Bill</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="h-10 px-3 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Bill</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onNewBill}
          className="w-full mt-2 py-2 text-xs font-semibold text-slate-600 hover:text-primary flex items-center justify-center gap-1 transition-colors"
        >
          <span>Start Next Bill</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Modal>
  );
};
