// ============================================================================
// IMPORTS - Bringing in tools we need
// ============================================================================

// Link: Allows navigation between pages without full page reload (like <a> in HTML)
// This is from React Router - it changes the URL but doesn't refresh the page
import { Link } from 'react-router-dom'

// Import our pre-made card components (these are just styled divs)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import our EventList component - handles event fetching and display
// This keeps HomePage.tsx clean by separating event logic into its own file
import EventList from '@/components/events/EventList'
import QuickStats from '@/components/quick_stats/QuickStats'



// ============================================================================
// HOME PAGE COMPONENT - Landing page for the app
// ============================================================================

export default function HomePage() {
  
  // ------------------------------------------------------------------
  // RENDER - This is the HTML that gets displayed
  // Everything below "return" is just HTML with some JS mixed in
  // No state needed here - EventList component handles its own data
  // ------------------------------------------------------------------
  
  return (
    // CENTERED CONTENT - Max width container
    // max-w-4xl limits the width, mx-auto centers it
    // Layout component now handles padding and background
    <div className="max-w-4xl mx-auto">
        
        {/* ============================================================ */}
        {/* HERO SECTION - Main welcome message at top of page */}
        {/* ============================================================ */}
        <div className="text-center mb-12">
          {/* Main heading - text-5xl makes it big, font-bold makes it thick */}
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Austin Rally Project Event Results
          </h1>
          {/* Subheading - smaller text with lighter color */}
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Track your laptimes and standings in real-time.
          </p>
          <p className="mt-2 text-xl font-semibold italic text-slate-400 dark:text-slate-500">
            🛠️ Webapp Under Construction! 🛠️
          </p>
        </div>

        {/* ============================================================ */}
        {/* EVENT LIST SECTION - Shows upcoming events from API */}
        {/* ============================================================ */}
        {/* EventList is a separate component that handles its own data fetching */}
        {/* This keeps HomePage.tsx clean and focused on layout only */}
        {/* Full width section - placed before the feature cards */}
        <div className="mb-8">
          <EventList />
        </div>

        {/* ============================================================ */}
        {/* FEATURE CARDS GRID - Two cards side by side */}
        {/* ============================================================ */}
        {/* grid creates a grid layout, md:grid-cols-2 means 2 columns on medium+ screens */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* CARD 1 - Link to Standings Page */}
          {/* hover:shadow-lg adds shadow on hover, transition-shadow animates it */}
          {/* flex flex-col makes the card a vertical flex container */}
          <Card className="flex flex-col">
            
            {/* Card Header - Title and description */}
            <CardHeader>
              <CardTitle>Season Standings</CardTitle>
              <CardDescription>View current driver standings, points, and rankings updated in real-time.</CardDescription>
            </CardHeader>
            
            {/* Card Body - Main content */}
            {/* flex-1 makes this grow to fill available space, pushing button down */}
            <CardContent className="flex-1 flex flex-col">
              {/* Description text */}
              {/* <p className="text-slate-700 dark:text-slate-300 mb-4">
                View current driver standings, points, and rankings updated in real-time.
              </p>
               */}
              {/* Link Button - Navigate to /standings page */}
              {/* to="/standings" is like href in <a> tag, but doesn't reload page */}
              {/* mt-auto pushes this to the bottom, self-start prevents stretching to full width */}
              
              {/* =========== Temporarily Disabled */}
              {/* <Link 
                to="/standings" 
                className="inline-block 
                bg-blue-500 hover:bg-blue-600  
                dark:bg-blue-800 dark:hover:bg-blue-900
                text-white px-4 py-2 rounded-lg transition-colors mt-auto self-start"
              >
                View Standings →
              </Link> */}
              {/* ===========*/}

              <div className="inline-block bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg mt-auto self-start cursor-not-allowed">
              Coming Soon
              </div>      
                  
            </CardContent>
          </Card>

          {/* CARD 2 - Link to About Page */}
          {/* flex flex-col makes the card a vertical flex container */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Learn more about Austin Rally Project.</CardDescription>
            </CardHeader>
            {/* flex-1 makes this grow to fill available space, pushing button down */}
            <CardContent className="flex-1 flex flex-col">
              
              {/* Link Button - Navigate to /about page */}
              {/* mt-auto pushes this to the bottom, self-start prevents stretching to full width */}
              <Link 
                to="/about" 
                className="mt-auto inline-block bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors self-start"
              >
                Learn More →
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* ============================================================ */}
        {/* QUICK STATS SECTION - Shows placeholder numbers */}
        {/* ============================================================ */}
        <div className="mb-8">
          <QuickStats />
        </div>


        {/* STUB: Add more sections here */}
        {/* Example: Recent races, upcoming events, news feed, etc. */}

    </div>
  )
}

// ============================================================================
// NOTES FOR BEGINNERS:
// ============================================================================
// - This is a "container" page - it imports and composes other components
// - EventList component handles its own data fetching (separation of concerns)
// - This keeps HomePage.tsx clean and focused on layout/structure
// - You can reuse EventList in other pages by importing it
// - The <Link> component is from React Router - it's like <a> but faster
// - className is how we apply CSS in React (same as "class" in HTML)
// - Tailwind CSS classes are used for styling (e.g., text-5xl, bg-blue-600)
// - Component composition: Build pages from smaller, reusable components
// ============================================================================
// ============================================================================
// END OF FILE
// ============================================================================