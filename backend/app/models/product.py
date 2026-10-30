from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    barcode = Column(String(50), index=True, nullable=True)
    name = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=True)
    category = Column(String(100), default="General", index=True)
    pack_size = Column(String(50), default="1 unit")
    landed_cost = Column(Float, nullable=False, default=0.0) # Internal purchase landed cost
    wholesale_rate = Column(Float, nullable=False, default=0.0) # Selling price
    mrp = Column(Float, nullable=False, default=0.0) # Maximum Retail Price (Informational)
    stock_qty = Column(Float, nullable=False, default=0.0)
    min_stock_threshold = Column(Float, nullable=False, default=10.0)
    unit = Column(String(20), default="PCS")
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
