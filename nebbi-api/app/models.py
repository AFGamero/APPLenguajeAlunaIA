# ============================================================
# Nebbi API — Modelos SQLAlchemy
# Replica el esquema de Supabase pero gestionado por nosotros
# ============================================================
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, DateTime, ForeignKey,
    UniqueConstraint, JSON, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    """Usuarios del sistema — credenciales de autenticación."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación 1-a-1 con Profile
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Profile(Base):
    """Perfil público del estudiante: XP, racha, rol."""
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    display_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="estudiante")  # "estudiante" | "admin"
    xp_total = Column(Integer, nullable=False, default=0)
    streak_days = Column(Integer, nullable=False, default=0)
    last_activity = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    user = relationship("User", back_populates="profile")
    progress = relationship("UserProgress", back_populates="profile", cascade="all, delete-orphan")


class Module(Base):
    """Módulos temáticos del curso (ej: Naturaleza y territorio)."""
    __tablename__ = "modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False, unique=True)
    description = Column(String, nullable=True)

    # Relación con lecciones
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan",
                           order_by="Lesson.order_index")


class Lesson(Base):
    """Lecciones dentro de cada módulo. El contenido es JSON (vocab + ejercicios)."""
    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    xp_reward = Column(Integer, nullable=False, default=30)
    content = Column(JSON, nullable=False)  # { "vocab": [...], "exercises": [...] }

    __table_args__ = (
        UniqueConstraint("module_id", "order_index", name="uq_lesson_module_order"),
    )

    # Relaciones
    module = relationship("Module", back_populates="lessons")
    progress = relationship("UserProgress", back_populates="lesson", cascade="all, delete-orphan")


class UserProgress(Base):
    """Registro de lecciones completadas por cada usuario."""
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer, nullable=False)
    xp_earned = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_progress_user_lesson"),
    )

    # Relaciones
    profile = relationship("Profile", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")
