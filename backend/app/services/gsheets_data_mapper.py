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


def organize_data_into_structured_format(sheet_data: List[List[str]], sheet_name: str) -> List[Dict[str, Any]]:
    """Organize raw sheet data into a structured format (list of dictionaries)."""
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
        "event_name": sheet_name,
        "total_drivers": len(structured_data),
        "total_runs": total_runs,
        "total_cones": total_cones
    }

    # Cull unnecessary Runs - remove all keys that start with "run_" and are greater than total_runs
    for row in structured_data:
        keys_to_remove = [
            key for key in row.keys() 
            if key.startswith("run_") and key != "runs" and int(key.split("_")[1]) > total_runs
        ]
        for key in keys_to_remove:
            del row[key]

    structured_data.insert(0, event_overview)
    
    return structured_data