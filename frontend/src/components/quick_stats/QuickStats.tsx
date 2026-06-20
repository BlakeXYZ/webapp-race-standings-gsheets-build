
// useState: Store variables that can change (like a regular variable in JS)
// useEffect: Run code when the page loads (like window.onload in vanilla JS)
import { useState, useEffect } from 'react'

// Import our pre-made card components (these are just styled divs)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


// ============================================================================
// API FUNCTIONS - These are the functions that talk to our backend API
// ============================================================================
import { fetchSeasonOverview } from '@/services/api'



// ============================================================================
// DATA TYPES - Defining what our data looks like (optional but helpful)
// ============================================================================

// This is like a schema - it says each event has these properties
interface Event {
  id: number          // Unique event ID
  name: string        // Event name
  date: string        // Event date
}


interface SeasonOverview {
  driver_count: number
  cone_count: number
  event_count: number
}

// ============================================================================
// EVENT LIST COMPONENT - Displays list of racing events
// ============================================================================



export default function QuickStats() {

    // ------------------------------------------------------------------
    // STATE VARIABLES - Think of these like regular variables, but when
    // they change, the page automatically updates to show the new value
    // ------------------------------------------------------------------
    
    // useState([]) means it starts as an empty array
    // seasonOverview: holds summary stats for the season (driver_count, cone_count, event_count etc.)
    const [seasonOverview, setSeasonOverview] = useState<SeasonOverview | null>(null)
    
    // loading: true when fetching data, false when done
    const [loading, setLoading] = useState(true)
    
    // error: holds error message, or null if no error
    const [error, setError] = useState<string | null>(null)


    // ------------------------------------------------------------------
    // FETCH DATA WHEN COMPONENT LOADS - Like window.onload in vanilla JS
    // ------------------------------------------------------------------
    
    useEffect(() => {
        // This function gets data from the backend API
        const fetchEvents = async () => {
        try {

            const seasonOverviewData = await fetchSeasonOverview()

            setSeasonOverview(seasonOverviewData)

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




    return (

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Stats from the {'<YEAR>'} Season</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Grid with 3 columns - each column shows a stat */}
            <div className="grid grid-cols-3 gap-4 text-center">
              
              {/* STAT 1 - Drivers */}
              <div>
                {/* Big number on top */}
                <div className="text-3xl font-bold text-blue-600">
                    {loading ? (
                    <div className="animate-pulse">...</div>
                    ) : (
                    seasonOverview?.driver_count ?? '--'
                    )}
                </div>
                {/* Label below */}
                <div className="text-sm text-slate-600 dark:text-slate-400">Drivers</div>
              </div>
              


              {/* STAT 2 - Cones */}
              <div>
                <div className="text-3xl font-bold text-green-600">
                    {loading ? (
                    <div className="animate-pulse">...</div>
                    ) : (
                    seasonOverview?.cone_count ?? '--'
                    )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Cones Killed</div>
              </div>
              


              {/* STAT 3 - Races */}
                <div>
                    <div className="text-3xl font-bold text-purple-600">
                        {loading ? (
                        <div className="animate-pulse">...</div>
                        ) : (
                        seasonOverview?.event_count ?? '--'
                        )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Events</div>
                </div>
              
              {/* STUB: Replace these numbers with real data from API */}
              {/* Example: Use useState + useEffect to fetch stats from backend */}
            </div>
          </CardContent>
        </Card>
    )
}