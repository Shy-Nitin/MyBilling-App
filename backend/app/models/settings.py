from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from backend.app.core.database import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(200), default="MyBilling Wholesale & Retail")
    tagline = Column(String(200), default="Executive Precision ERP")
    branch_name = Column(String(100), default="Wholesale Branch #1")
    gstin = Column(String(50), default="27AABCS1429B1Z0")
    phone = Column(String(50), default="+91 98200 12345")
    email = Column(String(100), default="billing@mybilling.corp")
    address = Column(String(300), default="Shop #4-B, APMC Market Yard, Phase II, Mumbai 400703")
    currency_symbol = Column(String(10), default="₹")
    tax_rate_default = Column(Float, default=18.0)
    bill_header = Column(String(200), default="TAX INVOICE / CASH MEMO")
    bill_footer = Column(String(300), default="Thank you for your business! Goods once sold will not be taken back without original bill.")
    terms_and_conditions = Column(Text, default="1. Interest @18% p.a. charged if bill unpaid after due date.\n2. Subject to Mumbai Jurisdiction.")
    show_logo = Column(Boolean, default=True)
    show_barcode = Column(Boolean, default=True)
    show_qr = Column(Boolean, default=True)
    upi_id = Column(String(100), default="mybilling@okhdfcbank")
    enable_sound = Column(Boolean, default=True)
    playful_mode = Column(Boolean, default=True)
