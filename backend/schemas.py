from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


# ─── Category Schemas ──────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = "💰"
    color: Optional[str] = "#6366f1"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Expense Schemas ───────────────────────────────────────────────────────────

class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    category_id: Optional[int] = None
    date: datetime


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None


class ExpenseOut(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


# ─── Budget Schemas ────────────────────────────────────────────────────────────

class BudgetBase(BaseModel):
    category_id: Optional[int] = None
    amount: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2000)


class BudgetCreate(BudgetBase):
    pass


class BudgetOut(BudgetBase):
    id: int
    created_at: datetime
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


# ─── Summary Schemas ───────────────────────────────────────────────────────────

class CategorySummary(BaseModel):
    category_id: Optional[int]
    category_name: str
    category_icon: str
    category_color: str
    total: float
    count: int
    percentage: float


class MonthlySummary(BaseModel):
    month: int
    year: int
    total: float
    count: int


class DashboardStats(BaseModel):
    total_expenses: float
    total_this_month: float
    total_last_month: float
    expense_count: int
    top_category: Optional[str]
    monthly_change_pct: float
