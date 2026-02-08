import { cn } from "@/lib/utils"
import { Home, Sparkles, BookOpen, UserCircle, ChevronLeft } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "create", label: "Create", icon: Sparkles },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "profile", label: "Profile", icon: UserCircle },
]

const pageTitles: Record<string, string> = {
  home: "Home",
  create: "Create",
  courses: "Courses",
  profile: "Profile",
  "course-catalog": "Catalog",
  "course-preview": "Course",
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const title = pageTitles[currentPage] ?? "Wondering"

  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="logo-font text-lg text-text-primary">{title}</span>
        <button className="rounded-lg p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary">
          <ChevronLeft className="size-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-tertiary text-text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-surface-tertiary text-sm font-medium text-text-primary">
            A
          </div>
          <span className="text-sm text-text-primary">Aidana Daulbayeva</span>
        </div>
      </div>
    </aside>
  )
}
