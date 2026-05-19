from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..core.dependencies import get_admin_user
from ..database import get_db
from ..models import Lesson, Module, Profile, UserProgress
from ..schemas import (
    AdminDeleteResponse,
    AdminLessonDetailResponse,
    AdminLessonListItem,
    AdminLessonUpsert,
    AdminModuleResponse,
    AdminStatsResponse,
)

router = APIRouter()


def _validate_lesson_content(content: dict) -> None:
    vocab = content.get("vocab")
    exercises = content.get("exercises")
    if not isinstance(vocab, list) or not isinstance(exercises, list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El contenido debe tener la forma { vocab: [], exercises: [] }",
        )


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> AdminStatsResponse:
    users = db.query(func.count(Profile.id)).scalar() or 0
    lessons_completed = db.query(func.count(UserProgress.id)).scalar() or 0
    total_xp = db.query(func.coalesce(func.sum(Profile.xp_total), 0)).scalar() or 0

    return AdminStatsResponse(
        users=int(users),
        lessons_completed=int(lessons_completed),
        total_xp=int(total_xp),
    )


@router.get("/modules", response_model=list[AdminModuleResponse])
def list_admin_modules(
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> list[Module]:
    return db.query(Module).order_by(Module.order_index).all()


@router.get("/lessons", response_model=list[AdminLessonListItem])
def list_admin_lessons(
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> list[Lesson]:
    return (
        db.query(Lesson)
        .join(Module, Module.id == Lesson.module_id)
        .order_by(Module.order_index, Lesson.order_index)
        .all()
    )


@router.get("/lessons/{lesson_id}", response_model=AdminLessonDetailResponse)
def get_admin_lesson(
    lesson_id: UUID,
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> Lesson:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada",
        )
    return lesson


@router.post("/lessons", response_model=AdminLessonDetailResponse, status_code=status.HTTP_201_CREATED)
def create_admin_lesson(
    payload: AdminLessonUpsert,
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> Lesson:
    _validate_lesson_content(payload.content)
    module = db.query(Module).filter(Module.id == payload.module_id).first()
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Módulo no encontrado",
        )

    lesson = Lesson(
        module_id=payload.module_id,
        title=payload.title,
        order_index=payload.order_index,
        xp_reward=payload.xp_reward,
        content=payload.content,
    )
    db.add(lesson)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una lección con ese orden en el módulo",
        )
    db.refresh(lesson)
    return lesson


@router.patch("/lessons/{lesson_id}", response_model=AdminLessonDetailResponse)
def update_admin_lesson(
    lesson_id: UUID,
    payload: AdminLessonUpsert,
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> Lesson:
    _validate_lesson_content(payload.content)
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada",
        )

    module = db.query(Module).filter(Module.id == payload.module_id).first()
    if module is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Módulo no encontrado",
        )

    lesson.module_id = payload.module_id
    lesson.title = payload.title
    lesson.order_index = payload.order_index
    lesson.xp_reward = payload.xp_reward
    lesson.content = payload.content

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una lección con ese orden en el módulo",
        )
    db.refresh(lesson)
    return lesson


@router.delete("/lessons/{lesson_id}", response_model=AdminDeleteResponse)
def delete_admin_lesson(
    lesson_id: UUID,
    _: Profile = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> AdminDeleteResponse:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada",
        )

    db.delete(lesson)
    db.commit()
    return AdminDeleteResponse(deleted=True)
