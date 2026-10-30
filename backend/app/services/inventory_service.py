from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from backend.app.models.product import Product
from backend.app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

def get_stock_status(stock_qty: float, min_threshold: float) -> str:
    if stock_qty <= 0:
        return "DEPLETED"
    elif stock_qty < min_threshold * 0.5:
        return "LOW"
    elif stock_qty <= min_threshold:
        return "MODERATE"
    else:
        return "SAFE"

def get_products(db: Session, search: Optional[str] = None, category: Optional[str] = None, status: Optional[str] = None) -> List[ProductResponse]:
    query = db.query(Product).filter(Product.is_active == True)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) | 
            (Product.sku.ilike(search_pattern)) |
            (Product.barcode.ilike(search_pattern)) |
            (Product.brand.ilike(search_pattern))
        )
    
    if category and category != "All":
        query = query.filter(Product.category == category)

    products = query.order_by(Product.id.asc()).all()
    results = []
    
    for p in products:
        st = get_stock_status(p.stock_qty, p.min_stock_threshold)
        if status and status != "All" and st != status.upper():
            continue
        
        resp = ProductResponse.model_validate(p)
        resp.stock_status = st
        results.append(resp)
        
    return results

def get_inventory_valuation(db: Session) -> dict:
    products = db.query(Product).filter(Product.is_active == True).all()
    total_cost_valuation = sum(p.landed_cost * max(0.0, p.stock_qty) for p in products)
    total_wholesale_valuation = sum(p.wholesale_rate * max(0.0, p.stock_qty) for p in products)
    total_items = len(products)
    low_stock_items = sum(1 for p in products if p.stock_qty <= p.min_stock_threshold)
    
    return {
        "cost_valuation": round(total_cost_valuation, 2),
        "wholesale_valuation": round(total_wholesale_valuation, 2),
        "total_sku_count": total_items,
        "low_stock_count": low_stock_items,
    }
