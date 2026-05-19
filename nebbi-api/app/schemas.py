# ============================================================
# Nebbi API — Schemas Pydantic (request / response)
# ============================================================
from datetime import datetime
from uuid import UUID
from typing import Any, Optional
from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, StringConstraints


PasswordStr = Annotated[str, StringConstraints(min_length=6, max_length=72)]


# ── Auth ──────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: PasswordStr
    display_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: PasswordStr


class UserOut(BaseModel):
    id: UUID
    email: str
    display_name: str
    role: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Modules ───────────────────────────────────────────────────

class LessonSummary(BaseModel):
    id: UUID
    title: str
    order_index: int
    xp_reward: int

    model_config = {"from_attributes": True}


class ModuleResponse(BaseModel):
    id: UUID
    title: str
    order_index: int
    description: Optional[str]
    lessons: list[LessonSummary]

    model_config = {"from_attributes": True}


# ── Lessons ───────────────────────────────────────────────────

class LessonDetailResponse(BaseModel):
    id: UUID
    title: str
    xp_reward: int
    content: Any  # { "vocab": [...], "exercises": [...] }

    model_config = {"from_attributes": True}


# ── Progress ──────────────────────────────────────────────────

class ProgressCreate(BaseModel):
    lesson_id: UUID
    score: int
    xp_earned: int


class ProgressItem(BaseModel):
    id: UUID
    lesson_id: UUID
    lesson_title: str
    completed_at: datetime
    score: int
    xp_earned: int

    model_config = {"from_attributes": True}


class ProgressListResponse(BaseModel):
    items: list[ProgressItem]


# ── Profile ───────────────────────────────────────────────────

class ProfileResponse(BaseModel):
    display_name: str
    role: str
    xp_total: int
    streak_days: int
    last_activity: Optional[datetime]

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    display_name: str
