from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    owner_name = Column(String(100), nullable=True)
    phone = Column(String(20), index=True, nullable=True)
    gstin = Column(String(30), nullable=True)
    address = Column(String(300), nullable=True)
    area = Column(String(100), nullable=True)
    credit_limit = Column(Float, default=50000.0) # Udhar limit
    current_balance = Column(Float, default=0.0) # Current outstanding debt
    tier = Column(String(20), default="Standard") # Retailer, Wholesaler, VIP
    status = Column(String(20), default="Active") # Active, Warning, Blocked
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
