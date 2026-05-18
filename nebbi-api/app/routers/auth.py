from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..core.dependencies import get_current_user
from ..core.security import create_access_token, hash_password, verify_password
from ..database import get_db
from ..models import Profile, User
from ..schemas import LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter()


def _build_user_out(profile: Profile) -> UserOut:
    return UserOut(
        id=profile.id,
        email=profile.user.email,
        display_name=profile.display_name,
        role=profile.role,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo",
        )

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    profile = Profile(display_name=payload.display_name, user=user)

    db.add(user)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    profile.user = user

    return TokenResponse(access_token=token, user=_build_user_out(profile))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = (
        db.query(User)
        .options(joinedload(User.profile))
        .filter(User.email == payload.email)
        .first()
    )
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )

    if user.profile is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="El usuario no tiene perfil asociado",
        )

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=_build_user_out(user.profile))


@router.get("/me", response_model=UserOut)
def me(current_user: Profile = Depends(get_current_user)) -> UserOut:
    return _build_user_out(current_user)
