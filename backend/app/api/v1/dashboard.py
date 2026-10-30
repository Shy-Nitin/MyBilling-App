from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.report import DashboardMetrics
from backend.app.services.report_service import get_dashboard_metrics

router = APIRouter()

@router.get("/metrics", response_model=DashboardMetrics)
def read_dashboard_metrics(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)
