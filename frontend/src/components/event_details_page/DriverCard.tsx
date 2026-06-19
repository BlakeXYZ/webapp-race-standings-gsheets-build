// ============================================================================
// DRIVER CARD COMPONENT - Expandable driver details card
// ============================================================================

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Driver } from '@/types/event'

interface DriverCardProps {
  driver: Driver
  isEven?: boolean // Optional prop to indicate if this is an even row for styling
}

export default function DriverCard({ driver, isEven }: DriverCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPanel, setCurrentPanel] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reusable style classes for inner stat boxes
  const statBoxStyles = isEven 
    ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50' 
    : 'border-slate-300 dark:border-slate-500/50 bg-slate-100/75 dark:bg-slate-700/50'

  const scrollToPanel = (panelIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const panelWidth = container.scrollWidth / 2 // We have 2 panels
      container.scrollTo({
        left: panelWidth * panelIndex,
        behavior: 'smooth'
      })
      setCurrentPanel(panelIndex)
    }
  }

    // Reset panel to first one when card is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setCurrentPanel(0)
    }
  }, [isExpanded])

  return (
    <Card 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer
        border border-l-8 
        
        ${isEven 
          ? 'border-l-blue-500/50 dark:border-l-blue-600/50 bg-slate-50/50 dark:bg-slate-800/25' 
          : 'border-l-blue-500 dark:border-l-blue-600 bg-slate-200/70 dark:bg-slate-800'
        }
        
        hover:border-blue-400 dark:hover:border-blue-500 
        hover:shadow-md hover:scale-[1.01] 
      `}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-1">
            <p className={`
              text-2xl font-bold
              ${isEven ? 
                'text-slate-900 dark:text-blue-100' 
                : 'text-slate-900 dark:text-slate-100'
              }
            `}>
              #{driver.overall}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {driver.class} #{driver.class_rank}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl font-bold">{driver.driver.toUpperCase()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{driver.car}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* ALWAYS VISIBLE - Key Performance Stats */}
        <div className="flex gap-3 mb-2">
          {/* Most important - Avg Time */}
          <div className={`flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-1 ${statBoxStyles}`}>
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Avg</p>
            <p className="text-center font-bold text-base">{driver.avg_time}s</p>
          </div>
          
          {/* Context - Differential */}
          <div className={`flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-1 ${statBoxStyles}`}>
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Gap</p>
            <p className="text-center font-bold text-base">
              {driver.differential ? `+${driver.differential}s` : '--'}
            </p>
          </div>
        </div>

        {/* Expandable section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            
            {/* Horizontal scrollable container */}
            <div className="relative">
              {/* Scrollable wrapper */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ 
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
                }}
              >
                {/* Detailed Stats Container */}
                <div className={`
                  flex-shrink-0 w-full snap-center
                  border border-slate-200 dark:border-slate-700 rounded-md p-4 
                  ${statBoxStyles}
                `}>
                  <h4 className="text-xs font-semibold text-base text-slate-600 dark:text-slate-400 mb-3">
                    Detailed Stats
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Runs</p>
                      <p className="font-semibold text-base">{driver.runs}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Cones</p>
                      <p className={`font-semibold text-base ${driver.cones > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {driver.cones}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Best Run</p>
                      <p className="font-semibold text-base text-green-600 dark:text-green-400">
                        {driver.min}s
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Worst Run</p>
                      <p className="font-semibold text-base text-red-600 dark:text-red-400">
                        {driver.max}s
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Min Max Diff</p>
                      <p className="font-semibold text-base">{driver.min_max_diff}s</p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Penalty Time</p>
                      <p className={`font-semibold text-base ${driver.penalty > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {driver.penalty}s
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Raw Time</p>
                      <p className="font-semibold text-base">{driver.raw_time}s</p>
                    </div>

                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Total Time</p>
                      <p className="font-semibold text-base">{driver.total_time}s</p>
                    </div>
                  </div>
                </div>

                {/* Run Details Container */}
                <div className={`
                  flex-shrink-0 w-full snap-center
                  border border-slate-200 dark:border-slate-700 rounded-md p-4 
                  ${statBoxStyles}
                `}>
                  <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                    Run Details
                  </h4>

                  {/* Dynamic grid: 2-4 columns based on number of runs */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Loop through run_details array */}
                    {driver.run_details && driver.run_details.map((run) => (
                      <div key={run.number}>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          Run {run.number}
                        </p>
                        <p className={`
                          font-semibold text-base
                          ${run.time === driver.min ? 'text-green-600 dark:text-green-400' : ''}
                          ${run.time === driver.max ? 'text-red-600 dark:text-red-400' : ''}
                        `}>
                          {run.time}s
                          {run.cones > 0 && (
                            <span className="text-red-500 dark:text-red-400 ml-1">
                              +{run.cones}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Scroll hint indicator (optional) */}
              <div className="flex sm:hidden justify-center mb-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  ← Swipe to see more →
                </span>
              </div>

              {/* Navigation arrows */}
              {/* only visible on med to large screens */}
              <div className=" hidden sm:flex justify-center items-center gap-4 mt-3">

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollToPanel(0)
                  }}
                  disabled={currentPanel === 0}
                  className={`
                    w-8 h-8 rounded-full text-sm font-medium transition-all flex items-center justify-center
                    ${currentPanel === 0 
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                    }
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    scrollToPanel(1)
                  }}
                  disabled={currentPanel === 1}
                  className={`
                    w-8 h-8 rounded-full text-sm font-medium transition-all flex items-center justify-center
                    ${currentPanel === 1 
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                    }
                  `}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-3">
          {/* Expand indicator */}
          <span className="text-xs font-thin text-slate-400 dark:text-slate-500">
            {isExpanded ? 'Show Less ▲' : 'Show More ▼'}
          </span>
        </div>

      </CardContent>
    </Card>
  )
}