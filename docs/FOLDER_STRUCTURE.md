# MyBilling Folder Structure

```text
MyBilling/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── app/
│       │   ├── App.tsx                    # Root application component
│       │   └── router.tsx                 # Client-side router with hotkeys
│       ├── components/
│       │   ├── layout/                    # Shell layout (Sidebar, Header, HotkeyDock, AppLayout)
│       │   └── common/                    # Shared domain primitives (MetricCard, StatusBadge, Modal, QuantityStepper, SearchInput)
│       ├── features/
│       │   ├── dashboard/                 # KPI cards, Sales Pulse chart, Recent Invoices, Quick Actions
│       │   ├── billing/                   # Dual-pane POS catalog, Cart, Pricing override, Payment selector, PDF print modal
│       │   ├── products/                  # Master catalog, stock status progress bars, Add Product modal, bulk actions
│       │   ├── shops/                     # Udhar credit cards, credit utilization gauge, payment recovery modal
│       │   ├── purchases/                 # Inward GRN receipt modal, Add vendor modal, supplier payment voucher modal
│       │   ├── ledger/                    # Double-entry transaction stream, cash drawer balance, voucher modal
│       │   ├── reports/                   # Recharts multi-line comparison graph, category gross margins, GST summary
│       │   └── settings/                  # System governance flags, live invoice customization studio & paper preview
│       ├── lib/
│       │   ├── formatters.ts              # Currency (₹ INR), numbers, dates, times
│       │   └── utils.ts                   # Class merge utilities
│       ├── services/api/
│       │   └── apiClient.ts               # Type-safe Fetch HTTP client
│       ├── types/
│       │   └── index.ts                   # Global TypeScript models
│       ├── styles/
│       │   └── globals.css                # Tailwind CSS layers & scrollbars
│       └── main.tsx                       # React application entrypoint
├── backend/
│   ├── app/
│   │   ├── main.py                        # FastAPI application instance & CORS
│   │   ├── core/
│   │   │   ├── config.py                  # Pydantic environment configuration
│   │   │   └── database.py                # SQLAlchemy engine & session factory
│   │   ├── api/
│   │   │   ├── router.py                  # API router mounting /api/v1
│   │   │   └── v1/                        # Endpoint controllers (dashboard, billing, products, shops, purchases, ledger, reports, settings)
│   │   ├── models/                        # SQLAlchemy database models
│   │   ├── schemas/                       # Pydantic request / response schemas
│   │   ├── services/                      # Business logic services (billing, inventory, pdf_service, report_service)
│   │   └── db/
│   │       └── init_db.py                 # Initial schema creation & realistic seed dataset
│   ├── migrations/                        # Alembic database migrations
│   ├── alembic.ini                        # Alembic configuration
│   └── requirements.txt                   # Python package dependencies
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FOLDER_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   └── SETUP.md
├── screens/                               # Original Stitch reference assets
├── DESIGN.md                              # Original Stitch design specification
├── .gitignore
└── README.md
```
