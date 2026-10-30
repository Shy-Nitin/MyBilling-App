from pydantic import BaseModel, ConfigDict
from typing import Optional

class SystemSettingsBase(BaseModel):
    store_name: str
    tagline: Optional[str] = None
    branch_name: str
    gstin: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    currency_symbol: str = "₹"
    tax_rate_default: float = 18.0
    bill_header: str
    bill_footer: str
    terms_and_conditions: str
    show_logo: bool = True
    show_barcode: bool = True
    show_qr: bool = True
    upi_id: Optional[str] = None
    enable_sound: bool = True
    playful_mode: bool = True

class SystemSettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    tagline: Optional[str] = None
    branch_name: Optional[str] = None
    gstin: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    currency_symbol: Optional[str] = None
    tax_rate_default: Optional[float] = None
    bill_header: Optional[str] = None
    bill_footer: Optional[str] = None
    terms_and_conditions: Optional[str] = None
    show_logo: Optional[bool] = None
    show_barcode: Optional[bool] = None
    show_qr: Optional[bool] = None
    upi_id: Optional[str] = None
    enable_sound: Optional[bool] = None
    playful_mode: Optional[bool] = None

class SystemSettingsResponse(SystemSettingsBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
