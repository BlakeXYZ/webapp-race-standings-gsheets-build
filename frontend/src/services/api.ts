// frontend/src/services/api.ts
const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * Get all events
 * Backend: routes/events.py::get_events()
 * Returns: { events: Event[] }
 */
export async function fetchAllEvents() {
  const response = await fetch(`${API_BASE}/api/v1/events/`)
  if (!response.ok) throw new Error('Failed to fetch events')
  const data = await response.json()
  return data.events  // Extract "events" key
}

/**
 * Get event by date
 * Backend: routes/events.py::get_event_by_date()
 * Returns: { event: EventDetail }
 */
export async function fetchEventByDate(eventDate: string) {
  const response = await fetch(`${API_BASE}/api/v1/events/${eventDate}`)
  if (!response.ok) throw new Error('Failed to fetch event')
  const data = await response.json()
  return data.event  // Extract "event" key
}


/**
 * Get season overview (driver count, cone count, event count)
 * Backend: routes/season.py::get_season_overview()
 * Returns: { seasonOverviewData: SeasonOverview }
 */
export async function fetchSeasonOverview() {
  const response = await fetch(`${API_BASE}/api/v1/season/overview`)
  if (!response.ok) throw new Error('Failed to fetch season overview')
  const data = await response.json()
  return data.seasonOverviewData  // Extract "seasonOverviewData" key
}
