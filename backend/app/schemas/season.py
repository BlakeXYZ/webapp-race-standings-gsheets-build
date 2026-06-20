from pydantic import BaseModel, Field
from typing import Optional

class SeasonOverview(BaseModel):
    season_year: Optional[int] = Field(default=None, description="Current racing season year")
    driver_count: Optional[int] = Field(default=None, description="Total unique drivers")
    cone_count: Optional[int] = Field(default=None, description="Total cones hit this season")
    event_count: Optional[int] = Field(default=None, description="Total events this season")