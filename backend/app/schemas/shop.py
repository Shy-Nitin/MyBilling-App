from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ShopBase(BaseModel):
    name: str
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    gstin: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    credit_limit: float = 50000.0
    current_balance: float = 0.0
    tier: Optional[str] = "Standard"
    status: Optional[str] = "Active"

class ShopCreate(ShopBase):
    pass

class ShopUpdate(BaseModel):
    name: Optional[str] = None
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    gstin: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    credit_limit: Optional[float] = None
    current_balance: Optional[float] = None
    tier: Optional[str] = None
    status: Optional[str] = None

class ShopResponse(ShopBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
