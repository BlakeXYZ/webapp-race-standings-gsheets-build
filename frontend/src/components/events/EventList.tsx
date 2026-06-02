// ============================================================================
// IMPORTS - Bringing in tools we need
// ============================================================================

// useState: Store variables that can change (like a regular variable in JS)
// useEffect: Run code when the page loads (like window.onload in vanilla JS)
import { useState, useEffect } from 'react'

// Import our pre-made card components (these are just styled divs)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

// ============================================================================
// DATA TYPES - Defining what our data looks like (optional but helpful)
// ============================================================================

// This is like a schema - it says each event has these properties
interface Event {
  id: number          // Unique event ID
  name: string        // Event name
  date: string        // Event date
}


// ============================================================================
// EVENT LIST COMPONENT - Displays list of racing events
// ============================================================================

export default function EventList() {
  
  // ------------------------------------------------------------------
  // STATE VARIABLES - Think of these like regular variables, but when
  // they change, the page automatically updates to show the new value
  // ------------------------------------------------------------------
  
  // events: holds array of event data
  // setEvents: function to update events (like events = newValue)
  // useState([]) means it starts as an empty array
  const [events, setEvents] = useState<Event[]>([])
  
  // loading: true when fetching data, false when done
  const [loading, setLoading] = useState(true)
  
  // error: holds error message, or null if no error
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [itemsToShow, setItemsToShow] = useState(2) // Start by showing 2 items
  const ITEMS_PER_PAGE = 2          // Number of items to load each time

  // ------------------------------------------------------------------
  // FETCH DATA WHEN COMPONENT LOADS - Like window.onload in vanilla JS
  // ------------------------------------------------------------------
  
  useEffect(() => {
    // This function gets data from the backend API
    const fetchEvents = async () => {
      try {
        // API URL: In dev uses proxy, in production uses env variable
        const apiUrl = import.meta.env.VITE_API_URL 
          ? `${import.meta.env.VITE_API_URL}/api/v1/events/`
          : '/api/v1/events/'
        
        // Call the backend API (like using fetch() in vanilla JS)
        const response = await fetch(apiUrl)
        
        // Check if request was successful
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        
        // Convert response to JSON (same as vanilla JS)
        const data = await response.json()
        
        // Update the events variable with the data we got
        setEvents(data.events)

        // We're done loading
        setLoading(false)
        
      } catch (err) {
        // If something went wrong, store the error message
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    // Run the fetch function
    fetchEvents()
    
    // STUB: Add more data fetching here if needed
    
  }, []) // The [] means "run once when component loads" (like window.onload)

  // ------------------------------------------------------------------
  // PAGINATION HANDLERS
  // ------------------------------------------------------------------
  
  // Show more items (add ITEMS_PER_PAGE to current count)
  const handleShowMore = () => {
    setItemsToShow(prev => prev + ITEMS_PER_PAGE)
  }
  
  // Show less items (reset to initial count)
  const handleShowLess = () => {
    setItemsToShow(ITEMS_PER_PAGE)
  }
  
  // Get only the events we want to display
  const displayedEvents = events.slice(0, itemsToShow)
  
  // Check if there are more events to show
  const hasMore = itemsToShow < events.length
  
  // Check if we're showing more than the initial amount
  const canShowLess = itemsToShow > ITEMS_PER_PAGE



  // ------------------------------------------------------------------
  // RENDER - This is the HTML that gets displayed
  // Everything below "return" is just HTML with some JS mixed in
  // {variable} is how you show a variable's value in the HTML
  // ------------------------------------------------------------------
  
  return (
    // CARD COMPONENT - Just a fancy styled box
    <Card>
      
      {/* CARD HEADER */}
      <CardHeader>
        <CardTitle>Rally Events</CardTitle>
        <CardDescription>View event results and live updates.</CardDescription>
      </CardHeader>
      
      {/* CARD BODY */}
      <CardContent>
        
        {/* CONDITIONAL RENDERING - Show different things based on state */}
        
        {/* If loading is true, show "Loading..." */}
        {loading && (
          <p className="text-center text-slate-600 dark:text-slate-400">Loading events...</p>
        )}
        
        {/* If there's an error, show the error message */}
        {/* The {error} puts the error text inside the paragraph */}
        {error && (
          <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
        )}
        
        {/* If NOT loading and NO error, show the events */}
        {!loading && !error && (
          <div className="space-y-3">
            
            {/* LOOP THROUGH ARRAY - Like a for loop in vanilla JS */}
            {/* events.map() creates one div for each event */}
            {/* EVENT ITEMS - Only show sliced array */}
            {displayedEvents.map((event) => (
              
              // Each event item - clickable link that displays event details
              // Using Link component to make the whole card clickable
              // Modern hover effects: border, shadow, and slight scale
              <Link
                key={event.id}  // React needs a unique "key" for each item in a loop
                to={`/events/${event.date}`}  // Navigate to individual event page 
                className="group gap-8 flex items-stretch justify-between p-4 rounded-lg 
                
                border border-l-8 border-l-blue-500 dark:border-l-blue-600
                
                bg-slate-50 dark:bg-slate-800 
                
                border-slate-200 dark:border-slate-700 
                
                hover:border-blue-400 dark:hover:border-blue-500 

                hover:shadow-md hover:scale-[1.01] 
                transition-all duration-200 cursor-pointer"
                
              >
                {/* LEFT SIDE - Event name */}
                <div className="flex items-center gap-4">
                  
                  {/* Event name */}
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    {event.name}
                  </span>
                  
                  {/* STUB: Add event icon or image here */}
                </div>
                
                {/* RIGHT SIDE - Event date with arrow indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {event.date}
                  </span>
                  {/* Arrow: Always visible on mobile, appears on hover on desktop */}
                  <span className="
                  
                  text-slate-700 dark:text-slate-300 

                  md:opacity-0 md:group-hover:opacity-100 
                  md:-translate-x-1 md:group-hover:translate-x-0
         
                  transition-all duration-200">
                    → 
                  </span>
                </div>
                
              </Link>
            ))}
            
            {/* Show message if no events */}
            {events.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400">No upcoming events</p>
            )}



            {/* PAGINATION BUTTONS */}

                
            {events.length > ITEMS_PER_PAGE && (
                <div className="flex gap-3 justify-center pt-3 border-slate-200 dark:border-slate-700">
                    {/* SHOW MORE BUTTON */}            
                    {hasMore && (
                    <button
                        onClick={handleShowMore}
                        className="px-4 py-2  
                        rounded-lg
                        text-white
                        bg-blue-500 hover:bg-blue-600  
                        dark:bg-blue-800 dark:hover:bg-blue-900
                        transition"
                    >
                        Show More
                    </button>
                    )}

                    {/* SHOW LESS BUTTON */}
                    {canShowLess && (
                    <button
                        onClick={handleShowLess}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition"
                    >
                        Show Less
                    </button>
                    )}
                </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-1 justify-center text-xs text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
            {events.length > 0 &&  ` ${displayedEvents.length} of ${events.length}`}
        </div>
        
      </CardContent>
    </Card>
  )
}

// ============================================================================
// NOTES FOR BEGINNERS:
// ============================================================================
// - This is a "reusable component" - you can import it anywhere
// - It handles its own data fetching (self-contained)
// - The logic is separate from the page, keeping code organized
// - You can use this component in HomePage, or any other page
// - Import it like: import EventList from '@/components/events/EventList'
// - Use it like: <EventList />
// ============================================================================
