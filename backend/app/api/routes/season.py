# ==============================================================================
# SEASON ROUTES - API endpoints for race seasons
# ==============================================================================
# This file defines all the routes (URLs) related to race seasons
# Think of routes as the "pages" of your API
# ==============================================================================

from asyncio import events

from fastapi import APIRouter, Depends, HTTPException, Query  # FastAPI tools
from typing import List                             # For type hints
import logging

from app.core.config import settings          
from app.services.gsheets_api_service import GoogleSheetsService
from app.schemas.events import EventData, EventOverview

logger = logging.getLogger(__name__)

# ==============================================================================
# CREATE ROUTER - Like a mini-app for this specific feature
# ==============================================================================
# APIRouter is like a blueprint in Flask or Router in Express
# It groups related routes together

router = APIRouter()

# ================================================================
# CREATE SINGLETON - One instance shared across all requests
# ================================================================
_sheets_service_instance = None

def get_sheets_service() -> GoogleSheetsService:
    """
    Dependency that returns the singleton GoogleSheetsService instance.
    Cache is preserved across all requests.
    """
    global _sheets_service_instance
    
    if _sheets_service_instance is None:
        logger.info("Initializing GoogleSheetsService singleton")
        _sheets_service_instance = GoogleSheetsService()
    
    return _sheets_service_instance

# ==============================================================================
# ROUTE 1: GET SEASON OVERVIEW
# ==============================================================================
# This creates a route at: /api/v1/season/overview
# HTTP Method: GET
# Returns: Season overview data

@router.get("/overview")
async def get_season_overview(gsheet_service: GoogleSheetsService = Depends(get_sheets_service)):
    """
    Get season overview
    
    Returns an overview of the current racing season.

    Example response:
    {
        "events": [
            {"id": 1, "name": "Grand Prix 1", "date": "2024-07-01"},
            {"id": 2, "name": "Grand Prix 2", "date": "2024-07-15"}
        ]
    }
    """
    logger.info(f"GET /season/overview called - fetching season overview from Google Sheets")

    # get all cached sheet names or fetch them
    all_events = gsheet_service.get_all_events(spreadsheet_id=settings.GSHEET_RALLYCROSS_ID, keyword=str(settings.GSHEET_2026_EVENTS_KEYWORD))

    events_data = []

    season_overview_data = {}

    # logger debug all event info:
    logger.debug(f"----------- Retrieved events count = {len(all_events)}")

    season_overview_data["event_count"] = len(all_events)

    # for idx, (event_name, raw_event_data) in enumerate(all_events.items()):

    #     event_data = EventData.model_validate(raw_event_data)
    #     logger.debug(f"Event: {event_name}")
    #     # logger.debug(f"  Overview Dict: {event_data.event_overview}")
    #     # example overview dict:
    #     # Overview Dict: event_name_shorthand='#76 5/17/2026 PE3' total_drivers=15 total_runs=8 total_cones=16 event_number='#76' event_date='5/17/2026' event_type='Points Event #3'
    #     # logger.debug(f"  Overview Event Name: {event_data.event_overview.event_name_shorthand}")

    #     full_event_name = f"Rallycross {event_data.event_overview.event_number}, {event_data.event_overview.event_type}"

    #     events_data.append({
    #         "id": idx + 1,
    #         "name": full_event_name,
    #         "date": event_data.event_overview.event_date
    #     })


    # Placeholder for actual data retrieval logic
    return { "seasonOverviewData": season_overview_data }
