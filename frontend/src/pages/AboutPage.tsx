// ============================================================================
// IMPORTS - Bringing in tools we need
// ============================================================================

// Import our pre-made card components (these are just styled divs)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import arpLogo from '@/assets/arp_logo.png'

// ============================================================================
// ABOUT PAGE COMPONENT - Information about the project
// ============================================================================

export default function AboutPage() {
  
  // ------------------------------------------------------------------
  // RENDER - This is the HTML that gets displayed
  // This is a simple informational page with no interactive elements
  // No state or effects needed - just displays static content
  // ------------------------------------------------------------------
  
  return (
    // CENTERED CONTENT - Max width container
    // max-w-4xl limits width to 896px, mx-auto centers it horizontally
    // Layout component now handles padding and background
    <div className="max-w-4xl mx-auto">
        
        {/* PAGE TITLE */}
        {/* text-center: center align text */}
        {/* mb-8: margin-bottom of 2rem (32px) */}
        <h1 className="text-4xl font-bold text-center mb-40 text-slate-900 dark:text-slate-100">
          About
        </h1>

        <img 
          src={arpLogo} 
          alt="ARP Logo Background" 
          className="absolute top-20 left-1/2 -translate-x-1/2 h-80 w-80 opacity-15 pointer-events-none" 
        />

        {/* ============================================================ */}
        {/* SECTION 1: PROJECT OVERVIEW */}
        {/* ============================================================ */}
        {/* mb-6: margin-bottom of 1.5rem (24px) for spacing between cards */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Project description paragraph */}
            <div className="text-slate-700 dark:text-slate-300 space-y-4">
              <p>
                Austin Rally Project is an off-road track dedicated to Rallycross. The track is located just 40 minutes North East of Austin, Texas.
              </p>

            <p>
                <a 
                  href="https://maps.app.goo.gl/bqBcJzuWWCKiYYAE7"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  1500 FM 1466,<br />Coupland, TX 78615
                </a>
            </p>
                
            </div>
          </CardContent>
        </Card>

        {/* ============================================================ */}
        {/* SECTION 4: CONTACT */}
        {/* ============================================================ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-700 dark:text-slate-300 space-y-4">
                
              <p className="text-slate-400 mb-4">
                <a href="mailto:Josh@AustinRallyProject.com" className="hover:text-white transition-colors">
                  Josh@AustinRallyProject.com
                </a>
              </p>
                  
            </div>
          </CardContent>
        </Card>
       
        {/* ============================================================ */}
        {/* SECTION 5: LINKS & RESOURCES */}
        {/* ============================================================ */}
        <Card>
          <CardHeader>
            <CardTitle>Links & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Container with vertical spacing */}
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              
              <p>
                <strong>Primary website:</strong>
                <br />
                <a 
                  href="https://austinrallyproject.wixsite.com/home"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  austinrallyproject.wixsite.com/home
                </a>
              </p>
              

              <p>
                <strong>Event registration:</strong>
                <br />
                <a 
                  href="https://tinyurl.com/Rallycross-ARP" 
                  className="text-blue-600 hover:underline dark:text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tinyurl.com/Rallycross-ARP
                </a>
              </p>

            </div>
          </CardContent>
        </Card>

        {/* STUB: Add more sections as needed */}
        {/* Example: Team members, Changelog, Contributing guidelines, etc. */}

    </div>
  )
}

// ============================================================================
// NOTES FOR BEGINNERS:
// ============================================================================
// - This is a "stateless" component (no useState/useEffect)
// - Only displays static information - no data fetching needed
// - Cards are used to organize content into sections
// - The grid layout automatically becomes 1 column on mobile (responsive)
// - Dark mode classes (dark:...) automatically apply when dark mode is on
// - All content is hardcoded - you could move this to a CMS or config file
// ============================================================================
