from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from ..core.dependencies import get_current_user
from ..database import get_db
from ..models import Module, Profile
from ..schemas import ModuleResponse

router = APIRouter()


@router.get("", response_model=list[ModuleResponse])
def list_modules(
    _: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[ModuleResponse]:
    modules = (
        db.query(Module)
        .options(selectinload(Module.lessons))
        .order_by(Module.order_index)
        .all()
    )
    return modules
