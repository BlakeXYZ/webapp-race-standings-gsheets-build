# backend/app/services/gsheets_data_mapper.py
import re
from typing import List, Dict, Any

def sanitize_headers(headers: List[str]) -> List[str]:
    """Sanitize column headers to be valid Python identifiers."""
    sanitized = []
    last_run = None
    run_pattern = re.compile(r'^run_(\d+)$')
    
    for header in headers:
        h = re.sub(r'[^A-Za-z0-9]+', '_', header).lower()
        if h == '':
            # If previous header was a run, append _cones
            if last_run:
                h = f"{last_run}_cones"
            else:
                h = 'unnamed'
        else:
            # Track the last run header
            if run_pattern.match(h):
                last_run = h
            else:
                last_run = None
        sanitized.append(h)
    return sanitized

def parse_sheet_name(sheet_name: str) -> Dict[str, Any]:
    """
    Parse the sheet name to extract event details.
    
    Args:
        sheet_name: The name of the sheet/tab (e.g., "#74 3/22/2026 PE1")
        
    Returns:
        Dictionary with parsed event details 
        {
            "event_number": "#74",
            "event_date": "3/22/2026",
            "event_type": "Points Event 1"
        }
    """
    # regex pattern to match sheet names like "#74 3/22/2026 PE1", split into components by spacing only
    re.split(r'\s+', sheet_name.strip())

    # event_number, date, and type are expected to be in the sheet name, sheet_name = "<event_numer> <date> <type>" is consistent
    event_number = None
    event_date = None   
    event_type = None

    components = re.split(r'\s+', sheet_name.strip())
    if len(components) >= 3:
        event_number = components[0]
        event_date = components[1]
        event_type = components[2]

    # if event type contains "PE", refrmat to be more user friendly (e.g. "PE1" becomes "Points Event 1")
    if event_type and event_type.startswith("PE"):
        event_type = event_type.replace("PE", "Points Event #")

    return {
        "event_number": event_number,
        "event_date": event_date,
        "event_type": event_type
    }


def organize_data_into_structured_format(sheet_data: List[List[str]], sheet_name: str) -> Dict[str, Any]:
    """Organize raw sheet data into a structured format (list of dictionaries).

    Args:
        sheet_data: Raw data from the sheet, where the first row contains headers.
        sheet_name: The name of the sheet/tab, used for parsing event details.
        
    Returns:
        A list of dictionaries, where each dictionary represents a row of data with sanitized headers as keys.
      
          {
            "event_overview": {...},
            "drivers_by_overall": { "1": {...}, ... },
            "drivers_by_name": { "Blanton Payne": {...}, ... }
        }

        event_overview Dictionary example:
        {
            "event_name_shorthand": "#74 3/22/2026 PE1",
            "total_drivers": 20,
            "total_runs": 3,
            "total_cones": 15,
            "event_number": "#74",
            "event_date": "3/22/2026",
            "event_type": "Points Event #1"
        }
    """
    if not sheet_data:
        return []
    
    # Sanitize headers by replacing spaces with underscores and all lowercase
    headers = sanitize_headers(sheet_data[0])
    
    structured_data = []
    for row in sheet_data[1:]:  # Skip header row
        if row == []:
            # Break after first empty row to avoid processing unnecessary empty rows
            break

        row_dict = {headers[i]: row[i] if i < len(row) else None for i in range(len(headers))}
        structured_data.append(row_dict)

    # Calculate total runs by finding each dict key that equals 'runs' and pull highest value
    total_runs = max([int(row.get('runs', 0)) for row in structured_data if 'runs' in row and row.get('runs')], default=0)
    total_cones = sum([int(row.get('cones', 0)) for row in structured_data if 'cones' in row and row.get('cones')])

    # Append general data at top of structured data list (e.g. event name, date, etc.)
    event_overview = {
        "event_name_shorthand": sheet_name,
        "total_drivers": len(structured_data),
        "total_runs": total_runs,
        "total_cones": total_cones
    }

    # insert parsed sheet name data into event overview
    parsed_sheet_name = parse_sheet_name(sheet_name)
    event_overview.update(parsed_sheet_name)

    # Cull unnecessary Runs - remove all keys that start with "run_" and are greater than total_runs
    for row in structured_data:
        keys_to_remove = [
            key for key in row.keys() 
            if key.startswith("run_") and key != "runs" and int(key.split("_")[1]) > total_runs
        ]
        for key in keys_to_remove:
            del row[key]

    drivers_by_overall = {row['overall']: row for row in structured_data if 'overall' in row}
    drivers_by_name = {row['driver']: row for row in structured_data if 'driver' in row}

    dictionary_to_return = {
        "event_overview": event_overview,
        "drivers_by_overall": drivers_by_overall,
        "drivers_by_name": drivers_by_name
    }
    
    return dictionary_to_return