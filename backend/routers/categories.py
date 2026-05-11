from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import crud, schemas

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@router.get("/{category_id}", response_model=schemas.CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = crud.get_category(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.post("/", response_model=schemas.CategoryOut, status_code=201)
def create_category(data: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, data)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(category_id: int, data: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    cat = crud.update_category(db, category_id, data)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_category(db, category_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Deleted successfully"}
