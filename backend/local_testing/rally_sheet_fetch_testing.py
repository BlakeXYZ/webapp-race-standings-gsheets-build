from logging import root
import os.path
import pathlib

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


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



# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# The ID and range of a sample spreadsheet.
RALLYCROSS_SPREADSHEET_ID = "1HA-DsQrd2pl4h0sOFE7N787MeVflVfMrnZOYu7fvgl4"

TAB_NAME = "#74 3/22/2026 PE1"
RANGE_NAME = f"{TAB_NAME}!B8:P37"

#use parent dir of this file as the working dir, so that the credentials.json and token.json files are in the same dir as this file
root_dir = pathlib.Path(__file__).parent


def build_credentials():
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists(root_dir / "token.json"):
    creds = Credentials.from_authorized_user_file(root_dir / "token.json", SCOPES)
    
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          root_dir / "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=8080)
    # Save the credentials for the next run
    with open(root_dir / "token.json", "w") as token:
      token.write(creds.to_json())
  
  return creds

def get_all_sheet_names(service, spreadsheet_id):
    """Get all sheet/tab names from a spreadsheet."""
    try:
        # Get spreadsheet metadata
        spreadsheet = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
        
        # Extract sheet names
        sheets = spreadsheet.get('sheets', [])

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

def main():
  """Shows basic usage of the Sheets API.
  Prints values from a sample spreadsheet.
  """
  creds = build_credentials()

  try:
    service = build("sheets", "v4", credentials=creds)

    # # Get all sheet names
    # sheet_names = get_all_sheet_names(service, RALLYCROSS_SPREADSHEET_ID)
    
    # Call the Sheets API
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=RALLYCROSS_SPREADSHEET_ID, range=RANGE_NAME)
        .execute()
    )
    values = result.get("values", [])

    if not values:
      print("No data found.")
      return

    print(f"Values from spreadsheet '{RALLYCROSS_SPREADSHEET_ID}', range '{RANGE_NAME}':")

    for row in values:
      print(f"{row}")


  except HttpError as err:
    print(err)


if __name__ == "__main__":
  main()