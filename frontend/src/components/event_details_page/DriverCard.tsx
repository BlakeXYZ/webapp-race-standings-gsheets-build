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
            <CardTitle className="text-lg">{driver.driver}</CardTitle>
            <CardDescription>{driver.car}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-2xl font-bold">#{driver.overall}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* Always visible info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Class</p>
            <p className="font-semibold">{driver.class}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Total Time</p>
            <p className="font-semibold">{driver.total_time}s</p>
          </div>

          
        </div>

        {/* Expandable section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Average Time</p>
                <p className="font-semibold">{driver.avg_time}s</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Cones Hit</p>
                <p className="font-semibold">{driver.cones}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Penalty</p>
                <p className="font-semibold">{driver.penalty}s</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Total Runs</p>
                <p className="font-semibold">{driver.runs}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Class Rank</p>
                <p className="font-semibold">#{driver.class_rank}</p>
              </div>
            </div>
          </div>
        )}


        <div className="flex justify-end mt-2">

        {/* Expand indicator */}
            <span className="text-xs font-thin text-slate-400 dark:text-slate-500">
                {isExpanded ? 'Show Less ▲' : 'Show More ▼'}
            </span>
        </div>

      </CardContent>
    </Card>
  )
}