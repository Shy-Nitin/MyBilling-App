import React, { useState, useEffect } from "react";
import { Plus, Truck, Building2, Wallet, Calendar, FileText } from "lucide-react";
import { MetricCard } from "../../../components/common/MetricCard";
import { AddVendorModal } from "../components/AddVendorModal";
import { NewGrnModal } from "../components/NewGrnModal";
import { RecordSupplierPaymentModal } from "../components/RecordSupplierPaymentModal";
import {
  purchaseService,
  PurchaseOrderData,
  CreateGrnPayload,
  CreateSupplierPayload,
} from "../services/purchaseService";
import { Supplier, Product } from "../../../types";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import { StatusBadge } from "../../../components/common/StatusBadge";

export const PurchasesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"grn" | "suppliers">("grn");
  const [purchases, setPurchases] = useState<PurchaseOrderData[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isGrnModalOpen, setIsGrnModalOpen] = useState(false);
  const [paymentSupplier, setPaymentSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pos, supps, prods] = await Promise.all([
        purchaseService.getPurchases(),
        purchaseService.getSuppliers(),
        purchaseService.getProducts(),
      ]);
      setPurchases(pos);
      setSuppliers(supps);
      setProducts(prods);
    } catch (err) {
      console.error("Failed to load purchase data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (payload: CreateSupplierPayload) => {
    await purchaseService.createSupplier(payload);
    loadData();
  };

  const handleCreateGrn = async (payload: CreateGrnPayload) => {
    await purchaseService.createPurchaseOrder(payload);
    loadData();
  };

  const handlePaySupplier = async (
    supplierId: number,
    amount: number,
    paymentMode: string,
    notes?: string
  ) => {
    await purchaseService.paySupplier(supplierId, amount, paymentMode, notes);
    loadData();
  };

  const totalPayable = suppliers.reduce((sum, s) => sum + s.outstanding_balance, 0);

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Accounts Payable"
          value={formatCurrency(totalPayable)}
          icon={Wallet}
          subtitle="Outstanding vendor payables"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-800"
        />

        <MetricCard
          title="Active Supplier Partners"
          value={`${suppliers.length} Vendors`}
          icon={Building2}
          subtitle="Contracted distributors"
          iconBgColor="bg-primary-container"
          iconColor="text-white"
        />

        <MetricCard
          title="Total Inward GRNs"
          value={`${purchases.length} Batches`}
          icon={Truck}
          subtitle="Stock receipts recorded"
          iconBgColor="bg-tertiary-container"
          iconColor="text-white"
        />

        <MetricCard
          title="Avg Settlement Terms"
          value="21 Days"
          icon={Calendar}
          subtitle="Procurement credit window"
          iconBgColor="bg-secondary-container"
          iconColor="text-on-secondary-fixed"
        />
      </div>

      {/* Toolbar & Tabs */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("grn")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === "grn"
                ? "bg-primary-container text-white border-primary"
                : "bg-surface-container-low text-slate-700 border-slate-200/60 hover:bg-surface-container"
            }`}
          >
            Goods Receipt Notes (GRN)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("suppliers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === "suppliers"
                ? "bg-primary-container text-white border-primary"
                : "bg-surface-container-low text-slate-700 border-slate-200/60 hover:bg-surface-container"
            }`}
          >
            Supplier Directory
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsVendorModalOpen(true)}
            className="h-9 px-3.5 bg-surface-container-low hover:bg-surface-container text-slate-800 border border-slate-200/80 font-semibold text-xs rounded flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Supplier</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGrnModalOpen(true)}
            className="h-9 px-4 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>Receive Stock (GRN)</span>
          </button>
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === "grn" ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-medium">GRN / PO #</th>
                  <th className="py-3 px-4 font-medium">Supplier</th>
                  <th className="py-3 px-4 font-medium">Vendor Bill #</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Total Amount</th>
                  <th className="py-3 px-4 font-medium text-right">Paid</th>
                  <th className="py-3 px-4 font-medium text-right">Balance Due</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-secondary text-sm">
                      No Goods Receipt Notes posted yet. Click "Receive Stock (GRN)" to inward goods.
                    </td>
                  </tr>
                ) : (
                  purchases.map((po) => {
                    const sup = suppliers.find((s) => s.id === po.supplier_id);
                    return (
                      <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{po.po_number}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {sup ? sup.name : `Supplier #${po.supplier_id}`}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          {po.vendor_invoice_no || "N/A"}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {formatDate(po.order_date)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(po.total_amount)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-700">
                          {formatCurrency(po.paid_amount)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-amber-800">
                          {formatCurrency(po.balance_amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={po.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/80 text-secondary font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-medium">Supplier Enterprise</th>
                  <th className="py-3 px-4 font-medium">Contact Person</th>
                  <th className="py-3 px-4 font-medium">GSTIN</th>
                  <th className="py-3 px-4 font-medium">City</th>
                  <th className="py-3 px-4 font-medium text-center">Terms</th>
                  <th className="py-3 px-4 font-medium text-right">Outstanding Payable</th>
                  <th className="py-3 px-4 font-medium text-right">Remittance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body-sm text-body-sm">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {s.phone || s.email || "No direct phone"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{s.contact_person || "N/A"}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{s.gstin || "N/A"}</td>
                    <td className="py-3 px-4 text-slate-600">{s.city || "Mumbai"}</td>
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-600">
                      {s.payment_terms_days} Days
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(s.outstanding_balance)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setPaymentSupplier(s)}
                        disabled={s.outstanding_balance <= 0}
                        className="h-8 px-3 rounded-lg bg-indigo-50 hover:bg-primary-container text-primary hover:text-white font-semibold text-xs transition-colors border border-indigo-200 disabled:opacity-40"
                      >
                        Disburse Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSubmit={handleAddVendor}
      />

      {/* New GRN Modal */}
      <NewGrnModal
        isOpen={isGrnModalOpen}
        onClose={() => setIsGrnModalOpen(false)}
        suppliers={suppliers}
        products={products}
        onSubmit={handleCreateGrn}
      />

      {/* Record Supplier Payment Modal */}
      <RecordSupplierPaymentModal
        supplier={paymentSupplier}
        isOpen={!!paymentSupplier}
        onClose={() => setPaymentSupplier(null)}
        onSubmit={handlePaySupplier}
      />
    </div>
  );
};
