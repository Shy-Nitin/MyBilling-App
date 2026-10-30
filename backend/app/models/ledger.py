from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from datetime import datetime
from backend.app.core.database import Base

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)
    entry_number = Column(String(50), unique=True, index=True, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow, index=True)
    reference_type = Column(String(50), nullable=False) # SALE_INVOICE, PURCHASE_GRN, PAYMENT_RECEIVED, SUPPLIER_PAYMENT, EXPENSE
    reference_id = Column(String(50), nullable=True) # e.g. INV-2026-001 or PO-2026-001
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    account_type = Column(String(50), default="ACCOUNTS_RECEIVABLE") # CASH, BANK, ACCOUNTS_RECEIVABLE, ACCOUNTS_PAYABLE, REVENUE
    description = Column(String(300), nullable=False)
    debit_amount = Column(Float, default=0.0) # Money coming in or receivable
    credit_amount = Column(Float, default=0.0) # Money going out or payable
    running_balance = Column(Float, default=0.0)
    payment_mode = Column(String(30), default="CASH")
    created_at = Column(DateTime, default=datetime.utcnow)
