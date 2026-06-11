// ============================================================================
// IMPORTS - Bringing in tools we need
// ============================================================================

// useState: Store variables that can change (like a regular variable in JS)
// useEffect: Run code when the page loads (like window.onload in vanilla JS)
import { useState, useEffect } from 'react'

// Import our pre-made card components (these are just styled divs)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useParams } from "react-router-dom";


// Import our EventList component - handles event fetching and display
// This keeps HomePage.tsx clean by separating event logic into its own file
import DriverCard from '@/components/event_details_page/DriverCard'


// ============================================================================
// DATA TYPES - Defining what our data looks like (optional but helpful)
// ============================================================================
// This is like a schema - it says each standing has these 3 properties
// Think of it as documentation for what data structure we expect
import { EventDetail } from '@/types/event'


// ============================================================================
// API FUNCTIONS - These are the functions that talk to our backend API
// ============================================================================
import { fetchEventByDate } from '@/services/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

// ============================================================================
// EVENT DETAILS PAGE COMPONENT - Displays race standings
// ============================================================================

export default function EventDetailsPage() {

    
  // -----------------------------------------------------------------
  // STATE VARIABLES - Think of these like regular variables, but when
  // they change, the page automatically updates to show the new value
  // ------------------------------------------------------------------

  //  Inside App.tsx:
  // <Route path="/events/:event_date" element={<EventDetailsPage />} />
  // //                    ^^^^^^^^^^^
  // //                    This defines the parameter name
  
  const { event_date } = useParams<{ event_date: string }>()
  //      ^^^^^^^^^^^                ^^^^^^^^^^^
  //      Variable name              Type annotation
  //      (must match route)         (tells TypeScript it's a string)

  // standings: holds array of driver data
  // setStandings: function to update standings (like standings = newValue)
  // useState([]) means it starts as an empty array
  const [eventDetails, setEventDetails] = useState<EventDetail | null>(null)
  
  // loading: true when fetching data, false when done
  const [loading, setLoading] = useState(true)
  
  // error: holds error message, or null if no error
  const [error, setError] = useState<string | null>(null)

  // searchQuery: holds current search text
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rank' | 'name'>('rank') // default: sort by rank


  // ------------------------------------------------------------------
  // FETCH DATA WHEN PAGE LOADS - Like window.onload in vanilla JS
  // ------------------------------------------------------------------
  
  useEffect(() => {

    if (!event_date) return;
    setLoading(true);
    setError(null);

    // This function gets data from the backend API
    const fetchEventDetails = async () => {
      try {
        // -------------- NOW calling the API function we created in api.ts -------------
        // // API URL: In dev uses proxy, in production uses env variable
        // const apiUrl = import.meta.env.VITE_API_URL 
        //   ? `${import.meta.env.VITE_API_URL}/api/v1/events/${event_date}`
        //   : `/api/v1/events/${event_date}`
        
        // // Call the backend API (like using fetch() in vanilla JS)
        // const response = await fetch(apiUrl)
        
        // // Check if request was successful
        // if (!response.ok) {
        //   throw new Error('Failed to fetch event details')
        // }
        
        // // Convert response to JSON (same as vanilla JS)
        // const data = await response.json()

        
        const eventData = await fetchEventByDate(event_date!)

        // Update the eventDetails variable with the data we got
        setEventDetails(eventData)

        // We're done loading
        setLoading(false)
        
      } catch (err) {
        // If something went wrong, store the error message
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    // Run the fetch function
    fetchEventDetails()
    
    // STUB: Add more data fetching here if needed
    // Example: fetchDriverDetails(), fetchRaceSchedule(), etc.
    
  }, [event_date]) // The [] means "run once when page loads" (like window.onload)

  // ------------------------------------------------------------------
  // FILTER AND SORT DRIVERS
  // ------------------------------------------------------------------
  const getFilteredAndSortedDrivers = () => {
    if (!eventDetails) return []
    
    let drivers = Object.values(eventDetails.drivers_by_overall)
    
    // FILTER: Search by driver name
    if (searchQuery) {
      drivers = drivers.filter(driver => 
        driver.driver.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // SORT: By rank or name
    if (sortBy === 'name') {
      drivers = [...drivers].sort((a, b) => 
        a.driver.localeCompare(b.driver)
      )
    }
    // If sortBy === 'rank', already sorted by overall position
    
    return drivers
  }


  // ------------------------------------------------------------------
  // RENDER - This is the HTML that gets displayed
  // Everything below "return" is just HTML with some JS mixed in
  // {variable} is how you show a variable's value in the HTML
  // ------------------------------------------------------------------
  
  return (
    // CENTERED CONTENT - Max width container
    // Layout component now handles padding and background
    <div className="max-w-4xl mx-auto">
        
        {/* PAGE TITLE */}


          {/* CONDITIONAL RENDERING - Show different things based on state */}
          
          {/* If loading is true, show "Loading..." */}
          {loading && (
            <p className="text-center text-slate-600 dark:text-slate-400">Loading...</p>
          )}
          
          {/* If there's an error, show the error message */}
          {/* The {error} puts the error text inside the paragraph */}
          {error && (
            <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
          )}


          {!loading && !error && eventDetails && (
            <>
              <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-slate-100">
                {eventDetails.name}
              </h1>
              <h2 className="text-2xl font-light text-center mb-8 text-slate-900 dark:text-slate-100">
                {eventDetails.date}
              </h2>
            </>
          )}

        {/* Search, Filter, and Sort Components */}
        {!loading && !error && eventDetails && (
          <div className="mb-6 space-y-3">

            <div className="flex gap-2">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 
                          bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            

            {/* Sort By Icon for Dropdown */}
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:shadow-md hover:scale-[1.01]  w-full h-full px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                 
                  <svg className="text-slate-500 dark:text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">


                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => setSortBy('rank')}
                      className={` ${
                        sortBy === 'rank' 
                          ? 'text-white dark:text-white'
                          : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      Sort by Rank
                    </button>
                  </DropdownMenuItem>


                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => setSortBy('name')}
                      className={` ${
                        sortBy === 'name' 
                          ? 'text-white dark:text-white' 
                          : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      Sort by Name
                    </button>
                  </DropdownMenuItem>

   

                
              </DropdownMenuContent>
              </DropdownMenu>
            </div>

            </div>

            {/* Results count */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {getFilteredAndSortedDrivers().length} of {Object.keys(eventDetails.drivers_by_overall).length} drivers
            </p>
          </div>
        )}




        
        {/* CARD COMPONENT - Just a fancy styled box */}
        {false && (
        <Card>
          {/* CARD HEADER */}
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Event Details Description</CardDescription>
            {/* STUB: Add more header elements here if needed */}
          </CardHeader>
          
          {/* CARD BODY */}
          <CardContent>
            
            {/* CONDITIONAL RENDERING - Show different things based on state */}
            
            {/* If loading is true, show "Loading..." */}
            {loading && (
              <p className="text-center text-slate-600 dark:text-slate-400">Loading...</p>
            )}
            
            {/* If there's an error, show the error message */}
            {/* The {error} puts the error text inside the paragraph */}
            {error && (
              <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
            )}
            
            {/* If NOT loading and NO error, show the standings */}
            {!loading && !error && eventDetails && (
              <div className="space-y-3 text-center">
                <p className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{eventDetails.name}</p>
                <p className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{eventDetails.date}</p>

                {/* STUB: Add more event details here */}
                
    
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* SEARCH, FILTER, and SORT COMPONENTS */}


        {/* DRIVER STANDINGS */}
        {!loading && !error && eventDetails && (
          <div>
            {getFilteredAndSortedDrivers().map((driverData) => (
              <DriverCard key={driverData.overall} driver={driverData} />
            ))}


            {/* No results message */}
            {getFilteredAndSortedDrivers().length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No drivers found matching "{searchQuery}"
              </p>
            )}
          </div>
        )}


        {/* STUB: Add more cards/sections below */}
        {/* Example: Recent races, upcoming events, etc. */}
        

    </div>
  )
}
