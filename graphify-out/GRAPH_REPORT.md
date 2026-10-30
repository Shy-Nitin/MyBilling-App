# Graph Report - MyBilling  (2026-10-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 480 nodes · 1281 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- purchases.py
- package.json
- schemas/__init__.py
- router.tsx
- react
- ApiClient
- products.py
- reports.py
- frontend_src_lib_formatters
- PurchasesPage.tsx
- shops.py
- compilerOptions
- ProductsPage.tsx
- compilerOptions
- ReportsPage.tsx
- ProductGrid.tsx
- index.ts
- download_screens.py
- .oxlintrc.json
- Settings
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `lucide-react` - 28 edges
3. `Invoice` - 18 edges
4. `LedgerEntry` - 18 edges
5. `compilerOptions` - 18 edges
6. `Shop` - 17 edges
7. `ApiClient` - 17 edges
8. `Product` - 17 edges
9. `Modal()` - 17 edges
10. `Product` - 15 edges

## Surprising Connections (you probably didn't know these)
- `tax_summary()` --uses--> `Invoice`  [INFERRED]
  backend/app/api/v1/reports.py → backend/app/models/invoice.py
- `get_dashboard_metrics()` --uses--> `Invoice`  [INFERRED]
  backend/app/services/report_service.py → backend/app/models/invoice.py
- `get_dashboard_metrics()` --uses--> `InvoiceItem`  [INFERRED]
  backend/app/services/report_service.py → backend/app/models/invoice.py
- `create_manual_voucher()` --uses--> `LedgerEntry`  [INFERRED]
  backend/app/api/v1/ledger.py → backend/app/models/ledger.py
- `collect_shop_payment()` --uses--> `LedgerEntry`  [INFERRED]
  backend/app/api/v1/shops.py → backend/app/models/ledger.py

## Import Cycles
- None detected.

## Communities (23 total, 5 thin omitted)

### Community 0 - "purchases.py"
Cohesion: 0.07
Nodes (27): create_invoice(), download_invoice_pdf(), get_invoice_by_id(), get_invoices(), get_ledger_summary(), list_ledger_entries(), add_supplier(), create_purchase_order() (+19 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (45): dependencies, clsx@^2.1.1, framer-motion@^14.6.0, lucide-react@^1.61.0, react@^19.3.1, react-dom@^19.3.1, recharts@^3.10.1, tailwind-merge@^3.7.0 (+37 more)

### Community 2 - "schemas/__init__.py"
Cohesion: 0.11
Nodes (20): create_manual_voucher(), get_settings(), update_settings(), InvoiceCreate, InvoiceItemCreate, InvoiceItemResponse, InvoiceResponse, LedgerEntryCreate (+12 more)

### Community 3 - "router.tsx"
Cohesion: 0.10
Nodes (21): App(), AppRouter(), AppLayout(), AppLayoutProps, Header(), DEFAULT_HOTKEYS, HotkeyDock(), HotkeyDockProps (+13 more)

### Community 4 - "react"
Cohesion: 0.16
Nodes (19): QuantityStepper(), QuantityStepperProps, BillItemsTable(), BillItemsTableProps, CartItem, BillSummary(), BillSummaryProps, InvoiceSuccessModal() (+11 more)

### Community 5 - "ApiClient"
Cohesion: 0.12
Nodes (14): KpiMetricGrid(), KpiMetricGridProps, QuickActionsBento(), QuickActionsBentoProps, InvoiceRow, RecentInvoicesTable(), RecentInvoicesTableProps, SalesPulseChart() (+6 more)

### Community 6 - "products.py"
Cohesion: 0.21
Nodes (14): add_product(), delete_product(), get_product(), inventory_valuation(), list_products(), update_product(), Product, ProductBase (+6 more)

### Community 7 - "reports.py"
Cohesion: 0.21
Nodes (13): read_dashboard_metrics(), category_margins(), profit_trends(), tax_summary(), get_db(), CategoryMargin, DailySalesPulse, DashboardMetrics (+5 more)

### Community 8 - "frontend_src_lib_formatters"
Cohesion: 0.20
Nodes (12): MetricCard(), MetricCardProps, AddShopModal(), AddShopModalProps, CollectPaymentModal(), CollectPaymentModalProps, UdharLimitGauge(), UdharLimitGaugeProps (+4 more)

### Community 9 - "PurchasesPage.tsx"
Cohesion: 0.23
Nodes (15): Modal(), ModalProps, AddVendorModal(), AddVendorModalProps, GrnRow, NewGrnModal(), NewGrnModalProps, RecordSupplierPaymentModal() (+7 more)

### Community 10 - "shops.py"
Cohesion: 0.21
Nodes (11): collect_shop_payment(), CollectPaymentRequest, create_shop(), get_shop(), list_shops(), update_shop(), Shop, ShopBase (+3 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 12 - "ProductsPage.tsx"
Cohesion: 0.23
Nodes (12): AddProductModal(), AddProductModalProps, BulkSelectionBar(), BulkSelectionBarProps, ProductTable(), ProductTableProps, StockStatusBar(), StockStatusBarProps (+4 more)

### Community 13 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 14 - "ReportsPage.tsx"
Cohesion: 0.28
Nodes (11): MarginBreakdownTable(), MarginBreakdownTableProps, ProfitAnalyticsChart(), ProfitAnalyticsChartProps, TaxSummaryCard(), TaxSummaryCardProps, ReportsPage(), CategoryMargin (+3 more)

### Community 15 - "ProductGrid.tsx"
Cohesion: 0.21
Nodes (6): SearchInputProps, StatusBadge(), StatusBadgeProps, HeaderProps, ProductGrid(), ProductGridProps

### Community 16 - "index.ts"
Cohesion: 0.44
Nodes (5): LiveInvoicePreview(), LiveInvoicePreviewProps, settingsService, InvoiceItem, SystemSettings

### Community 18 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `router.tsx`, `ApiClient`, `frontend_src_lib_formatters`, `PurchasesPage.tsx`, `ProductsPage.tsx`, `ReportsPage.tsx`, `ProductGrid.tsx`, `index.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Invoice` (e.g. with `download_invoice_pdf()` and `get_invoice_by_id()`) actually correct?**
  _`Invoice` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `purchases.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06942053930005737 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `package.json`, `router.tsx`, `ApiClient`, `frontend_src_lib_formatters`, `PurchasesPage.tsx`, `ProductsPage.tsx`, `ReportsPage.tsx`, `ProductGrid.tsx`, `index.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058279370952821465 - nodes in this community are weakly interconnected._
- **Why does `ApiClient` connect `ApiClient` to `router.tsx`, `react`, `frontend_src_lib_formatters`, `PurchasesPage.tsx`, `ProductsPage.tsx`, `ReportsPage.tsx`, `index.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `schemas/__init__.py` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._