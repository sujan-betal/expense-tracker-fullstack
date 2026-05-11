from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database import get_db
import crud, schemas

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=schemas.DashboardStats)
def dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)


@router.get("/by-category", response_model=List[schemas.CategorySummary])
def by_category(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return crud.get_category_summary(db, month, year)


@router.get("/monthly", response_model=List[schemas.MonthlySummary])
def monthly(year: int = datetime.now().year, db: Session = Depends(get_db)):
    return crud.get_monthly_summary(db, year)
