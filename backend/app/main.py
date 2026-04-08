# ==============================================================================
# IMPORTS - Bring in the tools we need
# ==============================================================================

import logging
from fastapi import FastAPI                        # Main FastAPI class
from fastapi.middleware.cors import CORSMiddleware # Allow frontend to call API
from app.core.config import settings               # Configuration settings
from app.api.routes import api_router              # All our API routes

# ==============================================================================
# LOGGING CONFIGURATION
# ==============================================================================

logging.basicConfig(
    level=logging.DEBUG,  # Show all logs (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # Print to console
    ]
)

# Reduce noise from external libraries
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)
logger.info("🚀 Application starting up...")


# ==============================================================================
# CREATE THE APP - This is like creating an Express app in Node.js
# ==============================================================================

app = FastAPI(
    title=settings.PROJECT_NAME,           # API name (shows in docs)
    version=settings.VERSION,              # API version
    openapi_url=f"{settings.API_V1_STR}/openapi.json"  # URL for API schema
)


# ==============================================================================
# CORS MIDDLEWARE - Allow frontend to call this backend
# ==============================================================================
# Without CORS, browsers block requests from different domains/ports
# This is like setting "Access-Control-Allow-Origin" headers manually

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # Which URLs can call this API
    allow_credentials=True,                       # Allow cookies/auth headers
    allow_methods=["*"],                          # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                          # Allow all headers
)

# STUB: Add more middleware here (authentication, logging, rate limiting, etc.)


# ==============================================================================
# INCLUDE ROUTERS - Connect all route files
# ==============================================================================
# This is like app.use('/api/v1', router) in Express
# All routes from api_router will be prefixed with /api/v1

app.include_router(api_router, prefix=settings.API_V1_STR)

# STUB: Add more routers here
# Example: app.include_router(admin_router, prefix="/admin")


# ==============================================================================
# ROOT ROUTES - Basic endpoints
# ==============================================================================

@app.get("/")
async def root():
    """
    Root endpoint - returns basic API info
    
    This is like a home page for your API
    Access it at: http://localhost:8000/
    """
    return {"message": "Race Standings API", "version": settings.VERSION}
    # STUB: Add more info here (uptime, docs link, status, etc.)


@app.get("/health")
async def health_check():
    """
    Health check endpoint - used by Docker/monitoring to check if API is alive
    
    Access it at: http://localhost:8000/health
    """
    return {"status": "healthy"}
    # STUB: Add database connection check, external service checks, etc.


# ==============================================================================
# HOW TO ADD MORE ROUTES
# ==============================================================================
# Option 1: Add them directly here
# @app.get("/my-route")
# async def my_route():
#     return {"data": "value"}
#
# Option 2: Create a new file in app/api/routes/ (recommended for organization)
# Then import and include it above with app.include_router()
# ==============================================================================


# ==============================================================================
# STARTUP/SHUTDOWN EVENTS (Optional)
# ==============================================================================
# STUB: Add startup logic here
# @app.on_event("startup")
# async def startup_event():
#     # Connect to database, load cache, etc.
#     print("API starting up...")
#
# STUB: Add shutdown logic here
# @app.on_event("shutdown")
# async def shutdown_event():
#     # Close database connections, cleanup, etc.
#     print("API shutting down...")
# ==============================================================================

