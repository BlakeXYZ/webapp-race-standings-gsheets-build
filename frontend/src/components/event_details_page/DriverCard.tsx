// ============================================================================
// DRIVER CARD COMPONENT - Expandable driver details card
// ============================================================================

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Driver } from '@/types/event'

interface DriverCardProps {
  driver: Driver
}

export default function DriverCard({ driver }: DriverCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card 
      onClick={() => setIsExpanded(!isExpanded)}
      className="
      
        hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer

        border border-l-8 border-l-blue-500 dark:border-l-blue-600
      
        bg-slate-50 dark:bg-slate-800 
        
        hover:border-blue-400 dark:hover:border-blue-500 

        hover:shadow-md hover:scale-[1.01] 
      "
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{driver.driver.toUpperCase()}</CardTitle>
            <CardDescription>{driver.car}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-2xl font-bold">#{driver.overall}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {driver.class} #{driver.class_rank}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* ALWAYS VISIBLE - Key Performance Stats */}
        <div className="grid grid-cols-4 gap-3 text-sm mb-2">
          {/* Most important - Avg Time */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-1">
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Avg</p>
            <p className="text-center font-bold text-base">{driver.avg_time}s</p>
          </div>
          
          {/* Context - Differential */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-1">
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Gap</p>
            <p className="text-center font-semibold text-base">
              {driver.differential ? `+${driver.differential}s` : '--'}
            </p>
          </div>


          <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-1">
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Runs</p>
            <p className="text-center font-semibold text-base">{driver.runs}</p>
          </div>
          

          {/* Quick penalty indicator */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-md p-1">
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Cones</p>
            <p className="text-center font-semibold text-base">
              {driver.cones}
            </p>
          </div>

        </div>

        {/* Expandable section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Detailed Stats
            </h4>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              {/* Consistency */}

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Best Run</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {driver.min}s
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Worst Run</p>
                <p className="font-semibold text-red-600 dark:text-red-400">{driver.max}s</p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Min Max Diff</p>
                <p className="font-semibold">{driver.min_max_diff}s</p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Penalty Time</p>
                <p className={`font-semibold ${driver.penalty > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                  {driver.penalty}s
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Raw Time</p>
                <p className="font-semibold">{driver.raw_time}s</p>
              </div>


              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Total Time</p>
                <p className="font-semibold">{driver.total_time}s</p>
              </div>
              
            </div>


            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                Run Details
              </h4>

              {/* Dynamic grid: 2-4 columns based on number of runs */}
              <div className="grid grid-cols-4 gap-4">
                
                {/* Loop through run_details array */}
                {driver.run_details && driver.run_details.map((run) => (
                  <div key={run.number}>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Run {run.number}
                    </p>
                    <p className="font-semibold text-sm ">
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