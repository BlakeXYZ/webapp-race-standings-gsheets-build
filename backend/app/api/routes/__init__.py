# ==============================================================================
# API ROUTER - Combines all route files into one router
# ==============================================================================
# This file imports all individual route files and combines them
# Think of this as the "index" that connects all your API endpoints
# ==============================================================================

from fastapi import APIRouter
from app.api.routes import standings  # Import the standings routes file
from app.api.routes import events    # Import the events routes file
from app.api.routes import season    # Import the season routes file

# STUB: Import more route files here as you create them
# from app.api.routes import drivers, teams, races, etc.


# ==============================================================================
# CREATE MAIN API ROUTER
# ==============================================================================

api_router = APIRouter()


# ==============================================================================
# INCLUDE ALL ROUTE MODULES
# ==============================================================================
# Each include_router adds a group of related endpoints
# The prefix is added to all routes in that module
# Tags help organize the API documentation

# Add standings routes: /api/v1/standings/
api_router.include_router(
    standings.router,           # The router from standings.py
    prefix="/standings",        # All routes will start with /standings
    tags=["standings"]          # Groups these routes in API docs
)

# Add events routes: /api/v1/events/
api_router.include_router(
    events.router,              # The router from events.py
    prefix="/events",           # All routes will start with /events
    tags=["events"]             # Groups these routes in API docs
)

# Add season routes: /api/v1/season/
api_router.include_router(
    season.router,              # The router from season.py
    prefix="/season",           # All routes will start with /season
    tags=["season"]             # Groups these routes in API docs
)

# STUB: Add more routers here
# Example: Teams routes
# api_router.include_router(
#     teams.router,
#     prefix="/teams",
#     tags=["teams"]
# )

# Example: Drivers routes
# api_router.include_router(
#     drivers.router,
#     prefix="/drivers",
#     tags=["drivers"]
# )

# Example: Races routes
# api_router.include_router(
#     races.router,
#     prefix="/races",
#     tags=["races"]
# )

# Example: Admin routes (with authentication)
# api_router.include_router(
#     admin.router,
#     prefix="/admin",
#     tags=["admin"],
#     dependencies=[Depends(verify_admin)]  # Only admins can access
# )


# ==============================================================================
# HOW THIS WORKS
# ==============================================================================
# 
# 1. Each feature gets its own file in app/api/routes/
#    Example: standings.py, teams.py, drivers.py
# 
# 2. Each file creates its own router with related endpoints
#    Example: standings.router has /standings/ routes
# 
# 3. This file (routes/__init__.py) combines them all
#    api_router includes all the individual routers
# 
# 4. main.py includes api_router with /api/v1 prefix
#    Final URLs: /api/v1/standings/, /api/v1/teams/, etc.
# 
# URL Structure Example:
# - /api/v1/standings/           ← from main.py + this file + standings.py
# - /api/v1/standings/1          ← same path + /{driver_id}
# - /api/v1/teams/               ← from main.py + this file + teams.py (future)
# 
# ==============================================================================

