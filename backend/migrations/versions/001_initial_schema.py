"""initial_schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-10-23 18:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. products
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=False),
        sa.Column('barcode', sa.String(length=50), nullable=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('brand', sa.String(length=100), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('pack_size', sa.String(length=50), nullable=True),
        sa.Column('landed_cost', sa.Float(), nullable=False),
        sa.Column('wholesale_rate', sa.Float(), nullable=False),
        sa.Column('mrp', sa.Float(), nullable=False),
        sa.Column('stock_qty', sa.Float(), nullable=False),
        sa.Column('min_stock_threshold', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=20), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=True)
    op.create_index(op.f('ix_products_barcode'), 'products', ['barcode'], unique=False)

    # 2. shops
    op.create_table(
        'shops',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('owner_name', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('gstin', sa.String(length=30), nullable=True),
        sa.Column('address', sa.String(length=300), nullable=True),
        sa.Column('area', sa.String(length=100), nullable=True),
        sa.Column('credit_limit', sa.Float(), nullable=True),
        sa.Column('current_balance', sa.Float(), nullable=True),
        sa.Column('tier', sa.String(length=20), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # 3. suppliers
    op.create_table(
        'suppliers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('contact_person', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('gstin', sa.String(length=30), nullable=True),
        sa.Column('address', sa.String(length=300), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('outstanding_balance', sa.Float(), nullable=True),
        sa.Column('payment_terms_days', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # 4. invoices
    op.create_table(
        'invoices',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('invoice_number', sa.String(length=50), nullable=False),
        sa.Column('shop_id', sa.Integer(), nullable=True),
        sa.Column('customer_name', sa.String(length=150), nullable=False),
        sa.Column('customer_phone', sa.String(length=20), nullable=True),
        sa.Column('subtotal', sa.Float(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=True),
        sa.Column('tax_amount', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=True),
        sa.Column('paid_amount', sa.Float(), nullable=True),
        sa.Column('balance_amount', sa.Float(), nullable=True),
        sa.Column('payment_mode', sa.String(length=30), nullable=True),
        sa.Column('payment_status', sa.String(length=30), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['shop_id'], ['shops.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoices_invoice_number'), 'invoices', ['invoice_number'], unique=True)

    # 5. invoice_items
    op.create_table(
        'invoice_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('invoice_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=False),
        sa.Column('product_name', sa.String(length=200), nullable=False),
        sa.Column('pack_size', sa.String(length=50), nullable=True),
        sa.Column('quantity', sa.Float(), nullable=True),
        sa.Column('unit', sa.String(length=20), nullable=True),
        sa.Column('unit_rate', sa.Float(), nullable=True),
        sa.Column('unit_cost', sa.Float(), nullable=True),
        sa.Column('mrp', sa.Float(), nullable=True),
        sa.Column('discount_percent', sa.Float(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=True),
        sa.Column('tax_rate', sa.Float(), nullable=True),
        sa.Column('tax_amount', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 6. purchase_orders
    op.create_table(
        'purchase_orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('po_number', sa.String(length=50), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('vendor_invoice_no', sa.String(length=100), nullable=True),
        sa.Column('order_date', sa.DateTime(), nullable=True),
        sa.Column('received_date', sa.DateTime(), nullable=True),
        sa.Column('subtotal', sa.Float(), nullable=True),
        sa.Column('tax_amount', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=True),
        sa.Column('paid_amount', sa.Float(), nullable=True),
        sa.Column('balance_amount', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_purchase_orders_po_number'), 'purchase_orders', ['po_number'], unique=True)

    # 7. purchase_items
    op.create_table(
        'purchase_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('purchase_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=False),
        sa.Column('product_name', sa.String(length=200), nullable=False),
        sa.Column('quantity', sa.Float(), nullable=True),
        sa.Column('unit_cost', sa.Float(), nullable=True),
        sa.Column('tax_rate', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['purchase_id'], ['purchase_orders.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 8. ledger_entries
    op.create_table(
        'ledger_entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('entry_number', sa.String(length=50), nullable=False),
        sa.Column('transaction_date', sa.DateTime(), nullable=True),
        sa.Column('reference_type', sa.String(length=50), nullable=False),
        sa.Column('reference_id', sa.String(length=50), nullable=True),
        sa.Column('shop_id', sa.Integer(), nullable=True),
        sa.Column('supplier_id', sa.Integer(), nullable=True),
        sa.Column('account_type', sa.String(length=50), nullable=True),
        sa.Column('description', sa.String(length=300), nullable=False),
        sa.Column('debit_amount', sa.Float(), nullable=True),
        sa.Column('credit_amount', sa.Float(), nullable=True),
        sa.Column('running_balance', sa.Float(), nullable=True),
        sa.Column('payment_mode', sa.String(length=30), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['shop_id'], ['shops.id'], ),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ledger_entries_entry_number'), 'ledger_entries', ['entry_number'], unique=True)

    # 9. system_settings
    op.create_table(
        'system_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('store_name', sa.String(length=200), nullable=True),
        sa.Column('tagline', sa.String(length=200), nullable=True),
        sa.Column('branch_name', sa.String(length=100), nullable=True),
        sa.Column('gstin', sa.String(length=50), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('email', sa.String(length=100), nullable=True),
        sa.Column('address', sa.String(length=300), nullable=True),
        sa.Column('currency_symbol', sa.String(length=10), nullable=True),
        sa.Column('tax_rate_default', sa.Float(), nullable=True),
        sa.Column('bill_header', sa.String(length=200), nullable=True),
        sa.Column('bill_footer', sa.String(length=300), nullable=True),
        sa.Column('terms_and_conditions', sa.Text(), nullable=True),
        sa.Column('show_logo', sa.Boolean(), nullable=True),
        sa.Column('show_barcode', sa.Boolean(), nullable=True),
        sa.Column('show_qr', sa.Boolean(), nullable=True),
        sa.Column('upi_id', sa.String(length=100), nullable=True),
        sa.Column('enable_sound', sa.Boolean(), nullable=True),
        sa.Column('playful_mode', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('system_settings')
    op.drop_table('ledger_entries')
    op.drop_table('purchase_items')
    op.drop_table('purchase_orders')
    op.drop_table('invoice_items')
    op.drop_table('invoices')
    op.drop_table('suppliers')
    op.drop_table('shops')
    op.drop_table('products')
