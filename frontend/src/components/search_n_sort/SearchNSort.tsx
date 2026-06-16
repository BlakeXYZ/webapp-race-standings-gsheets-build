// ===========================================================================
// Search and Sort Component - Provides UI for searching and sorting drivers
// ===========================================================================

import { useEffect, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Driver } from '@/types/event'
    
interface SearchNSortProps {
  drivers: Driver[]
  onFilteredDriversChange: (filteredDrivers: Driver[]) => void
}

export default function SearchNSort({ drivers, onFilteredDriversChange }: SearchNSortProps) {

    // State for search query and sort option
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'rank' | 'name'>('rank')


    // Move filtering logic to useEffect to avoid setState during render
    useEffect(() => {
        let filtered = drivers

        // Filter by search query (searches driver name and car)
        if (searchQuery.trim()) {
        filtered = filtered.filter(driver =>
            driver.driver.toLowerCase().includes(searchQuery.toLowerCase())
         )
        }

        // Sort
        if (sortBy === 'rank') {
        filtered = [...filtered].sort((a, b) => parseInt(a.overall) - parseInt(b.overall))
        } else {
        filtered = [...filtered].sort((a, b) => a.driver.localeCompare(b.driver))
        }

        // Update parent component
        onFilteredDriversChange(filtered)
    }, [searchQuery, sortBy, drivers])



    return (

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

          </div>

        )
    }


