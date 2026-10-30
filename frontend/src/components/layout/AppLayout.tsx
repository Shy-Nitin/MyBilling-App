import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HotkeyDock } from "./HotkeyDock";

interface AppLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onQuickAction: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPath,
  onNavigate,
  onQuickAction,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playfulMode, setPlayfulMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      {/* Fixed Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        playfulMode={playfulMode}
        onTogglePlayfulMode={() => setPlayfulMode(!playfulMode)}
      />

      {/* Main Content Area offset by Sidebar (256px) and Header (64px) */}
      <div className="pl-64 flex flex-col min-h-screen">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          onQuickAction={onQuickAction}
          isRefreshing={isRefreshing}
        />

        <main className="relative pt-16 bg-background w-full min-h-screen p-space-xl">
          {children}
        </main>
      </div>

      {/* Domain POS Hotkey Dock */}
      <HotkeyDock />
    </div>
  );
};
