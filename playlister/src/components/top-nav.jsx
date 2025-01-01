import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Bell, Search } from "lucide-react"

export function TopNav() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded bg-zinc-800" />
        <h1 className="text-xl font-semibold text-zinc-100">Design Studio</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* <Button 
          className= "border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50"
        >
          Load Layout
        </Button> */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            className="w-[280px] pl-8 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-400"
            placeholder="Search Project..."
            type="search"
          />
        </div>
        <Button 
          size="icon" 
          variant="ghost"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-zinc-800" />
      </div>
    </div>
  )
}

