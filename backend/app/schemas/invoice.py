from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class InvoiceItemCreate(BaseModel):
    product_id: int
    quantity: float
    unit_rate: float # Wholesale selling rate
    discount_percent: float = 0.0
    tax_rate: float = 0.0

class InvoiceItemResponse(BaseModel):
    id: int
    invoice_id: int
    product_id: int
    sku: str
    product_name: str
    pack_size: Optional[str] = "1 unit"
    quantity: float
    unit: str
    unit_rate: float
    mrp: float
    discount_percent: float
    discount_amount: float
    tax_rate: float
    tax_amount: float
    total_amount: float

    model_config = ConfigDict(from_attributes=True)

class InvoiceCreate(BaseModel):
    shop_id: Optional[int] = None
    customer_name: str
    customer_phone: Optional[str] = None
    payment_mode: str = "CASH" # CASH, UPI, UDHAR_CREDIT, SPLIT
    paid_amount: Optional[float] = None
    notes: Optional[str] = None
    items: List[InvoiceItemCreate]

class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    shop_id: Optional[int] = None
    customer_name: str
    customer_phone: Optional[str] = None
    subtotal: float
    discount_amount: float
    tax_amount: float
    total_amount: float
    paid_amount: float
    balance_amount: float
    payment_mode: str
    payment_status: str
    notes: Optional[str] = None
    created_at: datetime
    items: List[InvoiceItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
