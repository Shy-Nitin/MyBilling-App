from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.core.database import get_db
from backend.app.models.shop import Shop
from backend.app.models.ledger import LedgerEntry
from backend.app.schemas.shop import ShopCreate, ShopUpdate, ShopResponse

router = APIRouter()

class CollectPaymentRequest(BaseModel):
    amount: float
    payment_mode: str = "CASH" # CASH, UPI, BANK
    notes: Optional[str] = None

@router.get("", response_model=List[ShopResponse])
def list_shops(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Shop)
    if search:
        pattern = f"%{search}%"
        query = query.filter((Shop.name.ilike(pattern)) | (Shop.owner_name.ilike(pattern)) | (Shop.phone.ilike(pattern)))
    return query.order_by(Shop.current_balance.desc()).all()

@router.post("", response_model=ShopResponse)
def create_shop(shop_in: ShopCreate, db: Session = Depends(get_db)):
    shop = Shop(**shop_in.model_dump())
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found.")
    return shop

@router.put("/{shop_id}", response_model=ShopResponse)
def update_shop(shop_id: int, shop_in: ShopUpdate, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found.")
    
    update_data = shop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(shop, field, value)
    
    db.commit()
    db.refresh(shop)
    return shop

@router.post("/{shop_id}/collect-payment")
def collect_shop_payment(shop_id: int, req: CollectPaymentRequest, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).with_for_update().first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found.")
    
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Payment amount must be greater than 0.")

    # Deduct from Udhar balance
    shop.current_balance = max(0.0, shop.current_balance - req.amount)

    # Add ledger transaction
    entry_count = db.query(LedgerEntry).count() + 1
    ledger_entry = LedgerEntry(
        entry_number=f"RCT-{datetime.utcnow().strftime('%Y%m')}-{entry_count:05d}",
        transaction_date=datetime.utcnow(),
        reference_type="PAYMENT_RECEIVED",
        reference_id=f"SHOP-{shop.id}",
        shop_id=shop.id,
        account_type="CASH" if req.payment_mode == "CASH" else "BANK",
        description=f"Udhar Recovery from {shop.name} - {req.notes or 'Settlement'}",
        debit_amount=req.amount,
        credit_amount=0.0,
        running_balance=shop.current_balance,
        payment_mode=req.payment_mode
    )
    db.add(ledger_entry)

    db.commit()
    db.refresh(shop)
    return {
        "message": f"Successfully received ₹{req.amount:,.2f} from {shop.name}.",
        "new_balance": shop.current_balance
    }
