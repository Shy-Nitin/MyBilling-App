import React, { useState, useEffect } from "react";
import { Plus, Package, DollarSign, Layers, AlertTriangle } from "lucide-react";
import { MetricCard } from "../../../components/common/MetricCard";
import { ProductTable } from "../components/ProductTable";
import { AddProductModal } from "../components/AddProductModal";
import { BulkSelectionBar } from "../components/BulkSelectionBar";
import { productService, CreateProductPayload } from "../services/productService";
import { Product } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [valuation, setValuation] = useState<{
    cost_valuation: number;
    wholesale_valuation: number;
    total_sku_count: number;
    low_stock_count: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, val] = await Promise.all([
        productService.getProducts(
          search || undefined,
          selectedCategory !== "All" ? selectedCategory : undefined,
          selectedStatus !== "All" ? selectedStatus : undefined
        ),
        productService.getValuation(),
      ]);
      setProducts(prods);
      setValuation(val);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleSaveProduct = async (payload: CreateProductPayload) => {
    if (editProduct) {
      await productService.updateProduct(editProduct.id, payload);
    } else {
      await productService.createProduct(payload);
    }
    loadData();
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to deactivate this product?")) {
      await productService.deleteProduct(id);
      loadData();
    }
  };

  const categories = [
    "All",
    "Staples & Grains",
    "Edible Oils",
    "Beverages & Dairy",
    "Personal Care",
    "Snacks & Confectionery",
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Valuation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <MetricCard
          title="Wholesale Inventory Valuation"
          value={formatCurrency(valuation?.wholesale_valuation || 0)}
          icon={DollarSign}
          subtitle="Realizable asset value"
          iconBgColor="bg-primary-container"
          iconColor="text-white"
        />

        <MetricCard
          title="Landed Cost Capital Deployed"
          value={formatCurrency(valuation?.cost_valuation || 0)}
          icon={Package}
          subtitle="Direct warehouse COGS"
          iconBgColor="bg-indigo-100"
          iconColor="text-primary"
        />

        <MetricCard
          title="Active Catalog SKUs"
          value={`${valuation?.total_sku_count || 0} Items`}
          icon={Layers}
          subtitle="100% barcode indexed"
          iconBgColor="bg-secondary-container"
          iconColor="text-on-secondary-fixed"
        />

        <MetricCard
          title="Restock Alerts Needed"
          value={`${valuation?.low_stock_count || 0} SKUs`}
          icon={AlertTriangle}
          badge={valuation?.low_stock_count ? "Action Required" : "Stock Optimal"}
          iconBgColor={valuation?.low_stock_count ? "bg-rose-100" : "bg-emerald-100"}
          iconColor={valuation?.low_stock_count ? "text-rose-700" : "text-emerald-700"}
        />
      </div>

      {/* Action & Filter Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search bar */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadData()}
              placeholder="Search product, SKU, barcode..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap border ${
                  selectedCategory === c
                    ? "bg-primary-container text-white border-primary"
                    : "bg-surface-container-low text-slate-700 hover:bg-surface-container border-slate-200/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={() => {
            setEditProduct(null);
            setIsAddModalOpen(true);
          }}
          className="h-9 px-4 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-xs transition-colors self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product [F2]</span>
        </button>
      </div>

      {/* Main Table */}
      <ProductTable
        products={products}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onEdit={(p) => {
          setEditProduct(p);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
      />

      {/* Bulk Selection Sticky Bar */}
      <BulkSelectionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onPrintLabels={() => alert(`Generated barcode print batch for ${selectedIds.length} items.`)}
        onBulkPriceUpdate={() => alert(`Bulk price editor launched for ${selectedIds.length} items.`)}
      />

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditProduct(null);
        }}
        onSubmit={handleSaveProduct}
        editProduct={editProduct}
      />
    </div>
  );
};
