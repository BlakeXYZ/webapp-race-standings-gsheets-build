import json
import re

import os.path
import pathlib

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()

#TODO: Fetch all sheet names in the spreadsheet, and then fetch data from the correct sheet based on the date of the rallycross event (e.g. if the event is on 3/22/2026, fetch data from the sheet with the name that contains "3/22/2026" or "March 22, 2026") - For your project: Combine #1 (Dynamic Sheet Selection) + #4 (Date-Based Fetching)
#TODO: Dynamic Range Selection - Count of rows will be dynamic based on number of Racers for that Event
#TODO: Organize the fetched data into a structured format (e.g. a list of dictionaries where each dictionary represents a row of data with column names as keys) 
#TODO: Later add google sheet cache + data update functionality - For your project: Combine #2 (Polling with Cache) + #5 (Manual Refresh) 

"""
Example Data Fetched from the Google Sheet:
Values from spreadsheet '1HA-DsQrd2pl4h0sOFE7N787MeVflVfMrnZOYu7fvgl4', range '#74 3/22/2026 PE1!B8:P37':
['Overall', 'Driver', 'Car', 'Class', 'Class rank', 'Avg time', 'differential', 'Runs', 'min', 'max', 'min/max diff', 'Raw time', 'Cones', 'Penalty', 'Total time']
['1', 'Blanton Payne ', '91 Honda Civic Marlboro Gold and white', 'FWD', '1', '86.79', '', '8', '85.10', '89.00', '3.90', '694.3', '0', '0', '694.3']
['2', 'Alex Greenbaum', '98 Subaru Outback Sport red', 'AWD', '1', '87.78', '0.99', '8', '86.37', '89.59', '3.22', '702.3', '0', '0', '702.3']
['3', 'Lawrence Doeppenschmidt', 'Black STI', 'AWD', '2', '88.18', '0.40', '8', '86.66', '90.28', '3.62', '703.5', '1', '2', '705.5']
['4', 'Adam West', '03 Subaru WRX Blue', 'AWD', '3', '88.41', '0.23', '8', '85.81', '90.78', '4.97', '707.3', '0', '0', '707.3']
"""

repo_root_dir = pathlib.Path(__file__).parent.parent.parent

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SERVICE_ACCOUNT_FILE = repo_root_dir / "webapp-race-standings-f1749623862a.json"
GSHEET_API_KEY = os.getenv("GSHEET_API_KEY")
GSHEET_RALLYCROSS_ID = "1HA-DsQrd2pl4h0sOFE7N787MeVflVfMrnZOYu7fvgl4"

#use parent dir of this file as the working dir, so that the credentials.json and token.json files are in the same dir as this file
root_dir = pathlib.Path(__file__).parent


def build_credentials():
  """
  Creates and returns Google API credentials, handling token storage and refresh as needed.

  Returns:
      creds (Credentials): Google API credentials object for authentication.
  """
  # creds = None
  # # The file token.json stores the user's access and refresh tokens, and is
  # # created automatically when the authorization flow completes for the first
  # # time.
  # if os.path.exists(root_dir / "token.json"):
  #   creds = Credentials.from_authorized_user_file(root_dir / "token.json", SCOPES)
    
  # # If there are no (valid) credentials available, let the user log in.
  # if not creds or not creds.valid:
  #   if creds and creds.expired and creds.refresh_token:
  #     creds.refresh(Request())
  #   else:
  #     flow = InstalledAppFlow.from_client_secrets_file(
  #         root_dir / "credentials.json", SCOPES
  #     )
  #     creds = flow.run_local_server(port=8080)
  #   # Save the credentials for the next run
  #   with open(root_dir / "token.json", "w") as token:
  #     token.write(creds.to_json())

  creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
  
  return creds

def get_all_sheet_names(service, spreadsheet_id, debug=False):
    """Get all sheet/tab names from a spreadsheet."""
    try:
        # Get spreadsheet metadata
        spreadsheet = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        
        # Extract sheet names
        sheets = spreadsheet.get('sheets', [])

        if debug:
            print(f"\nFound {len(sheets)} sheets:")
            for sheet in sheets:
                properties = sheet.get('properties', {})
                sheet_name = properties.get('title', 'Unknown')
                sheet_id = properties.get('sheetId', 'Unknown')
                print(f"  - '{sheet_name}' (ID: {sheet_id})")
        
        return [sheet.get('properties', {}).get('title') for sheet in sheets]
    
    except HttpError as err:
        print(f"Error: {err}")
        return []

def filter_sheets_by_name_keyword(sheet_names, keyword):
    """Filter sheet names based on a keyword (e.g., date)."""
    filtered_sheets = [name for name in sheet_names if keyword in name]
    
    print(f"\nSheets containing '{keyword}':")
    for name in filtered_sheets:
        print(f"  - {name}")
    
    return filtered_sheets
   
def get_filtered_sheet_data(service, spreadsheet_id, sheet_name, range_start="B8", range_end="P400"):
    """Fetch data from a specific sheet/tab based on its name."""
    range_name = f"{sheet_name}!{range_start}:{range_end}"
    
    try:
        result = service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        values = result.get('values', [])
        
        if not values:
            print(f"No data found in sheet '{sheet_name}' for range '{range_name}'.")
            return []
        
        return values
    
    except HttpError as err:
        print(f"Error fetching data from sheet '{sheet_name}': {err}")
        return []

def sanitize_headers(headers):
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

def organize_data_into_structured_format(sheet_data, sheet_name):
    """Organize raw sheet data into a structured format (list of dictionaries)."""
    if not sheet_data:
        return []
    
    # Santize headers by replacing spaces with underscores and all lowercase
    headers = sanitize_headers(sheet_data[0])
    
    structured_data = []
    for row in sheet_data[1:]:  # Skip header row
        if row == []:
           # break after first row that is empty to avoid processing unnecessary empty rows
           break

        row_dict = {headers[i]: row[i] if i < len(row) else None for i in range(len(headers))}
        structured_data.append(row_dict)

    # calculate total runs by finding each dict key that equals 'runs' and pull highest value
    total_runs = max([int(row.get('runs', 0)) for row in structured_data if 'runs' in row])
    total_cones = sum([int(row.get('cones', 0)) for row in structured_data if 'cones' in row])

    # append general data at top of structured data list (e.g. event name, date, etc.)
    event_overview = {
    "event_name": sheet_name,
    "total_drivers": len(structured_data),
    "total_runs": total_runs,
    "total_cones": total_cones
    }

    # Cull unnecessary Runs, using total_runs, removed all keys that start with "run_" and are greater than total_runs (e.g. if total_runs is 8, remove run_9, run_10, etc.)
    for row in structured_data:
        keys_to_remove = [key for key in row.keys() if key.startswith("run_") and key != "runs" and int(key.split("_")[1]) > total_runs]
        for key in keys_to_remove:
            del row[key]

    structured_data.insert(0, event_overview)
    
    return structured_data


def main():
  """Shows basic usage of the Sheets API.
  Prints values from a sample spreadsheet.
  """
  creds = build_credentials()

  try:
    service = build("sheets", "v4", credentials=creds, developerKey=GSHEET_API_KEY)

    # Get all sheet names
    sheet_names = get_all_sheet_names(service=service, spreadsheet_id=GSHEET_RALLYCROSS_ID, debug=False)
    sheet_names_2026 = filter_sheets_by_name_keyword(sheet_names=sheet_names, keyword="2026 PE")
    
    for sheet_name in sheet_names_2026:
      print(f"\nFetching data from tab: '{sheet_name}'")

      filtered_sheet_data = get_filtered_sheet_data(
         service=service, 
         spreadsheet_id=GSHEET_RALLYCROSS_ID, 
         sheet_name=sheet_name, 
         range_start="B8", 
         range_end="BF400"
        )

      sanitized_sheet_name = re.sub(r'[^A-Za-z0-9]+', '_', sheet_name)
      structured_data = organize_data_into_structured_format(filtered_sheet_data, sheet_name)

      structured_output_file = root_dir / f"structured_data_{sanitized_sheet_name}.json"
      with open(structured_output_file, "w") as f:
          json.dump(structured_data, f, indent=2)


  except HttpError as err:
    print(err)


if __name__ == "__main__":
  main()