from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.dependencies import get_current_user
from ..database import get_db
from ..models import Profile
from ..schemas import ProfileResponse, ProfileUpdate

router = APIRouter()


@router.get("", response_model=ProfileResponse)
def get_profile(current_user: Profile = Depends(get_current_user)) -> ProfileResponse:
    return current_user


@router.patch("", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfileResponse:
    current_user.display_name = payload.display_name
    db.commit()
    db.refresh(current_user)
    return current_user
