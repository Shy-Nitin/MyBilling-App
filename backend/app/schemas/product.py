from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    sku: str
    barcode: Optional[str] = None
    name: str
    brand: Optional[str] = None
    category: Optional[str] = "General"
    pack_size: Optional[str] = "1 unit"
    landed_cost: float = 0.0
    wholesale_rate: float = 0.0
    mrp: float = 0.0
    stock_qty: float = 0.0
    min_stock_threshold: float = 10.0
    unit: Optional[str] = "PCS"
    image_url: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    pack_size: Optional[str] = None
    landed_cost: Optional[float] = None
    wholesale_rate: Optional[float] = None
    mrp: Optional[float] = None
    stock_qty: Optional[float] = None
    min_stock_threshold: Optional[float] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    stock_status: Optional[str] = "SAFE" # SAFE, MODERATE, LOW, DEPLETED

    model_config = ConfigDict(from_attributes=True)
