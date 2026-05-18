from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.dependencies import get_current_user
from ..database import get_db
from ..models import Lesson, Profile, UserProgress
from ..schemas import ProgressCreate, ProgressItem, ProgressListResponse

router = APIRouter()


def calculate_streak(last_activity: datetime | None, current_streak: int) -> int:
    if last_activity is None:
        return 1

    today = datetime.now(timezone.utc).date()
    previous_day = last_activity.astimezone(timezone.utc).date()
    diff = (today - previous_day).days

    if diff == 0:
        return current_streak
    if diff == 1:
        return current_streak + 1
    return 1


@router.get("", response_model=ProgressListResponse)
def list_progress(
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressListResponse:
    progress_rows = (
        db.query(UserProgress, Lesson.title)
        .join(Lesson, Lesson.id == UserProgress.lesson_id)
        .filter(UserProgress.user_id == current_user.id)
        .order_by(UserProgress.completed_at.desc())
        .all()
    )

    items = [
        ProgressItem(
            id=progress.id,
            lesson_id=progress.lesson_id,
            lesson_title=lesson_title,
            completed_at=progress.completed_at,
            score=progress.score,
            xp_earned=progress.xp_earned,
        )
        for progress, lesson_title in progress_rows
    ]
    return ProgressListResponse(items=items)


@router.post("", response_model=ProgressItem, status_code=status.HTTP_201_CREATED)
def save_progress(
    payload: ProgressCreate,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressItem:
    lesson = db.query(Lesson).filter(Lesson.id == payload.lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lección no encontrada",
        )

    now = datetime.now(timezone.utc)
    existing_progress = (
        db.query(UserProgress)
        .filter(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == payload.lesson_id,
        )
        .first()
    )

    previous_xp = existing_progress.xp_earned if existing_progress is not None else 0
    xp_delta = payload.xp_earned - previous_xp

    previous_last_activity = current_user.last_activity
    new_streak = calculate_streak(previous_last_activity, current_user.streak_days)

    if existing_progress is None:
        progress = UserProgress(
            user_id=current_user.id,
            lesson_id=payload.lesson_id,
            completed_at=now,
            score=payload.score,
            xp_earned=payload.xp_earned,
        )
        db.add(progress)
    else:
        existing_progress.completed_at = now
        existing_progress.score = payload.score
        existing_progress.xp_earned = payload.xp_earned
        progress = existing_progress

    current_user.xp_total = max(0, current_user.xp_total + xp_delta)
    current_user.last_activity = now
    current_user.streak_days = new_streak

    db.commit()
    db.refresh(progress)

    return ProgressItem(
        id=progress.id,
        lesson_id=progress.lesson_id,
        lesson_title=lesson.title,
        completed_at=progress.completed_at,
        score=progress.score,
        xp_earned=progress.xp_earned,
    )
