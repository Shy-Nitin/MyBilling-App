from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException
from backend.app.models.invoice import Invoice, InvoiceItem
from backend.app.models.product import Product
from backend.app.models.shop import Shop
from backend.app.models.ledger import LedgerEntry
from backend.app.schemas.invoice import InvoiceCreate

def generate_invoice_number(db: Session) -> str:
    count = db.query(Invoice).count() + 1
    today_str = datetime.utcnow().strftime("%Y%m%d")
    return f"INV-{today_str}-{count:04d}"

import uuid

def generate_entry_number(db: Session, offset: int = 0) -> str:
    count = db.query(LedgerEntry).count() + 1 + offset
    suffix = uuid.uuid4().hex[:4].upper()
    return f"JRN-{datetime.utcnow().strftime('%Y%m')}-{count:04d}-{suffix}"

def create_sale_invoice(db: Session, invoice_in: InvoiceCreate) -> Invoice:
    # 1. Validation & calculation
    if not invoice_in.items:
        raise HTTPException(status_code=400, detail="Invoice must contain at least one line item.")

    subtotal = 0.0
    total_discount = 0.0
    total_tax = 0.0

    line_items_data = []

    for item_in in invoice_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id).with_for_update().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with id {item_in.product_id} not found.")

        # Selling price determines total; MRP is informational
        selling_rate = item_in.unit_rate
        item_qty = item_in.quantity

        # Check stock (soft check or allow wholesale backorder with warning/decrement)
        product.stock_qty -= item_qty

        item_subtotal = selling_rate * item_qty
        item_disc = (item_subtotal * (item_in.discount_percent / 100.0))
        item_taxable = item_subtotal - item_disc
        item_tax = item_taxable * (item_in.tax_rate / 100.0)
        item_total = item_taxable + item_tax

        subtotal += item_subtotal
        total_discount += item_disc
        total_tax += item_tax

        line_items_data.append({
            "product_id": product.id,
            "sku": product.sku,
            "product_name": product.name,
            "pack_size": product.pack_size,
            "quantity": item_qty,
            "unit": product.unit or "PCS",
            "unit_rate": selling_rate,
            "unit_cost": product.landed_cost, # Store snapshot of landed cost for historical profit analytics
            "mrp": product.mrp,
            "discount_percent": item_in.discount_percent,
            "discount_amount": item_disc,
            "tax_rate": item_in.tax_rate,
            "tax_amount": item_tax,
            "total_amount": round(item_total, 2),
        })

    grand_total = round(subtotal - total_discount + total_tax, 2)
    
    # Determine paid vs balance
    if invoice_in.payment_mode in ["CASH", "UPI"]:
        paid_amount = grand_total if invoice_in.paid_amount is None else invoice_in.paid_amount
    elif invoice_in.payment_mode == "UDHAR_CREDIT":
        paid_amount = 0.0 if invoice_in.paid_amount is None else invoice_in.paid_amount
    else: # SPLIT
        paid_amount = invoice_in.paid_amount or 0.0

    balance_amount = max(0.0, round(grand_total - paid_amount, 2))
    
    if balance_amount == 0.0:
        payment_status = "PAID"
    elif paid_amount > 0.0:
        payment_status = "PARTIAL"
    else:
        payment_status = "UNPAID"

    # Create Invoice record
    invoice = Invoice(
        invoice_number=generate_invoice_number(db),
        shop_id=invoice_in.shop_id,
        customer_name=invoice_in.customer_name,
        customer_phone=invoice_in.customer_phone,
        subtotal=round(subtotal, 2),
        discount_amount=round(total_discount, 2),
        tax_amount=round(total_tax, 2),
        total_amount=grand_total,
        paid_amount=paid_amount,
        balance_amount=balance_amount,
        payment_mode=invoice_in.payment_mode,
        payment_status=payment_status,
        notes=invoice_in.notes,
        created_at=datetime.utcnow()
    )
    db.add(invoice)
    db.flush()

    # Create Invoice Items
    for item_data in line_items_data:
        item = InvoiceItem(
            invoice_id=invoice.id,
            **item_data
        )
        db.add(item)

    # If linked to a shop, update Udhar / shop balance
    if invoice_in.shop_id and balance_amount > 0:
        shop = db.query(Shop).filter(Shop.id == invoice_in.shop_id).with_for_update().first()
        if shop:
            shop.current_balance += balance_amount

    # Create double-entry ledger records
    # 1. Revenue Entry
    revenue_entry = LedgerEntry(
        entry_number=generate_entry_number(db, offset=0),
        transaction_date=datetime.utcnow(),
        reference_type="SALE_INVOICE",
        reference_id=invoice.invoice_number,
        shop_id=invoice.shop_id,
        account_type="REVENUE",
        description=f"Sales Invoice {invoice.invoice_number} - {invoice.customer_name}",
        credit_amount=grand_total,
        debit_amount=0.0,
        running_balance=0.0,
        payment_mode=invoice.payment_mode
    )
    db.add(revenue_entry)

    # 2. Cash/Bank received
    if paid_amount > 0:
        cash_entry = LedgerEntry(
            entry_number=generate_entry_number(db, offset=1),
            transaction_date=datetime.utcnow(),
            reference_type="PAYMENT_RECEIVED",
            reference_id=invoice.invoice_number,
            shop_id=invoice.shop_id,
            account_type="CASH" if invoice.payment_mode == "CASH" else "BANK",
            description=f"Payment for {invoice.invoice_number} ({invoice.payment_mode})",
            debit_amount=paid_amount,
            credit_amount=0.0,
            running_balance=0.0,
            payment_mode=invoice.payment_mode
        )
        db.add(cash_entry)

    # 3. Accounts Receivable (Udhar)
    if balance_amount > 0:
        ar_entry = LedgerEntry(
            entry_number=generate_entry_number(db, offset=2),
            transaction_date=datetime.utcnow(),
            reference_type="UDHAR_CREDIT",
            reference_id=invoice.invoice_number,
            shop_id=invoice.shop_id,
            account_type="ACCOUNTS_RECEIVABLE",
            description=f"Outstanding credit on {invoice.invoice_number} for {invoice.customer_name}",
            debit_amount=balance_amount,
            credit_amount=0.0,
            running_balance=0.0,
            payment_mode="UDHAR_CREDIT"
        )
        db.add(ar_entry)

    db.commit()
    db.refresh(invoice)
    return invoice
