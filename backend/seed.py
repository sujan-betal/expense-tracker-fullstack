"""Seed the database with default categories."""
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "icon": "🍽️", "color": "#f97316"},
    {"name": "Transport", "icon": "🚗", "color": "#3b82f6"},
    {"name": "Entertainment", "icon": "🎮", "color": "#8b5cf6"},
    {"name": "Health", "icon": "🏥", "color": "#10b981"},
    {"name": "Shopping", "icon": "🛍️", "color": "#ec4899"},
    {"name": "Utilities", "icon": "💡", "color": "#f59e0b"},
    {"name": "Education", "icon": "📚", "color": "#6366f1"},
    {"name": "Travel", "icon": "✈️", "color": "#14b8a6"},
    {"name": "Other", "icon": "💰", "color": "#94a3b8"},
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(models.Category).count()
        if existing == 0:
            for cat in DEFAULT_CATEGORIES:
                db.add(models.Category(**cat))
            db.commit()
            print(f"✅ Seeded {len(DEFAULT_CATEGORIES)} categories")
        else:
            print(f"ℹ️  Database already has {existing} categories, skipping seed")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
