from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone = Column(String(20), index=True, nullable=True)
    email = Column(String(100), nullable=True)
    gstin = Column(String(30), nullable=True)
    address = Column(String(300), nullable=True)
    city = Column(String(100), nullable=True)
    outstanding_balance = Column(Float, default=0.0) # Amount we owe the supplier
    payment_terms_days = Column(Integer, default=30)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
