from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import expenses, categories, analytics

# Create all tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Expense Tracker API",
    description="Full-stack expense tracking application",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(expenses.router)
app.include_router(categories.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"message": "Expense Tracker API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
