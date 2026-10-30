from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class DailySalesPulse(BaseModel):
    time: str
    sales: float
    cash_in: float
    is_forecast: bool = False

class DashboardMetrics(BaseModel):
    gross_revenue_today: float
    gross_revenue_change: float
    net_profit_today: float
    net_profit_change: float
    unsettled_udhar: float
    unsettled_udhar_count: int
    daily_velocity_invoices: int
    daily_velocity_change: float
    sales_pulse: List[DailySalesPulse]
    recent_invoices: List[Dict[str, Any]]

class ProfitAnalyticsPoint(BaseModel):
    label: str # e.g. "Mon", "Tue" or date
    gross_revenue: float
    net_profit: float
    prior_revenue: float
    margin_percent: float

class CategoryMargin(BaseModel):
    category: str
    items_sold: float
    revenue: float
    cogs: float # Cost of goods sold
    gross_profit: float
    margin_percent: float

class TaxSummary(BaseModel):
    taxable_amount: float
    cgst_amount: float
    sgst_amount: float
    igst_amount: float
    total_tax: float
