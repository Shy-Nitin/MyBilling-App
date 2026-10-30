import React, { useState, useEffect } from "react";
import { Plus, Store, AlertTriangle, ShieldCheck, PhoneCall, Wallet } from "lucide-react";
import { MetricCard } from "../../../components/common/MetricCard";
import { UdharLimitGauge } from "../components/UdharLimitGauge";
import { AddShopModal } from "../components/AddShopModal";
import { CollectPaymentModal } from "../components/CollectPaymentModal";
import { shopService, CreateShopPayload } from "../services/shopService";
import { Shop } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";

export const ShopsPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentShop, setPaymentShop] = useState<Shop | null>(null);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const data = await shopService.getShops(search || undefined);
      setShops(data);
    } catch (err) {
      console.error("Failed to load shops", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddShop = async (payload: CreateShopPayload) => {
    await shopService.createShop(payload);
    loadShops();
  };

  const handleCollectPayment = async (
    shopId: number,
    amount: number,
    paymentMode: string,
    notes?: string
  ) => {
    await shopService.collectPayment(shopId, amount, paymentMode, notes);
    loadShops();
  };

  // Metric sums
  const totalOutstanding = shops.reduce((sum, s) => sum + s.current_balance, 0);
  const highRiskCount = shops.filter(
    (s) => s.credit_limit > 0 && s.current_balance / s.credit_limit > 0.8
  ).length;

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Total Outstanding Udhar"
          value={formatCurrency(totalOutstanding)}
          icon={Wallet}
          subtitle="Unsettled customer receivables"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-800"
        />

        <MetricCard
          title="High-Risk Accounts"
          value={`${highRiskCount} Shops`}
          icon={AlertTriangle}
          badge={highRiskCount > 0 ? ">80% Limit Exhausted" : "All Healthy"}
          iconBgColor={highRiskCount > 0 ? "bg-rose-100" : "bg-emerald-100"}
          iconColor={highRiskCount > 0 ? "text-rose-700" : "text-emerald-700"}
        />

        <MetricCard
          title="Registered Udhar Shops"
          value={`${shops.length} Accounts`}
          icon={Store}
          subtitle="Verified trade partners"
          iconBgColor="bg-primary-container"
          iconColor="text-white"
        />

        <MetricCard
          title="30-Day Recovery Rate"
          value="84.2%"
          icon={ShieldCheck}
          subtitle="Healthy operational cashflow"
          iconBgColor="bg-tertiary-container"
          iconColor="text-white"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadShops()}
            placeholder="Search shop by name, owner, or phone..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-4 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Shop</span>
        </button>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
        {shops.length === 0 ? (
          <div className="col-span-full py-12 text-center text-secondary text-sm bg-white rounded-xl border border-slate-200">
            No registered shops found. Click "Register New Shop" to add.
          </div>
        ) : (
          shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prop: <span className="font-medium text-slate-700">{shop.owner_name || "N/A"}</span>
                    </p>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                    {shop.tier}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-500 flex flex-col gap-0.5 font-sans">
                  {shop.phone && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span>{shop.phone}</span>
                    </div>
                  )}
                  {shop.gstin && (
                    <div className="font-mono text-[10px] text-slate-400">
                      GSTIN: {shop.gstin}
                    </div>
                  )}
                  {shop.area && (
                    <div className="text-[11px] text-slate-500">
                      Territory: {shop.area}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <UdharLimitGauge
                    currentBalance={shop.current_balance}
                    creditLimit={shop.credit_limit}
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Showing historical statement for ${shop.name}`)}
                  className="text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  Statement →
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentShop(shop)}
                  disabled={shop.current_balance <= 0}
                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-2xs transition-colors disabled:opacity-40 disabled:hover:bg-emerald-600"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Collect Payment</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Shop Modal */}
      <AddShopModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddShop}
      />

      {/* Collect Payment Modal */}
      <CollectPaymentModal
        shop={paymentShop}
        isOpen={!!paymentShop}
        onClose={() => setPaymentShop(null)}
        onSubmit={handleCollectPayment}
      />
    </div>
  );
};
