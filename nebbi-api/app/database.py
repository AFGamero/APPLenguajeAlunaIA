# ============================================================
# Nebbi API — Configuración de base de datos (SQLAlchemy)
# ============================================================
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return database_url


# Neon serverless funciona mejor con conexiones conservadoras.
# La URL pooled de Neon ya hace parte del trabajo de multiplexación,
# así que evitamos un pool agresivo en la app.
engine = create_engine(
    normalize_database_url(settings.DATABASE_URL),
    # Reconecta cuando Neon despierta tras inactividad o recicla conexiones.
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=5,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency de FastAPI: provee una sesión de BD por request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
