from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.invoice import Invoice
from backend.app.models.settings import SystemSettings
from backend.app.schemas.invoice import InvoiceCreate, InvoiceResponse
from backend.app.services.billing_service import create_sale_invoice
from backend.app.services.pdf_service import generate_invoice_pdf

router = APIRouter()

@router.post("/invoices", response_model=InvoiceResponse)
def create_invoice(invoice_in: InvoiceCreate, db: Session = Depends(get_db)):
    invoice = create_sale_invoice(db, invoice_in)
    return invoice

@router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(limit: int = 50, shop_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Invoice)
    if shop_id:
        query = query.filter(Invoice.shop_id == shop_id)
    return query.order_by(Invoice.created_at.desc()).limit(limit).all()

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice_by_id(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    return invoice

@router.get("/invoices/{invoice_id}/pdf")
def download_invoice_pdf(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")
    
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings()

    pdf_bytes = generate_invoice_pdf(invoice, settings)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={invoice.invoice_number}.pdf"
        }
    )
