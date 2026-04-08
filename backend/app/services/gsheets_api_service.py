import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.core.config import settings
from app.services.gsheets_data_mapper import organize_data_into_structured_format

logger = logging.getLogger(__name__)

class GoogleSheetsService:
    """
    Service for fetching and caching rally event data from Google Sheets.
    
    Provides high-level methods to retrieve event data with built-in caching.
    Uses service account authentication and maintains an in-memory cache
    to reduce API calls and improve performance.
    
    Attributes:
        credentials: Google service account credentials
        service: Google Sheets API service instance
        _cache: In-memory cache for event data (dict)
        _cache_ttl: Cache time-to-live in seconds (default: 300)
    
    Example:
        >>> service = GoogleSheetsService()
        >>> 
        >>> # Get all 2026 events
        >>> events = service.get_all_events(
        ...     spreadsheet_id=settings.GSHEET_RALLYCROSS_ID,
        ...     keyword="2026 PE"
        ... )
        >>> 
        >>> # Get a specific event (uses cache)
        >>> event = service.get_event(
        ...     spreadsheet_id=settings.GSHEET_RALLYCROSS_ID,
        ...     event_name="#74 3/22/2026 PE1"
        ... )
        >>> 
        >>> # List available events
        >>> event_names = service.list_events(
        ...     spreadsheet_id=settings.GSHEET_RALLYCROSS_ID,
        ...     keyword="2026 PE"
        ... )
    """

    def __init__(self):
        self.credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS,
            scopes=settings.GOOGLE_API_SCOPES
        )
        self.service = build(
            "sheets", "v4",
            credentials=self.credentials,
            developerKey=settings.GSHEET_API_KEY
        )
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl: int = 300  # 5 minutes (cache TTL)

    # ================================================================
    # PUBLIC API - High-level methods for event operations
    # ================================================================

    def get_event(self, spreadsheet_id: str, event_name: str) -> List[Dict[str, Any]]:
        """
        Get a specific event by exact sheet name.
        
        Uses cache if available, otherwise fetches from Google Sheets API.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            event_name: Exact sheet/tab name (e.g., "#74 3/22/2026 PE1")
            
        Returns:
            Structured event data with overview and participant records
        """
        return self._get_cached_or_fetch(spreadsheet_id, event_name)

    def get_all_events(self, spreadsheet_id: str, keyword: str = "2026 PE") -> Dict[str, List[Dict[str, Any]]]:
        """
        Fetch and cache all events matching a keyword.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            keyword: Filter events by this keyword (e.g., "2026 PE")
            
        Returns:
            Dictionary with event names as keys and structured data as values
            
        Raises:
            HttpError: If Google Sheets API request fails
        """
        results = {}
        
        try:
            # Get all sheet names
            sheet_names = self._get_sheet_names(spreadsheet_id)
            
            # Filter by keyword
            filtered_names = self._filter_by_keyword(sheet_names, keyword)
            
            # Fetch and cache each event
            for event_name in filtered_names:
                logger.info(f"Fetching event: '{event_name}'")
                results[event_name] = self._get_cached_or_fetch(spreadsheet_id, event_name)
            
            logger.info(f"Successfully fetched {len(results)} events")
            return results
            
        except HttpError as err:
            logger.error(f"Error fetching events: {err}")
            raise

    def list_events(self, spreadsheet_id: str, keyword: Optional[str] = None) -> List[str]:
        """
        List all event names, optionally filtered by keyword.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            keyword: Optional keyword to filter event names
            
        Returns:
            List of event names (sheet/tab titles)
        """
        sheet_names = self._get_sheet_names(spreadsheet_id)
        
        if keyword:
            return self._filter_by_keyword(sheet_names, keyword)
        
        return sheet_names

    def refresh_cache(self) -> None:
        """
        Clear the entire cache to force fresh data on next fetch.
        """
        self._cache.clear()
        logger.info("Cache cleared")

    def refresh_event(self, spreadsheet_id: str, event_name: str) -> List[Dict[str, Any]]:
        """
        Force refresh of a specific event, bypassing cache.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            event_name: Exact sheet/tab name to refresh
            
        Returns:
            Freshly fetched structured event data
        """
        cache_key = f"{spreadsheet_id}:{event_name}"
        
        # Remove from cache if exists
        if cache_key in self._cache:
            del self._cache[cache_key]
            logger.info(f"Cache cleared for event: '{event_name}'")
        
        # Fetch fresh data
        return self._get_cached_or_fetch(spreadsheet_id, event_name)

    # ================================================================
    # PRIVATE - Low-level Google Sheets API operations
    # ================================================================

    def _get_cached_or_fetch(self, spreadsheet_id: str, sheet_name: str) -> List[Dict[str, Any]]:
        """
        Internal cache lookup and fetch logic.
        
        Checks cache first; if data exists and hasn't expired, returns cached version.
        Otherwise fetches fresh data from Google Sheets API and updates cache.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            sheet_name: The name/title of the specific sheet/tab
            
        Returns:
            Structured data as list of dictionaries (cached or fresh)
        """
        cache_key = f"{spreadsheet_id}:{sheet_name}"
        
        # Check if cached and not expired
        if cache_key in self._cache:
            cached_data = self._cache[cache_key]
            if datetime.now() < cached_data['expires_at']:
                logger.debug(f"Cache hit for: '{sheet_name}'")
                return cached_data['data']
        
        # Fetch fresh data
        logger.debug(f"Cache miss for: '{sheet_name}' - fetching from API")
        data = self._fetch_and_transform(spreadsheet_id, sheet_name)
        
        # Store in cache
        self._cache[cache_key] = {
            'data': data,
            'expires_at': datetime.now() + timedelta(seconds=self._cache_ttl)
        }
        
        return data

    def _fetch_and_transform(self, spreadsheet_id: str, sheet_name: str, 
                            range_start: str = "B8", range_end: str = "BF400") -> List[Dict[str, Any]]:
        """
        Fetch raw data from Google Sheets and transform to structured format.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            sheet_name: The name/title of the specific sheet/tab
            range_start: Starting cell (default: "B8")
            range_end: Ending cell (default: "BF400")
            
        Returns:
            Structured data as list of dictionaries with event overview and participant records
        """
        # Fetch raw 2D array from API
        raw_data = self._fetch_raw_data(
            spreadsheet_id=spreadsheet_id,
            sheet_name=sheet_name,
            range_start=range_start,
            range_end=range_end
        )
        
        # Transform to structured format
        structured_data = organize_data_into_structured_format(raw_data, sheet_name)
        
        return structured_data

    def _fetch_raw_data(self, spreadsheet_id: str, sheet_name: str,
                       range_start: str = "B8", range_end: str = "BF400") -> List[List[str]]:
        """
        Fetch raw 2D array from Google Sheets API.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            sheet_name: The name/title of the specific sheet/tab
            range_start: Starting cell (default: "B8")
            range_end: Ending cell (default: "BF400")
            
        Returns:
            Raw data as 2D list (rows and columns)
            Returns empty list if no data found or error occurs
        """
        range_name = f"{sheet_name}!{range_start}:{range_end}"
        
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=range_name
            ).execute()
            values = result.get('values', [])
            
            if not values:
                logger.warning(f"No data found in sheet '{sheet_name}' for range '{range_name}'")
                return []
            
            return values
        
        except HttpError as err:
            logger.error(f"Error fetching data from sheet '{sheet_name}': {err}")
            return []

    def _get_sheet_names(self, spreadsheet_id: str) -> List[str]:
        """
        Get all sheet/tab names from a spreadsheet.
        
        Args:
            spreadsheet_id: The Google Sheets spreadsheet ID
            
        Returns:
            List of sheet/tab names (titles) from the spreadsheet
            Returns empty list if error occurs
        """
        try:
            spreadsheet = self.service.spreadsheets().get(
                spreadsheetId=spreadsheet_id
            ).execute()
            
            sheets = spreadsheet.get('sheets', [])
            sheet_names = [sheet.get('properties', {}).get('title') for sheet in sheets]
            
            logger.debug(f"Found {len(sheet_names)} sheets in spreadsheet")
            return sheet_names
        
        except HttpError as err:
            logger.error(f"Error getting sheet names: {err}")
            return []

    def _filter_by_keyword(self, sheet_names: List[str], keyword: str) -> List[str]:
        """
        Filter sheet names containing a keyword.
        
        Args:
            sheet_names: List of sheet names to filter
            keyword: Keyword to search for in sheet names (e.g., "2026 PE")
            
        Returns:
            List of sheet names containing the keyword
        """
        filtered = [name for name in sheet_names if keyword in name]
        logger.debug(f"Filtered {len(sheet_names)} sheets to {len(filtered)} using keyword '{keyword}'")
        return filtered