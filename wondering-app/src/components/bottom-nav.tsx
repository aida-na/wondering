import { cn } from "@/lib/utils"
import { Home, Sparkles, BookOpen, UserCircle } from "lucide-react"

interface BottomNavProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: "home", icon: Home },
  { id: "create", icon: Sparkles },
  { id: "courses", icon: BookOpen },
  { id: "profile", icon: UserCircle },
]

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface safe-area-bottom md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 transition-colors",
              isActive ? "text-text-primary" : "text-text-tertiary"
            )}
          >
            <Icon className="size-6" strokeWidth={isActive ? 2.2 : 1.5} />
          </button>
        )
      })}
    </nav>
  )
}
