# ==============================================================================
# EVENTS ROUTES - API endpoints for race events
# ==============================================================================
# This file defines all the routes (URLs) related to race events
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
# ROUTE 1: GET ALL EVENTS
# ==============================================================================
# This creates a route at: /api/v1/events/
# HTTP Method: GET
# Returns: List of all race events

@router.get("/")
async def get_events(gsheet_service: GoogleSheetsService = Depends(get_sheets_service)):
    """
    Get all race events
    
    Returns a list of all events created in the system.

    Example response:
    {
        "events": [
            {"id": 1, "name": "Grand Prix 1", "date": "2024-07-01"},
            {"id": 2, "name": "Grand Prix 2", "date": "2024-07-15"}
        ]
    }
    """
    logger.info(f"GET /events called - fetching events from Google Sheets")

    # get all cached sheet names or fetch them
    all_events = gsheet_service.get_all_events(spreadsheet_id=settings.GSHEET_RALLYCROSS_ID)

    events_data = []

    # logger debug all event info:
    logger.debug(f"----------- Retrieved events count = {len(all_events)}")
    for idx, (event_name, raw_event_data) in enumerate(all_events.items()):

        event_data = EventData.model_validate(raw_event_data)
        logger.debug(f"Event: {event_name}")
        # logger.debug(f"  Overview Dict: {event_data.event_overview}")
        # example overview dict:
        # Overview Dict: event_name_shorthand='#76 5/17/2026 PE3' total_drivers=15 total_runs=8 total_cones=16 event_number='#76' event_date='5/17/2026' event_type='Points Event #3'
        # logger.debug(f"  Overview Event Name: {event_data.event_overview.event_name_shorthand}")

        full_event_name = f"Rallycross {event_data.event_overview.event_number}, {event_data.event_overview.event_type}"

        events_data.append({
            "id": idx + 1,
            "name": full_event_name,
            "date": event_data.event_overview.event_date
        })


    # Placeholder for actual data retrieval logic
    return { "events": events_data }


# ==============================================================================
# ROUTE 2: GET EVENT BY DATE
# ==============================================================================
# This creates a route at: /api/v1/events/{event_date}
# HTTP Method: GET
# URL Parameter: event_date (the date in the URL)
# Returns: Details for one specific event
@router.get("/{event_date}")
async def get_event_by_date(
    event_date: str,
    gsheet_service: GoogleSheetsService = Depends(get_sheets_service)
):
    """
    Get event details by date
    
    Returns details for a specific event identified by its date.
    
    Example response:
    {
        "event": {"id": 1, "name": "Grand Prix 1", "date": "2024-07-01", "location": "Location 1"}
    }
    """
    
    raw_event_data = gsheet_service.get_event_by_date(spreadsheet_id=settings.GSHEET_RALLYCROSS_ID, event_date=event_date)

    # Validate and return
    event_data = EventData.model_validate(raw_event_data)
    
    logger.debug(f"Found event: {event_data.event_overview.event_name_shorthand}")
    
    return {
        "event": {
            "name": f"Rallycross {event_data.event_overview.event_number}, {event_data.event_overview.event_type}",
            "date": event_data.event_overview.event_date,  # "2026-05-17"
            "overview": event_data.event_overview,
            "drivers_by_overall": event_data.drivers_by_overall,
            "drivers_by_name": event_data.drivers_by_name
        }
    }