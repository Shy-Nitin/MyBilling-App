from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.core.database import get_db
from backend.app.models.purchase import PurchaseOrder, PurchaseItem
from backend.app.models.supplier import Supplier
from backend.app.models.product import Product
from backend.app.models.ledger import LedgerEntry
from backend.app.schemas.supplier import SupplierCreate, SupplierResponse
from backend.app.schemas.purchase import PurchaseOrderCreate, PurchaseOrderResponse

router = APIRouter()

class SupplierPaymentRequest(BaseModel):
    supplier_id: int
    amount: float
    payment_mode: str = "BANK" # BANK, CASH, CHEQUE
    notes: Optional[str] = None

@router.get("/suppliers", response_model=List[SupplierResponse])
def list_suppliers(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Supplier)
    if search:
        pattern = f"%{search}%"
        query = query.filter((Supplier.name.ilike(pattern)) | (Supplier.contact_person.ilike(pattern)))
    return query.order_by(Supplier.outstanding_balance.desc()).all()

@router.post("/suppliers", response_model=SupplierResponse)
def add_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    supplier = Supplier(**supplier_in.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get("", response_model=List[PurchaseOrderResponse])
def list_purchases(supplier_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(PurchaseOrder)
    if supplier_id:
        query = query.filter(PurchaseOrder.supplier_id == supplier_id)
    return query.order_by(PurchaseOrder.created_at.desc()).all()

@router.post("", response_model=PurchaseOrderResponse)
def create_purchase_order(po_in: PurchaseOrderCreate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == po_in.supplier_id).with_for_update().first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    po_count = db.query(PurchaseOrder).count() + 1
    po_number = f"PO-{datetime.utcnow().strftime('%Y%m')}-{po_count:04d}"

    subtotal = 0.0
    total_tax = 0.0
    items_to_add = []

    for item_in in po_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id).with_for_update().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_in.product_id} not found.")

        # Increment inventory stock
        product.stock_qty += item_in.quantity
        # Update landed cost if new cost is higher/different
        if item_in.unit_cost > 0:
            product.landed_cost = item_in.unit_cost

        item_sub = item_in.unit_cost * item_in.quantity
        item_tax = item_sub * (item_in.tax_rate / 100.0)
        item_tot = item_sub + item_tax

        subtotal += item_sub
        total_tax += item_tax

        items_to_add.append({
            "product_id": product.id,
            "sku": product.sku,
            "product_name": product.name,
            "quantity": item_in.quantity,
            "unit_cost": item_in.unit_cost,
            "tax_rate": item_in.tax_rate,
            "total_amount": round(item_tot, 2)
        })

    grand_total = round(subtotal + total_tax, 2)
    balance_amount = max(0.0, round(grand_total - po_in.paid_amount, 2))

    po = PurchaseOrder(
        po_number=po_number,
        supplier_id=supplier.id,
        vendor_invoice_no=po_in.vendor_invoice_no,
        order_date=po_in.order_date or datetime.utcnow(),
        received_date=datetime.utcnow(),
        subtotal=round(subtotal, 2),
        tax_amount=round(total_tax, 2),
        total_amount=grand_total,
        paid_amount=po_in.paid_amount,
        balance_amount=balance_amount,
        status="RECEIVED",
        notes=po_in.notes
    )
    db.add(po)
    db.flush()

    for item_data in items_to_add:
        p_item = PurchaseItem(purchase_id=po.id, **item_data)
        db.add(p_item)

    # Increase supplier accounts payable
    supplier.outstanding_balance += balance_amount

    # Ledger entry for purchase
    entry_count = db.query(LedgerEntry).count() + 1
    ledger_entry = LedgerEntry(
        entry_number=f"GRN-{datetime.utcnow().strftime('%Y%m')}-{entry_count:05d}",
        transaction_date=datetime.utcnow(),
        reference_type="PURCHASE_GRN",
        reference_id=po.po_number,
        supplier_id=supplier.id,
        account_type="ACCOUNTS_PAYABLE",
        description=f"Purchase GRN {po.po_number} from {supplier.name}",
        debit_amount=0.0,
        credit_amount=grand_total,
        running_balance=supplier.outstanding_balance,
        payment_mode="CREDIT"
    )
    db.add(ledger_entry)

    db.commit()
    db.refresh(po)
    return po

@router.post("/pay-supplier")
def pay_supplier(req: SupplierPaymentRequest, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == req.supplier_id).with_for_update().first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")

    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Payment amount must be greater than 0.")

    # Deduct outstanding payable
    supplier.outstanding_balance = max(0.0, supplier.outstanding_balance - req.amount)

    entry_count = db.query(LedgerEntry).count() + 1
    ledger_entry = LedgerEntry(
        entry_number=f"VOU-{datetime.utcnow().strftime('%Y%m')}-{entry_count:05d}",
        transaction_date=datetime.utcnow(),
        reference_type="SUPPLIER_PAYMENT",
        reference_id=f"SUPP-{supplier.id}",
        supplier_id=supplier.id,
        account_type="BANK" if req.payment_mode == "BANK" else "CASH",
        description=f"Disbursement to {supplier.name} - {req.notes or 'Settlement'}",
        debit_amount=0.0,
        credit_amount=req.amount,
        running_balance=supplier.outstanding_balance,
        payment_mode=req.payment_mode
    )
    db.add(ledger_entry)

    db.commit()
    db.refresh(supplier)
    return {
        "message": f"Disbursed ₹{req.amount:,.2f} to {supplier.name}.",
        "new_balance": supplier.outstanding_balance
    }
