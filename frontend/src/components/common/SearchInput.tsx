import React from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hotkey?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  hotkey,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center bg-surface-container-low rounded px-space-md py-space-xs border border-transparent focus-within:border-primary/40 focus-within:bg-white transition-all shadow-sm",
        className
      )}
    >
      <Search className="w-4 h-4 text-on-surface-variant mr-space-sm shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 p-0 text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
      />
      {hotkey && (
        <kbd className="font-mono text-[11px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded shadow-xs select-none">
          {hotkey}
        </kbd>
      )}
    </div>
  );
};
