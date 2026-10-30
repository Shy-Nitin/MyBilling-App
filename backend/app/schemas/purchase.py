from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: float
    unit_cost: float
    tax_rate: float = 0.0

class PurchaseItemResponse(BaseModel):
    id: int
    purchase_id: int
    product_id: int
    sku: str
    product_name: str
    quantity: float
    unit_cost: float
    tax_rate: float
    total_amount: float

    model_config = ConfigDict(from_attributes=True)

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    vendor_invoice_no: Optional[str] = None
    order_date: Optional[datetime] = None
    paid_amount: float = 0.0
    notes: Optional[str] = None
    items: List[PurchaseItemCreate]

class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    vendor_invoice_no: Optional[str] = None
    order_date: datetime
    received_date: Optional[datetime] = None
    subtotal: float
    tax_amount: float
    total_amount: float
    paid_amount: float
    balance_amount: float
    status: str
    notes: Optional[str] = None
    created_at: datetime
    items: List[PurchaseItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
