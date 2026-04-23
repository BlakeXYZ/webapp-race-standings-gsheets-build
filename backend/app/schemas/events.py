from pydantic import BaseModel, Field
from typing import Optional, Dict

class EventOverview(BaseModel):
    event_name_shorthand: str
    total_drivers: int
    total_runs: int
    total_cones: int
    event_number: Optional[str]
    event_date: Optional[str]
    event_type: Optional[str]

class DriverStanding(BaseModel):
    overall: str
    driver: str
    car: str
    class_: str = Field(..., alias="class") # 'class' is a reserved word in Python
    class_rank: str
    avg_time: str
    differential: str
    runs: str
    min: str
    max: str
    min_max_diff: str
    raw_time: str
    cones: str
    penalty: str
    total_time: str
    unnamed: Optional[str]
    # Add run_X and run_X_cones fields as Optional[str] if you want strict typing

class EventData(BaseModel):
    event_overview: EventOverview
    drivers_by_overall: Dict[str, DriverStanding]
    drivers_by_name: Dict[str, DriverStanding]