# ============================================================
# Nebbi API — Dependency: usuario autenticado actual
# ============================================================
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session
from uuid import UUID

from ..database import get_db
from ..models import User, Profile
from .security import decode_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Profile:
    """
    Extrae el usuario autenticado del JWT.
    Inyectar como dependency en cualquier endpoint protegido.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    profile = db.query(Profile).filter(Profile.id == UUID(user_id)).first()
    if profile is None:
        raise credentials_exception

    return profile


def get_admin_user(
    current_user: Profile = Depends(get_current_user),
) -> Profile:
    """Dependency adicional: verifica que el usuario tenga rol admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador",
        )
    return current_user
