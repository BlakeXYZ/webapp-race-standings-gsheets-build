// ============================================================================
// ENTRY POINT - This file starts your React app
// Think of this like the <script> tag in vanilla HTML that loads everything
// ============================================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'           // Our main component (the page)
import './index.css'                   // Global styles (Tailwind CSS)


// ============================================================================
// RENDER THE APP - Mount React to the DOM
// ============================================================================

// Find the <div id="root"></div> in index.html
// This is where React will put all the HTML it generates
ReactDOM.createRoot(document.getElementById('root')!).render(
  
  // StrictMode helps catch bugs during development (optional)
  // TODO: DISABLE StrictMode in production if it causes issues with certain libraries
  <React.StrictMode> 
    <BrowserRouter>
        {/* This loads our App component from App.tsx */}
        <App />
    </BrowserRouter>
    {/* STUB: Add global providers here if needed */}
    {/* Example: <ThemeProvider>, <AuthProvider>, <Router>, etc. */}
  </React.StrictMode>,
)

// ============================================================================
// THAT'S IT! React takes over from here
// ============================================================================
// React will:
// 1. Load the App component
// 2. Convert JSX to HTML
// 3. Put it in <div id="root"></div>
// 4. Update the page automatically when data changes

