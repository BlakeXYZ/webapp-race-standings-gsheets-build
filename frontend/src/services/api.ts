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