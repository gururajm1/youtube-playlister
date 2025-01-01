import { cn } from "../lib/utils"
import { BarChart3, Calendar, Film, Layout, List, ShoppingCart, Users, Zap } from "lucide-react"

export function SidebarNav({ className, ...props }) {
  return (
    <div className="w-[240px] border-r border-zinc-800 bg-zinc-950 h-screen" {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <BarChart3 className="h-4 w-4" />
              Revenue
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <Film className="h-4 w-4" />
              Shoppable Video
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <Layout className="h-4 w-4" />
              Story
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <ShoppingCart className="h-4 w-4" />
              Live Commerce
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-zinc-800 px-3 py-2 text-zinc-100"
            >
              <List className="h-4 w-4" />
              Playlist Manager
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <Zap className="h-4 w-4" />
              One Click Post
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100"
            >
              <Users className="h-4 w-4" />
              Hire Influencer
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

