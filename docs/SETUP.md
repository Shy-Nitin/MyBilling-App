# MyBilling Setup & Installation Guide

This document provides step-by-step instructions to configure, run, and verify MyBilling on any machine.

---

## 1. Prerequisites

- **Node.js**: v18+ (verified on v24)
- **Python**: v3.10+ (verified on v3.14)
- **PostgreSQL** (optional; SQLite works out-of-the-box for development and verification)

---

## 2. Backend Setup

### A. Environment & Dependencies

From the repository root:
```bash
pip install -r backend/requirements.txt
```

### B. Configure Database (PostgreSQL or SQLite)

- **Default (SQLite zero-configuration):**
  The backend automatically defaults to `sqlite:///./mybilling.db`.
  The database is automatically created and seeded with realistic ERP inventory, registered shops, suppliers, and transaction records on first startup.

- **For PostgreSQL:**
  Set the `DATABASE_URL` environment variable:
  ```bash
  # Windows PowerShell:
  $env:DATABASE_URL="postgresql+psycopg2://postgres:password@localhost:5432/mybilling"

  # Linux/macOS:
  export DATABASE_URL="postgresql+psycopg2://postgres:password@localhost:5432/mybilling"
  ```

### C. Run Database Migrations (Optional)

```bash
# Run Alembic migrations
alembic -c backend/alembic.ini upgrade head
```

### D. Start Backend API Server

From the repository root:
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000/api/v1`
- Swagger / OpenAPI Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

---

## 3. Frontend Setup

### A. Install Dependencies

```bash
cd frontend
npm install
```

### B. Start Development Server

```bash
npm run dev
```

- Local Dev URL: `http://localhost:5173`
- The frontend proxies / connects directly to the backend at `http://localhost:8000/api/v1`.

### C. Production Build Verification

```bash
npm run build
npm run preview
```

---

## 4. Key Keyboard Hotkeys

- `F9`: Jump to POS Terminal / Finalize Active Bill
- `F1`: Quick Focus Barcode Scanner / SKU Search
- `F2`: Add New Product to Master Catalog / Switch to Cash Mode
- `F4`: Split Payment Mode
- `F6`: Barcode Label Generator
- `Alt+K`: Global Navigation Search
- `Esc`: Close open modal / clear active selection
