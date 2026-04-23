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
from app.schemas.events import EventData

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

    events_data = [
        {"id": 1, "name": "Rallycross #73, points event #6", "date": "2024-11-24"},
        {"id": 2, "name": "Rallycross #72, points event #5", "date": "2024-11-03"},
        {"id": 3, "name": "Rallycross #71, points event #4", "date": "2024-09-29"},
        {"id": 4, "name": "Rallycross #70, points event #3", "date": "2024-06-30"},
        {"id": 5, "name": "Rallycross #69, points event #2", "date": "2024-06-09"},
        {"id": 6, "name": "Rallycross #68, points event #1", "date": "2024-02-25"},

    ]



    # events = gsheet_service.get_all_events(spreadsheet_id=settings.GSHEET_RALLYCROSS_ID, keyword="2026 PE")
    # #log event data for debugging
    # # logger.debug(f"Retrieved events: {events}")

    # get all cached sheet names or fetch them
    all_events = gsheet_service.get_all_events(spreadsheet_id=settings.GSHEET_RALLYCROSS_ID)

    events_data = []

    # logger debug all event info:
    logger.debug(f"----------- Retrieved events count = {len(all_events)}")
    for idx, (event_name, raw_event_data) in enumerate(all_events.items()):

        event_data = EventData.model_validate(raw_event_data)
        logger.debug(f"Event: {event_name}")
        logger.debug(f"  Overview Dict: {event_data.event_overview}")
        logger.debug(f"  Overview Event Name: {event_data.event_overview.event_name_shorthand}")

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
async def get_event_by_date(event_date: str):
    """
    Get event details by date
    
    Returns details for a specific event identified by its date.
    
    Example response:
    {
        "event": {"id": 1, "name": "Grand Prix 1", "date": "2024-07-01", "location": "Location 1"}
    }
    """
    
    # ------------------------------------------------------------------
    # MOCK DATA - Replace this with database query
    # ------------------------------------------------------------------
    # Currently returning fake data for demonstration
    # STUB: Replace with actual database query
    # Example with database:
    # from app.models import Event
    # event = await Event.get_by_date(event_date)
    # if not event:
    #     raise HTTPException(status_code=404, detail="Event not found")
    # return {"event": event}
    
    # Use the same events_data as in get_events
    events_data = [
        {"id": 1, "name": "Rallycross #73, points event #6", "date": "2024-11-24"},
        {"id": 2, "name": "Rallycross #72, points event #5", "date": "2024-11-03"},
        {"id": 3, "name": "Rallycross #71, points event #4", "date": "2024-09-29"},
        {"id": 4, "name": "Rallycross #70, points event #3", "date": "2024-06-30"},
        {"id": 5, "name": "Rallycross #69, points event #2", "date": "2024-06-09"},
        {"id": 6, "name": "Rallycross #68, points event #1", "date": "2024-02-25"},
    ]

    # Find event by date
    event = next((e for e in events_data if e["date"] == event_date), None)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"event": event}