from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers import story_router, job_router, auth_router, admin_router
from db.database import create_tables

create_tables()

app = FastAPI(
    title = "Hanhan's Den API",
    description="API for Hanhan's Den website",
    version = "0.1.0",
    docs_url = "/docs",
    redoc_url = "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods = ["*"],  # GET, POST, PUT
    allow_headers = ["*"],
)

app.include_router(story_router, prefix=settings.API_PREFIX)
app.include_router(job_router, prefix=settings.API_PREFIX)
app.include_router(auth_router, prefix=settings.API_PREFIX + "/auth")
app.include_router(admin_router, prefix=settings.API_PREFIX + "/admin")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host = "0.0.0.0", port = 8000, reload=True)