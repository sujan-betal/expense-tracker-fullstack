from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import crud, schemas

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("/", response_model=List[schemas.ExpenseOut])
def list_expenses(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.get_expenses(db, skip, limit, category_id, month, year, search)


@router.get("/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    exp = crud.get_expense(db, expense_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    return exp


@router.post("/", response_model=schemas.ExpenseOut, status_code=201)
def create_expense(data: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    return crud.create_expense(db, data)


@router.put("/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(expense_id: int, data: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    exp = crud.update_expense(db, expense_id, data)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    return exp


@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_expense(db, expense_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Deleted successfully"}
