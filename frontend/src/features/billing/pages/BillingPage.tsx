import React, { useState, useEffect } from "react";
import { User, Store, AlertCircle } from "lucide-react";
import { ProductSearch } from "../components/ProductSearch";
import { ProductGrid } from "../components/ProductGrid";
import { BillItemsTable, CartItem } from "../components/BillItemsTable";
import { PaymentMethodSelector } from "../components/PaymentMethodSelector";
import { BillSummary } from "../components/BillSummary";
import { InvoiceSuccessModal } from "../components/InvoiceSuccessModal";
import { billingService } from "../services/billingService";
import { Product, Shop, Invoice } from "../../../types";

export const BillingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & selection
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("Counter Walk-in Retail");
  const [customerPhone, setCustomerPhone] = useState("");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "UDHAR_CREDIT" | "SPLIT">("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, shps] = await Promise.all([
        billingService.getProducts(),
        billingService.getShops(),
      ]);
      setProducts(prods);
      setShops(shps);
    } catch (err) {
      console.error("Failed to load billing data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShop = (shopIdStr: string) => {
    if (!shopIdStr) {
      setSelectedShopId(null);
      setCustomerName("Counter Walk-in Retail");
      setCustomerPhone("");
      if (paymentMode === "UDHAR_CREDIT") setPaymentMode("CASH");
      return;
    }
    const id = parseInt(shopIdStr, 10);
    const shop = shops.find((s) => s.id === id);
    if (shop) {
      setSelectedShopId(id);
      setCustomerName(shop.name);
      setCustomerPhone(shop.phone || "");
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          sku: product.sku,
          name: product.name,
          pack_size: product.pack_size,
          unit: product.unit || "PCS",
          quantity: 1,
          unit_rate: product.wholesale_rate,
          discount_percent: 0,
          tax_rate: 18.0,
          mrp: product.mrp,
        },
      ];
    });
  };

  const handleUpdateQty = (productId: number, qty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const handleUpdateRate = (productId: number, rate: number) => {
    setCart((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, unit_rate: rate } : i))
    );
  };

  const handleUpdateDiscount = (productId: number, disc: number) => {
    setCart((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, discount_percent: disc } : i))
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.product_id !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_rate, 0);
  const totalDiscount = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_rate * (item.discount_percent / 100),
    0
  );
  const taxable = subtotal - totalDiscount;
  const totalTax = cart.reduce((sum, item) => {
    const itemSub = item.quantity * item.unit_rate;
    const itemDisc = itemSub * (item.discount_percent / 100);
    return sum + (itemSub - itemDisc) * (item.tax_rate / 100);
  }, 0);
  const grandTotal = Math.round((taxable + totalTax) * 100) / 100;

  // Finalize Invoice
  const handleFinalize = async () => {
    if (cart.length === 0) return;
    try {
      setIsSubmitting(true);
      const payload = {
        shop_id: selectedShopId,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_mode: paymentMode,
        paid_amount:
          paymentMode === "CASH" || paymentMode === "UPI"
            ? grandTotal
            : paymentMode === "UDHAR_CREDIT"
            ? 0
            : paidAmount,
        items: cart.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit_rate: i.unit_rate,
          discount_percent: i.discount_percent,
          tax_rate: i.tax_rate,
        })),
      };

      const created = await billingService.createInvoice(payload);
      setLastInvoice(created);
      setShowSuccess(true);
    } catch (err: any) {
      alert(`Error creating invoice: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewBill = () => {
    setCart([]);
    setSelectedShopId(null);
    setCustomerName("Counter Walk-in Retail");
    setCustomerPhone("");
    setPaymentMode("CASH");
    setPaidAmount(0);
    setShowSuccess(false);
    loadData(); // reload product inventory stock
  };

  // Filtered products
  const categories = ["All Items", "Staples & Grains", "Edible Oils", "Beverages & Dairy", "Personal Care", "Snacks & Confectionery"];
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All Items" || p.category === selectedCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Customer / Shop Context Banner */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-primary flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
            {/* Shop Selector */}
            <div>
              <label className="font-mono text-[10px] text-slate-500 uppercase block">
                Select Registered Shop (Udhar Allowed)
              </label>
              <select
                value={selectedShopId || ""}
                onChange={(e) => handleSelectShop(e.target.value)}
                className="w-full font-body-sm text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium text-slate-800"
              >
                <option value="">Counter Walk-in (No Udhar)</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Bal: ₹{s.current_balance.toLocaleString()} / Limit: ₹{s.credit_limit.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name input */}
            <div>
              <label className="font-mono text-[10px] text-slate-500 uppercase block">
                Customer Name / Billing Identity
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full font-body-sm text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Counter Info Badge */}
        <div className="flex items-center gap-3 text-xs font-mono self-end md:self-auto border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
          <div>
            <span className="text-slate-400 block text-[10px]">Terminal #01</span>
            <span className="font-semibold text-slate-800">Boss Register</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Cart Items</span>
            <span className="font-bold text-primary">{cart.length} Products</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane POS Layout: Catalog (7 Cols) & Cart (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left: Product Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <ProductSearch
            value={search}
            onChange={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right: Live Cart & Bill Summary */}
        <div className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-slate-200/70">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-slate-900">
                Active Bill Ledger
              </h3>
              <p className="text-[11px] text-slate-500">
                {customerName} • {cart.length} item(s)
              </p>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                className="text-[11px] font-mono text-error hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Table */}
          <BillItemsTable
            items={cart}
            onUpdateQty={handleUpdateQty}
            onUpdateRate={handleUpdateRate}
            onUpdateDiscount={handleUpdateDiscount}
            onRemoveItem={handleRemoveItem}
          />

          {/* Payment Method Selector */}
          <PaymentMethodSelector
            selectedMode={paymentMode}
            onSelectMode={setPaymentMode}
            hasShopSelected={!!selectedShopId}
          />

          {/* Bill Totals & Finalize */}
          <BillSummary
            subtotal={subtotal}
            discount={totalDiscount}
            tax={totalTax}
            total={grandTotal}
            paidAmount={paidAmount}
            onPaidAmountChange={setPaidAmount}
            paymentMode={paymentMode}
            isSubmitting={isSubmitting}
            onFinalize={handleFinalize}
          />
        </div>
      </div>

      {/* Invoice Success Modal */}
      <InvoiceSuccessModal
        invoice={lastInvoice}
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNewBill={handleResetForNewBill}
      />
    </div>
  );
};
