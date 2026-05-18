from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.dependencies import get_current_user
from ..database import get_db
from ..models import Lesson, Profile
from ..schemas import LessonDetailResponse

router = APIRouter()


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
def get_lesson(
    lesson_id: UUID,
    _: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LessonDetailResponse:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada",
        )
    return lesson
