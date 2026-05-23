import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import EventsDropDownItems from '@/components/events/EventsDropDownItems'
import { ModeToggle } from '@/components/mode-toggle/mode-toggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold ">ARP Event Results</Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 items-center">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            {/* Desktop Events Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-blue-400 transition-colors cursor-pointer">
                    Events ▾
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <EventsDropDownItems />
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {/* =========== Temporarily Disabled */}
            {/* <li><Link to="/standings" className="hover:text-blue-400 transition-colors">Standings</Link></li> */}
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
            <li><ModeToggle /></li>
            
          </ul>

          {/* Mobile Menu + Mode Toggle*/}
        <div className="flex items-center md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 rounded hover:bg-slate-800">
              Menu ☰
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">

              <DropdownMenuItem asChild>
                <Link to="/" className='cursor-pointer'>Home</Link>
              </DropdownMenuItem>

              {/* Nested Events Submenu for Mobile */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Events</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <EventsDropDownItems />
                </DropdownMenuSubContent>
              </DropdownMenuSub>


              {/* =========== Temporarily Disabled */}
              {/* <DropdownMenuItem asChild>
                <Link to="/standings" className='cursor-pointer'>Standings</Link>
              </DropdownMenuItem> */}

              <DropdownMenuItem asChild>
                <Link to="/about" className='cursor-pointer'>About</Link>
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
            <ModeToggle />
          </div>


        </div>
      </nav>
    </header>
  )
}