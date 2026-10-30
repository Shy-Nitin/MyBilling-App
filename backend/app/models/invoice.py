from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=True)
    customer_name = Column(String(150), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    subtotal = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    balance_amount = Column(Float, default=0.0)
    payment_mode = Column(String(30), default="CASH") # CASH, UPI, UDHAR_CREDIT, SPLIT
    payment_status = Column(String(30), default="PAID") # PAID, PARTIAL, UNPAID, VOID
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    shop = relationship("Shop")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku = Column(String(50), nullable=False)
    product_name = Column(String(200), nullable=False)
    pack_size = Column(String(50), default="1 unit")
    quantity = Column(Float, default=1.0)
    unit = Column(String(20), default="PCS")
    unit_rate = Column(Float, default=0.0) # Historical selling price at moment of sale
    unit_cost = Column(Float, default=0.0) # Historical landed cost at moment of sale (for reporting only, never exposed on bills)
    mrp = Column(Float, default=0.0)
    discount_percent = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)

    invoice = relationship("Invoice", back_populates="items")
    product = relationship("Product")
