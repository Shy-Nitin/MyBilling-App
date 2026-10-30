from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class LedgerEntryCreate(BaseModel):
    transaction_date: Optional[datetime] = None
    reference_type: str
    reference_id: Optional[str] = None
    shop_id: Optional[int] = None
    supplier_id: Optional[int] = None
    account_type: str = "CASH"
    description: str
    debit_amount: float = 0.0
    credit_amount: float = 0.0
    payment_mode: str = "CASH"

class LedgerEntryResponse(BaseModel):
    id: int
    entry_number: str
    transaction_date: datetime
    reference_type: str
    reference_id: Optional[str] = None
    shop_id: Optional[int] = None
    supplier_id: Optional[int] = None
    account_type: str
    description: str
    debit_amount: float
    credit_amount: float
    running_balance: float
    payment_mode: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
