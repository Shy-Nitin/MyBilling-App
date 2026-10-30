from fastapi import APIRouter
from backend.app.api.v1 import (
    dashboard,
    billing,
    products,
    shops,
    purchases,
    ledger,
    reports,
    settings,
)

api_router = APIRouter()

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing & Invoices"])
api_router.include_router(products.router, prefix="/products", tags=["Products & Inventory"])
api_router.include_router(shops.router, prefix="/shops", tags=["Shops & Udhar"])
api_router.include_router(purchases.router, prefix="/purchases", tags=["Purchases & Suppliers"])
api_router.include_router(ledger.router, prefix="/ledger", tags=["Payments & Ledger"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Profits"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings & Governance"])
