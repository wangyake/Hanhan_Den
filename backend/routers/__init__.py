from routers.story import router as story_router
from routers.job import router as job_router
from routers.auth import router as auth_router
from routers.admin import router as admin_router

__all__ = ["story_router", "job_router", "auth_router", "admin_router"]
