import React from "react";
import { SystemSettings } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";
import { QrCode, Barcode } from "lucide-react";

interface LiveInvoicePreviewProps {
  settings: SystemSettings;
}

export const LiveInvoicePreview: React.FC<LiveInvoicePreviewProps> = ({ settings }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6 max-w-lg w-full font-sans text-slate-900 select-none">
      {/* Bill Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
        <div>
          {settings.show_logo && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-6 h-6 rounded bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                MB
              </div>
              <span className="font-bold text-xs tracking-tight text-primary">
                {settings.store_name}
              </span>
            </div>
          )}
          <h2 className="font-bold text-sm text-slate-900 leading-snug">
            {settings.store_name}
          </h2>
          <p className="text-[11px] text-slate-500">{settings.branch_name}</p>
          <p className="text-[10px] text-slate-500 max-w-xs">{settings.address}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            GSTIN: <span className="font-mono font-medium text-slate-700">{settings.gstin}</span> | Ph:{" "}
            {settings.phone}
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold text-primary block">
            {settings.bill_header}
          </span>
          <span className="font-mono text-[11px] text-slate-700 block mt-1">
            INV-20261023-0042
          </span>
          <span className="font-mono text-[10px] text-slate-400 block">
            23-Oct-2026 05:45 PM
          </span>
          <span className="font-mono text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
            PAID (UPI)
          </span>
        </div>
      </div>

      {/* Customer line */}
      <div className="py-2.5 px-3 bg-slate-50 border border-slate-200/80 rounded-lg my-3 text-[11px]">
        <div className="flex justify-between">
          <span>
            <b>Billed To:</b> Laxmi Supermarket & General Store
          </span>
          <span className="font-mono text-slate-500">Ph: 98211 44556</span>
        </div>
      </div>

      {/* Mock Items Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-mono text-[10px] uppercase border-b border-slate-200">
              <th className="py-1.5 px-2">#</th>
              <th className="py-1.5 px-2">Item</th>
              <th className="py-1.5 px-2 text-right">Qty</th>
              <th className="py-1.5 px-2 text-right">Rate</th>
              <th className="py-1.5 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            <tr>
              <td className="py-1 px-2 text-slate-400">1</td>
              <td className="py-1 px-2 font-sans font-medium text-slate-800">
                Royal Basmati Rice (50 KG Bag)
              </td>
              <td className="py-1 px-2 text-right">2 BAG</td>
              <td className="py-1 px-2 text-right">₹3,650</td>
              <td className="py-1 px-2 text-right font-semibold">₹7,300</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-slate-400">2</td>
              <td className="py-1 px-2 font-sans font-medium text-slate-800">
                Fortune Refined Sunflower (15 Ltr)
              </td>
              <td className="py-1 px-2 text-right">3 TIN</td>
              <td className="py-1 px-2 text-right">₹2,040</td>
              <td className="py-1 px-2 text-right font-semibold">₹6,120</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-between items-end mt-3 pt-2 border-t border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          {settings.show_qr && (
            <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-center">
              <QrCode className="w-10 h-10 text-slate-800 mx-auto" />
              <span className="font-mono text-[8px] text-slate-500 block mt-0.5">
                Scan UPI
              </span>
            </div>
          )}
          {settings.show_barcode && (
            <div className="p-1 bg-slate-50 rounded border border-slate-200">
              <Barcode className="w-16 h-8 text-slate-800" />
              <span className="font-mono text-[8px] text-slate-500 block text-center">
                INV-0042
              </span>
            </div>
          )}
        </div>

        <div className="w-48 font-mono text-xs flex flex-col gap-0.5">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span>₹13,420.00</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>GST (18%):</span>
            <span>+ ₹2,415.60</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-slate-200">
            <span>Total:</span>
            <span>₹15,835.60</span>
          </div>
        </div>
      </div>

      {/* Terms & Footer */}
      <div className="mt-4 pt-2 border-t border-slate-200 text-[9px] text-slate-500 font-mono">
        <div className="whitespace-pre-line leading-tight">
          {settings.terms_and_conditions}
        </div>
        <div className="mt-2 text-center text-[10px] font-sans font-medium text-slate-700 italic">
          {settings.bill_footer}
        </div>
      </div>
    </div>
  );
};
