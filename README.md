# 💸 SpendWise — Full-Stack Expense Tracker

A production-ready expense tracking application built with:
- **Frontend**: React 18 + Vite + Recharts
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Deployment**: Docker + Docker Compose

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# Clone / unzip the project
cd expense-tracker

# Start everything in one command
docker compose up --build

# App runs at:
#   Frontend  → http://localhost:5173
#   Backend   → http://localhost:8000
#   API Docs  → http://localhost:8000/docs
```

---

### Option 2 — Local Development

#### 1. PostgreSQL

Make sure PostgreSQL is running. Create a database:

```sql
CREATE DATABASE expense_tracker;
```

#### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Seed default categories
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

API runs at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

#### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── main.py            # FastAPI app entry point
│   ├── database.py        # SQLAlchemy engine & session
│   ├── models.py          # ORM models (Expense, Category, Budget)
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── crud.py            # Database operations
│   ├── seed.py            # Seed default categories
│   ├── routers/
│   │   ├── expenses.py    # CRUD endpoints for expenses
│   │   ├── categories.py  # CRUD endpoints for categories
│   │   └── analytics.py   # Dashboard & chart data
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx       # React entry point
│   │   ├── App.jsx        # Router + sidebar layout
│   │   ├── index.css      # Global design system styles
│   │   ├── api/
│   │   │   └── api.js     # Axios API client
│   │   └── components/
│   │       ├── Dashboard.jsx     # Overview + recent transactions
│   │       ├── Expenses.jsx      # Full expense list with filters
│   │       ├── ExpenseModal.jsx  # Add / edit expense form
│   │       ├── Analytics.jsx     # Bar + pie charts
│   │       └── Categories.jsx    # Category management
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses/` | List expenses (filter by category, month, year, search) |
| POST | `/expenses/` | Create expense |
| PUT | `/expenses/{id}` | Update expense |
| DELETE | `/expenses/{id}` | Delete expense |
| GET | `/categories/` | List categories |
| POST | `/categories/` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |
| GET | `/analytics/dashboard` | Stats: totals, monthly change, top category |
| GET | `/analytics/by-category` | Spending breakdown by category |
| GET | `/analytics/monthly` | Monthly totals for a year |

Full interactive docs: **http://localhost:8000/docs**

---

## ✨ Features

- **Dashboard** — Overview cards, recent transactions, category progress bars
- **Expenses** — Add, edit, delete, filter by category/month/year/search
- **Analytics** — Monthly bar chart, category pie chart, percentage breakdown
- **Categories** — Custom categories with emoji icons and colors
- **Dark theme** — Sleek dark UI with purple accents
- **Responsive** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router v6 |
| Charts | Recharts |
| HTTP | Axios |
| Dates | date-fns |
| Toast | react-hot-toast |
| Icons | react-icons |
| Backend | FastAPI, Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic v2 |
| Database | PostgreSQL 16 |
| Containers | Docker, Docker Compose |

---

## 🔧 Environment Variables

**Backend `.env`:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_tracker
```

---

## 📜 License

MIT — free to use and modify.
