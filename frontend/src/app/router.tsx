import React, { useState, useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { BillingPage } from "../features/billing/pages/BillingPage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { ShopsPage } from "../features/shops/pages/ShopsPage";
import { PurchasesPage } from "../features/purchases/pages/PurchasesPage";
import { LedgerPage } from "../features/ledger/pages/LedgerPage";
import { ReportsPage } from "../features/reports/pages/ReportsPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

export const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname || "/"
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const handleQuickAction = () => {
    navigate("/billing");
  };

  // Keyboard shortcut listener: F9 to jump to billing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault();
        navigate("/billing");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <DashboardPage onNavigate={navigate} />;
      case "/billing":
        return <BillingPage />;
      case "/inventory":
      case "/products":
        return <ProductsPage />;
      case "/shops":
        return <ShopsPage />;
      case "/purchases":
        return <PurchasesPage />;
      case "/ledger":
        return <LedgerPage />;
      case "/reports":
        return <ReportsPage />;
      case "/settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <AppLayout
      currentPath={currentPath}
      onNavigate={navigate}
      onQuickAction={handleQuickAction}
    >
      {renderPage()}
    </AppLayout>
  );
};
