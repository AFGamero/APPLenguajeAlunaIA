# ============================================================
# Nebbi API — Punto de entrada principal
# ============================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import admin, auth, lessons, modules, profile, progress

app = FastAPI(
    title="Nebbi API",
    description="Backend para la app de aprendizaje de la lengua Kogui",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ──────────────────────────────────────────────
@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok", "version": "1.0.0"}


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(modules.router, prefix="/modules", tags=["Modules"])
app.include_router(lessons.router, prefix="/lessons", tags=["Lessons"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
