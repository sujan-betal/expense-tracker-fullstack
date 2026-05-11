from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Optional, List
from datetime import datetime, date
import models
import schemas


# ─── Category CRUD ─────────────────────────────────────────────────────────────

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).order_by(models.Category.name).all()


def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def create_category(db: Session, data: schemas.CategoryCreate) -> models.Category:
    cat = models.Category(**data.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_category(db: Session, category_id: int, data: schemas.CategoryUpdate) -> Optional[models.Category]:
    cat = get_category(db, category_id)
    if not cat:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return cat


def delete_category(db: Session, category_id: int) -> bool:
    cat = get_category(db, category_id)
    if not cat:
        return False
    db.delete(cat)
    db.commit()
    return True


# ─── Expense CRUD ──────────────────────────────────────────────────────────────

def get_expenses(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
) -> List[models.Expense]:
    q = db.query(models.Expense)
    if category_id:
        q = q.filter(models.Expense.category_id == category_id)
    if month:
        q = q.filter(extract("month", models.Expense.date) == month)
    if year:
        q = q.filter(extract("year", models.Expense.date) == year)
    if search:
        q = q.filter(models.Expense.title.ilike(f"%{search}%"))
    return q.order_by(models.Expense.date.desc()).offset(skip).limit(limit).all()


def get_expense(db: Session, expense_id: int) -> Optional[models.Expense]:
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def create_expense(db: Session, data: schemas.ExpenseCreate) -> models.Expense:
    exp = models.Expense(**data.dict())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


def update_expense(db: Session, expense_id: int, data: schemas.ExpenseUpdate) -> Optional[models.Expense]:
    exp = get_expense(db, expense_id)
    if not exp:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(exp, k, v)
    db.commit()
    db.refresh(exp)
    return exp


def delete_expense(db: Session, expense_id: int) -> bool:
    exp = get_expense(db, expense_id)
    if not exp:
        return False
    db.delete(exp)
    db.commit()
    return True


# ─── Budget CRUD ───────────────────────────────────────────────────────────────

def get_budgets(db: Session, month: Optional[int] = None, year: Optional[int] = None) -> List[models.Budget]:
    q = db.query(models.Budget)
    if month:
        q = q.filter(models.Budget.month == month)
    if year:
        q = q.filter(models.Budget.year == year)
    return q.all()


def create_budget(db: Session, data: schemas.BudgetCreate) -> models.Budget:
    bud = models.Budget(**data.dict())
    db.add(bud)
    db.commit()
    db.refresh(bud)
    return bud


def delete_budget(db: Session, budget_id: int) -> bool:
    bud = db.query(models.Budget).filter(models.Budget.id == budget_id).first()
    if not bud:
        return False
    db.delete(bud)
    db.commit()
    return True


# ─── Analytics ─────────────────────────────────────────────────────────────────

def get_category_summary(db: Session, month: Optional[int] = None, year: Optional[int] = None):
    q = db.query(
        models.Expense.category_id,
        func.sum(models.Expense.amount).label("total"),
        func.count(models.Expense.id).label("count"),
    ).group_by(models.Expense.category_id)
    if month:
        q = q.filter(extract("month", models.Expense.date) == month)
    if year:
        q = q.filter(extract("year", models.Expense.date) == year)
    results = q.all()

    grand_total = sum(r.total for r in results) or 1
    summaries = []
    for r in results:
        cat = get_category(db, r.category_id) if r.category_id else None
        summaries.append(schemas.CategorySummary(
            category_id=r.category_id,
            category_name=cat.name if cat else "Uncategorized",
            category_icon=cat.icon if cat else "💰",
            category_color=cat.color if cat else "#94a3b8",
            total=r.total,
            count=r.count,
            percentage=round((r.total / grand_total) * 100, 2),
        ))
    return sorted(summaries, key=lambda x: x.total, reverse=True)


def get_monthly_summary(db: Session, year: int):
    results = db.query(
        extract("month", models.Expense.date).label("month"),
        func.sum(models.Expense.amount).label("total"),
        func.count(models.Expense.id).label("count"),
    ).filter(
        extract("year", models.Expense.date) == year
    ).group_by("month").order_by("month").all()

    return [schemas.MonthlySummary(month=int(r.month), year=year, total=r.total, count=r.count) for r in results]


def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    now = datetime.now()
    cur_m, cur_y = now.month, now.year
    last_m = cur_m - 1 if cur_m > 1 else 12
    last_y = cur_y if cur_m > 1 else cur_y - 1

    total = db.query(func.sum(models.Expense.amount)).scalar() or 0
    count = db.query(func.count(models.Expense.id)).scalar() or 0

    this_month = db.query(func.sum(models.Expense.amount)).filter(
        extract("month", models.Expense.date) == cur_m,
        extract("year", models.Expense.date) == cur_y,
    ).scalar() or 0

    last_month = db.query(func.sum(models.Expense.amount)).filter(
        extract("month", models.Expense.date) == last_m,
        extract("year", models.Expense.date) == last_y,
    ).scalar() or 0

    change_pct = 0.0
    if last_month > 0:
        change_pct = round(((this_month - last_month) / last_month) * 100, 2)

    cat_summary = get_category_summary(db, month=cur_m, year=cur_y)
    top_cat = cat_summary[0].category_name if cat_summary else None

    return schemas.DashboardStats(
        total_expenses=total,
        total_this_month=this_month,
        total_last_month=last_month,
        expense_count=count,
        top_category=top_cat,
        monthly_change_pct=change_pct,
    )
