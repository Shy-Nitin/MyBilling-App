import React from "react";
import { Plus } from "lucide-react";
import { Product } from "../../../types";
import { formatCurrency } from "../../../lib/formatters";
import { StatusBadge } from "../../../components/common/StatusBadge";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-secondary font-body-sm text-body-sm bg-white rounded-xl border border-slate-200">
        No products match the selected criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
      {products.map((product) => {
        const isOutOfStock = product.stock_qty <= 0;

        return (
          <div
            key={product.id}
            className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-slate-200/70 hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono mb-1">
                <span className="bg-primary-fixed/40 text-primary font-semibold px-1.5 py-0.5 rounded">
                  {product.sku}
                </span>
                <StatusBadge
                  status={product.stock_status || (isOutOfStock ? "DEPLETED" : "SAFE")}
                  size="sm"
                />
              </div>

              <h4 className="font-semibold text-xs text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mt-1">
                {product.name}
              </h4>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {product.brand ? `${product.brand} • ` : ""}{product.pack_size}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-end justify-between">
              <div>
                {product.mrp > product.wholesale_rate && (
                  <span className="text-[11px] font-mono text-slate-400 line-through block">
                    MRP: {formatCurrency(product.mrp)}
                  </span>
                )}
                <span className="font-mono text-sm font-bold text-slate-900">
                  {formatCurrency(product.wholesale_rate)}
                </span>
                <span className="text-[10px] text-slate-500 ml-1">/{product.unit}</span>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
                className="h-8 px-2.5 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded flex items-center gap-1 shadow-xs transition-transform active:scale-95 disabled:opacity-40 disabled:hover:bg-primary-container"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
