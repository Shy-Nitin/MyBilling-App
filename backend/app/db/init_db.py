from datetime import datetime, timedelta
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.models.product import Product
from backend.app.models.shop import Shop
from backend.app.models.supplier import Supplier
from backend.app.models.invoice import Invoice, InvoiceItem
from backend.app.models.purchase import PurchaseOrder, PurchaseItem
from backend.app.models.ledger import LedgerEntry
from backend.app.models.settings import SystemSettings

def init_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if settings already exist
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings(
            store_name="MyBilling Wholesale & Retail",
            tagline="Executive Precision ERP",
            branch_name="Wholesale Branch #1",
            gstin="27AABCS1429B1Z0",
            phone="+91 98200 12345",
            email="billing@mybilling.corp",
            address="Shop #4-B, APMC Market Yard, Phase II, Mumbai 400703",
            currency_symbol="₹",
            tax_rate_default=18.0,
            bill_header="TAX INVOICE / CASH MEMO",
            bill_footer="Thank you for your business! All squared away, Boss.",
            terms_and_conditions="1. Goods once sold will not be returned without original invoice.\n2. Overdue bills attract 18% p.a. interest.\n3. Subject to local jurisdiction.",
            show_logo=True,
            show_barcode=True,
            show_qr=True,
            upi_id="mybilling@okhdfcbank",
            enable_sound=True,
            playful_mode=True
        )
        db.add(settings)

    # Seed Products if empty
    if db.query(Product).count() == 0:
        sample_products = [
            Product(
                sku="SKU-RICE-BAS-50",
                barcode="8901234567890",
                name="Royal Royal Basmati Rice (Aged 2 Yrs)",
                brand="Royal Mills",
                category="Staples & Grains",
                pack_size="50 KG Bag",
                landed_cost=3200.0,
                wholesale_rate=3650.0,
                mrp=4200.0,
                stock_qty=145.0,
                min_stock_threshold=25.0,
                unit="BAG",
                is_active=True
            ),
            Product(
                sku="SKU-OIL-SUN-15L",
                barcode="8902345678901",
                name="Fortune Refined Sunflower Oil Tin",
                brand="Fortune",
                category="Edible Oils",
                pack_size="15 Ltr Tin",
                landed_cost=1850.0,
                wholesale_rate=2040.0,
                mrp=2350.0,
                stock_qty=88.0,
                min_stock_threshold=20.0,
                unit="TIN",
                is_active=True
            ),
            Product(
                sku="SKU-SUGAR-PREM-50",
                barcode="8903456789012",
                name="Madhur Pure & Hygienic Sulphur-Free Sugar",
                brand="Madhur",
                category="Staples & Grains",
                pack_size="50 KG Bag",
                landed_cost=1950.0,
                wholesale_rate=2180.0,
                mrp=2500.0,
                stock_qty=18.0, # Low Stock / Restock Alert
                min_stock_threshold=30.0,
                unit="BAG",
                is_active=True
            ),
            Product(
                sku="SKU-ATTA-CHAK-30",
                barcode="8904567890123",
                name="Aashirvaad Shudh Chakki Atta Master Pack",
                brand="Aashirvaad",
                category="Staples & Grains",
                pack_size="30 KG Sack",
                landed_cost=1120.0,
                wholesale_rate=1280.0,
                mrp=1450.0,
                stock_qty=210.0,
                min_stock_threshold=40.0,
                unit="SACK",
                is_active=True
            ),
            Product(
                sku="SKU-TEA-GOLD-1KG",
                barcode="8905678901234",
                name="Tata Tea Gold Premium Assam Leaves",
                brand="Tata",
                category="Beverages & Dairy",
                pack_size="1 KG Box (Case of 10)",
                landed_cost=420.0,
                wholesale_rate=485.0,
                mrp=560.0,
                stock_qty=65.0,
                min_stock_threshold=15.0,
                unit="CASE",
                is_active=True
            ),
            Product(
                sku="SKU-SOAP-DOVE-48",
                barcode="8906789012345",
                name="Dove Beauty Moisture Bar Wholesale Carton",
                brand="Unilever",
                category="Personal Care",
                pack_size="48 Pcs Carton",
                landed_cost=1920.0,
                wholesale_rate=2250.0,
                mrp=2640.0,
                stock_qty=4.0, # Critically Depleted
                min_stock_threshold=15.0,
                unit="CTN",
                is_active=True
            ),
            Product(
                sku="SKU-BIS-PARLE-120",
                barcode="8907890123456",
                name="Parle-G Gold Glucose Biscuits Master Box",
                brand="Parle",
                category="Snacks & Confectionery",
                pack_size="120 Pcs Box",
                landed_cost=580.0,
                wholesale_rate=675.0,
                mrp=750.0,
                stock_qty=340.0,
                min_stock_threshold=50.0,
                unit="BOX",
                is_active=True
            ),
            Product(
                sku="SKU-DALS-TOOR-25",
                barcode="8908901234567",
                name="Organic Select Unpolished Toor Dal",
                brand="Select",
                category="Staples & Grains",
                pack_size="25 KG Bag",
                landed_cost=3100.0,
                wholesale_rate=3480.0,
                mrp=3900.0,
                stock_qty=75.0,
                min_stock_threshold=20.0,
                unit="BAG",
                is_active=True
            ),
        ]
        db.add_all(sample_products)
        db.flush()

    # Seed Shops if empty
    if db.query(Shop).count() == 0:
        sample_shops = [
            Shop(
                name="Laxmi Supermarket & General Store",
                owner_name="Rameshwar Patel",
                phone="98211 44556",
                gstin="27AALCP1234F1Z8",
                address="Sector 14, Vashi Highway",
                area="Navi Mumbai",
                credit_limit=150000.0,
                current_balance=42500.0,
                tier="VIP Wholesaler",
                status="Active"
            ),
            Shop(
                name="Shree Ganesh Kirana Corner",
                owner_name="Ganesh Gupta",
                phone="98332 99881",
                gstin="27BBPGG8877K2Z4",
                address="Near Railway Station, Thane West",
                area="Thane",
                credit_limit=80000.0,
                current_balance=68200.0,
                tier="Regular",
                status="Warning" # High credit utilization
            ),
            Shop(
                name="Bharat Provision Mart",
                owner_name="Dinesh Shah",
                phone="98190 77665",
                gstin="27AAEFB4321D1ZQ",
                address="Gala #12, Market Rd, Dadar",
                area="Central Mumbai",
                credit_limit=200000.0,
                current_balance=18400.0,
                tier="VIP Wholesaler",
                status="Active"
            ),
            Shop(
                name="Balaji Daily Essentials",
                owner_name="Venkat Raman",
                phone="98670 11223",
                gstin="27CCDBE9988M1P2",
                address="Shop 5, Chembur Colony",
                area="Chembur",
                credit_limit=60000.0,
                current_balance=0.0,
                tier="Standard",
                status="Active"
            ),
        ]
        db.add_all(sample_shops)
        db.flush()

    # Seed Suppliers if empty
    if db.query(Supplier).count() == 0:
        sample_suppliers = [
            Supplier(
                name="AgroCorp National Trading Ltd",
                contact_person="Vipin Aggarwal",
                phone="98200 44332",
                email="vipin@agrocorp.com",
                gstin="27AAACA9921C1Z4",
                address="Plot 55, MIDC Industrial Area, Turbhe",
                city="Navi Mumbai",
                outstanding_balance=124000.0,
                payment_terms_days=30,
                status="Active"
            ),
            Supplier(
                name="Premier Consumer Goods Distributors",
                contact_person="Harish Mehta",
                phone="98112 33445",
                email="sales@premierdistributors.in",
                gstin="27BBBPG7766K1Z9",
                address="Gala 301, Cotton Green Warehousing",
                city="Mumbai",
                outstanding_balance=48500.0,
                payment_terms_days=15,
                status="Active"
            ),
            Supplier(
                name="Hindustan Edible Commodities Syndicate",
                contact_person="Suresh Jain",
                phone="98920 66778",
                email="orders@hecsyndicate.com",
                gstin="27CCCHE1122N1Z1",
                address="Grain Market, Masjid Bunder",
                city="South Mumbai",
                outstanding_balance=85000.0,
                payment_terms_days=21,
                status="Active"
            ),
        ]
        db.add_all(sample_suppliers)
        db.flush()

    # Seed Sample Invoices if empty
    if db.query(Invoice).count() == 0:
        prod1 = db.query(Product).first()
        prod2 = db.query(Product).offset(1).first()
        shop1 = db.query(Shop).first()

        inv1 = Invoice(
            invoice_number="INV-20261023-0001",
            shop_id=shop1.id if shop1 else None,
            customer_name="Laxmi Supermarket",
            customer_phone="98211 44556",
            subtotal=24800.0,
            discount_amount=400.0,
            tax_amount=2440.0,
            total_amount=26840.0,
            paid_amount=26840.0,
            balance_amount=0.0,
            payment_mode="UPI",
            payment_status="PAID",
            notes="Delivered via Branch Van #2",
            created_at=datetime.utcnow() - timedelta(hours=3)
        )
        db.add(inv1)
        db.flush()

        item1 = InvoiceItem(
            invoice_id=inv1.id,
            product_id=prod1.id,
            sku=prod1.sku,
            product_name=prod1.name,
            pack_size=prod1.pack_size,
            quantity=5.0,
            unit=prod1.unit,
            unit_rate=prod1.wholesale_rate,
            unit_cost=prod1.landed_cost,
            mrp=prod1.mrp,
            discount_percent=0.0,
            discount_amount=0.0,
            tax_rate=5.0,
            tax_amount=912.5,
            total_amount=19162.5
        )
        db.add(item1)

        # Seed double entry
        rev_entry = LedgerEntry(
            entry_number="JRN-202610-00001",
            transaction_date=inv1.created_at,
            reference_type="SALE_INVOICE",
            reference_id=inv1.invoice_number,
            shop_id=inv1.shop_id,
            account_type="REVENUE",
            description=f"Sales Invoice {inv1.invoice_number}",
            credit_amount=inv1.total_amount,
            debit_amount=0.0,
            running_balance=26840.0,
            payment_mode=inv1.payment_mode
        )
        db.add(rev_entry)

    db.commit()
    db.close()
