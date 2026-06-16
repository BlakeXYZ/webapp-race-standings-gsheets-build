// ============================================================================
// DRIVER CARD COMPONENT - Expandable driver details card
// ============================================================================

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Driver } from '@/types/event'

interface DriverCardProps {
  driver: Driver
  isEven?: boolean // Optional prop to indicate if this is an even row for styling
}

export default function DriverCard({ driver, isEven }: DriverCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
      
        hover:shadow-lg transition-all duration-200 mt-5 cursor-pointer

        border border-l-8 
        
        border-l-blue-500 dark:border-l-blue-600
        bg-slate-50 dark:bg-slate-800 
      
        ${isEven 
          ? 'border-l-blue-500/50 dark:border-l-blue-600/50 bg-slate-50/50 dark:bg-slate-800/40' 
          : 'border-l-blue-500 dark:border-l-blue-600 bg-slate-200/55 dark:bg-slate-800'
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
            `}
            >
              #{driver.overall}</p>
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
          <div className={`
          flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-1

            ${isEven ? 
              'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50' 
              : 'border-slate-300 dark:border-slate-500/50 bg-slate-200 dark:bg-slate-700'
            }

          `}
          >
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Avg</p>
            <p className="text-center font-bold text-base">{driver.avg_time}s</p>
          </div>
          
          {/* Context - Differential */}
          <div className={`
          flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-1

            ${isEven ? 
              'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50' 
              : 'border-slate-300 dark:border-slate-500/50 bg-slate-200 dark:bg-slate-700'
            }

          `}
          >
            <p className="text-center text-slate-500 dark:text-slate-400 text-xs">Gap</p>
            <p className="text-center font-semibold text-base">
              {driver.differential ? `+${driver.differential}s` : '--'}
            </p>
          </div>
        </div>

        {/* Expandable section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">



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