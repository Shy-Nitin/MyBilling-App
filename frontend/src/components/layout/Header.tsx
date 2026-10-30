import React from "react";
import { Search, RefreshCw, Bell, PlusCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onQuickAction: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onQuickAction,
  isRefreshing = false,
}) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-200/60 z-40 flex items-center justify-between px-space-xl">
      {/* Search Input */}
      <div className="flex items-center gap-space-lg w-1/2 max-w-md">
        <div className="flex items-center w-full bg-surface-container-low rounded px-space-md py-space-xs border border-transparent focus-within:border-primary/40 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-on-surface-variant mr-space-sm shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search inventory, invoices, shops..."
            className="w-full bg-transparent border-0 p-0 text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
          />
          <kbd className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded shadow-xs select-none">
            Alt+K
          </kbd>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-space-md">
        {/* Sync Status */}
        <div className="flex items-center gap-space-xs px-space-sm py-1 bg-tertiary-container/10 rounded border border-tertiary/15">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono text-[11px] text-tertiary font-semibold">
            Sync Status: Realtime
          </span>
        </div>

        {/* Refresh / Run it back */}
        <button
          type="button"
          onClick={onRefresh}
          className="h-9 px-space-sm rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-space-xs transition-colors border border-slate-200/40"
          title="Run it back"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          <span className="font-body-sm text-body-sm hidden xl:inline font-medium">
            Run it back
          </span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="h-9 w-9 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center justify-center transition-colors relative border border-slate-200/40"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
        </button>

        {/* Primary Action Button: "Let's Cook" */}
        <button
          type="button"
          onClick={onQuickAction}
          className="h-9 px-space-lg bg-primary-container text-on-primary font-headline-sm text-[13px] font-semibold rounded flex items-center gap-space-xs shadow-[0_1px_4px_rgba(67,56,202,0.25)] hover:bg-primary transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Let's Cook</span>
          <kbd className="font-mono text-[10px] bg-primary/40 text-on-primary px-1.5 py-0.5 rounded ml-space-xs">
            F9
          </kbd>
        </button>
      </div>
    </header>
  );
};
