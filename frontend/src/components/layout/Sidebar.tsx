import React from "react";
import {
  LayoutDashboard,
  ReceiptText,
  Package,
  Store,
  Truck,
  Wallet,
  LineChart,
  Settings,
  Warehouse,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { id: "billing", label: "Billing & Invoices", path: "/billing", icon: ReceiptText, badge: "Let's Cook" },
  { id: "products", label: "Products & Inventory", path: "/inventory", icon: Package },
  { id: "shops", label: "Shops & Udhar", path: "/shops", icon: Store },
  { id: "purchases", label: "Purchases & Suppliers", path: "/purchases", icon: Truck },
  { id: "ledger", label: "Payments & Ledger", path: "/ledger", icon: Wallet },
  { id: "reports", label: "Reports & Profit", path: "/reports", icon: LineChart },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  playfulMode?: boolean;
  onTogglePlayfulMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  playfulMode = true,
  onTogglePlayfulMode,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-slate-200/70 z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => onNavigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-base shadow-sm">
              MB
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
              MyBilling
            </span>
          </div>
          <span className="px-space-xs py-space-2xs bg-secondary-container text-on-secondary-fixed font-label-badge text-[10px] font-semibold rounded uppercase tracking-wider">
            Pro ERP
          </span>
        </div>

        {/* Navigation List */}
        <nav className="p-space-sm flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={cn(
                  "flex items-center justify-between w-full px-space-md py-space-sm rounded transition-all text-left text-body-md font-body-md",
                  isActive
                    ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <div className="flex items-center gap-space-md">
                  <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-white" : "text-on-surface-variant")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "font-label-badge text-[10px] px-1.5 py-0.5 rounded font-semibold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-tertiary-container/15 text-tertiary"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Controls */}
      <div className="p-space-sm bg-surface-container-low/70 border-t border-slate-200/60 flex flex-col gap-space-sm">
        {/* Playful Mode Toggle */}
        <div className="flex items-center justify-between px-space-sm py-1 bg-surface-container-lowest/80 rounded border border-slate-200/50">
          <span className="font-label-code text-[11px] text-secondary font-medium">
            Playful Microcopy
          </span>
          <button
            type="button"
            onClick={onTogglePlayfulMode}
            className={cn(
              "w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5",
              playfulMode ? "bg-primary-container" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "w-3 h-3 rounded-full bg-white transition-transform shadow-xs",
                playfulMode ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* Branch Selector */}
        <div className="flex items-center justify-between px-space-sm py-1.5 bg-surface-container-lowest rounded border border-slate-200/70 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-space-sm">
            <Warehouse className="w-4 h-4 text-primary shrink-0" />
            <span className="font-label-code text-label-code text-on-surface truncate max-w-[130px] font-medium">
              Wholesale Branch #1
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-space-sm pt-space-xs px-space-xs">
          <div className="w-8 h-8 rounded-full bg-indigo-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            BM
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
              Boss Mode
            </span>
            <span className="font-label-code text-[10px] text-secondary truncate">
              SuperAdmin #01
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
