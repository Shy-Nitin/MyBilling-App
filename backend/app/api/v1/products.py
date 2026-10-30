from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from backend.app.services.inventory_service import get_products, get_inventory_valuation, get_stock_status

router = APIRouter()

@router.get("", response_model=List[ProductResponse])
def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_products(db, search=search, category=category, status=status)

@router.get("/valuation")
def inventory_valuation(db: Session = Depends(get_db)):
    return get_inventory_valuation(db)

@router.post("", response_model=ProductResponse)
def add_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(Product.sku == product_in.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product SKU {product_in.sku} already exists.")
    
    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    
    resp = ProductResponse.model_validate(product)
    resp.stock_status = get_stock_status(product.stock_qty, product.min_stock_threshold)
    return resp

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    resp = ProductResponse.model_validate(product)
    resp.stock_status = get_stock_status(product.stock_qty, product.min_stock_threshold)
    return resp

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    resp = ProductResponse.model_validate(product)
    resp.stock_status = get_stock_status(product.stock_qty, product.min_stock_threshold)
    return resp

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.is_active = False
    db.commit()
    return {"message": f"Product {product.sku} deactivated successfully."}
