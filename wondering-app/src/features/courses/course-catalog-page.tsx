import { useState, useEffect, useMemo, useRef } from "react"
import { Search, X, BookOpen, Star, Globe, Award, Users, Pencil, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchCatalogCourses } from "./catalog-service"
import type { CatalogCourse, CatalogTab } from "./types"

/* ─── Deterministic pastel background per course id ─── */

const CARD_COLORS = [
  "bg-[hsl(43,40%,88%)]",
  "bg-[hsl(28,35%,87%)]",
  "bg-[hsl(154,30%,88%)]",
  "bg-[hsl(202,35%,89%)]",
  "bg-[hsl(340,25%,90%)]",
  "bg-[hsl(260,25%,90%)]",
  "bg-[hsl(70,30%,88%)]",
  "bg-[hsl(15,35%,89%)]",
]

function cardColor(id: string) {
  let hash = 0
  for (const ch of id) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length]
}

/* ─── Tab config ─── */

const TABS: { id: CatalogTab; label: string; icon: typeof Star }[] = [
  { id: "recommended", label: "Recommended", icon: Star },
  { id: "all", label: "All", icon: Globe },
  { id: "famous-authors", label: "Famous Authors", icon: Award },
  { id: "my-friends", label: "My Friends", icon: Users },
  { id: "my-published", label: "My Published", icon: Pencil },
]

/* ─── Course Card ─── */

function CatalogCard({
  course,
  onSelect,
}: {
  course: CatalogCourse
  onSelect: (course: CatalogCourse) => void
}) {
  return (
    <button
      onClick={() => onSelect(course)}
      className="group w-full text-left transition-transform active:scale-[0.98]"
    >
      {/* Image placeholder */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border ${cardColor(course.id)}`}
      >
        <div className="flex h-full items-center justify-center">
          <BookOpen className="size-10 text-text-tertiary/40" />
        </div>
        {course.popular && (
          <Badge
            variant="success"
            className="absolute right-2 top-2 rounded-md px-2 py-0.5 text-[11px]"
          >
            Most Popular
          </Badge>
        )}
      </div>

      {/* Info */}
      <h3 className="mt-2.5 min-h-[2.5rem] text-sm font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-brand-text transition-colors">
        {course.name}
      </h3>
      <p className="mt-0.5 text-xs text-text-tertiary truncate">
        {course.creator}
      </p>
      {course.sharedByFriend && (
        <p className="mt-0.5 text-[11px] font-medium text-brand-text truncate">
          Shared by {course.sharedByFriend}
        </p>
      )}
    </button>
  )
}

/* ─── Page ─── */

interface CourseCatalogPageProps {
  onClose: () => void
  onSelectCourse: (course: CatalogCourse) => void
}

export function CourseCatalogPage({
  onClose,
  onSelectCourse,
}: CourseCatalogPageProps) {
  const [activeTab, setActiveTab] = useState<CatalogTab>("recommended")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("For You")
  const [courses, setCourses] = useState<CatalogCourse[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const fetchId = useRef(0)

  // Fetch courses when tab, category, or search changes
  useEffect(() => {
    const id = ++fetchId.current
    setLoading(true)

    fetchCatalogCourses({
      tab: activeTab,
      category: activeCategory,
      search,
    }).then((result) => {
      if (id !== fetchId.current) return // stale request
      setCourses(result.courses)
      setCategories(result.categories)
      setLoading(false)
    })
  }, [activeTab, activeCategory, search])

  // Reset category when switching tabs
  const handleTabChange = (tab: CatalogTab) => {
    setActiveTab(tab)
    setActiveCategory("For You")
    setSearch("")
  }

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogCourse[]>()
    for (const c of courses) {
      const list = map.get(c.category) ?? []
      list.push(c)
      map.set(c.category, list)
    }
    return Array.from(map.entries())
  }, [courses])

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-surface px-4 pb-3 pt-4 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-text-primary">
            Choose a Course
          </h1>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 no-scrollbar md:-mx-6 md:px-6">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-brand-bg text-brand-text border border-brand-border"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or tag..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          />
        </div>

        {/* Category chips */}
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 no-scrollbar md:-mx-6 md:px-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-text-primary text-text-inverse"
                  : "border border-border bg-surface text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 pb-24 md:p-6 md:pb-6">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-text-tertiary" />
          </div>
        )}

        {/* Empty state */}
        {!loading && grouped.length === 0 && (
          <div className="py-12 text-center text-text-tertiary">
            {activeTab === "my-published"
              ? "You haven't published any courses yet."
              : search
                ? `No courses found for "${search}"`
                : "No courses in this category."}
          </div>
        )}

        {/* Course grid by category */}
        {!loading &&
          grouped.map(([category, groupCourses]) => (
            <div key={category} className="mb-8 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary">
                  {category}
                </h2>
                <button className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {groupCourses.map((course) => (
                  <CatalogCard
                    key={course.id}
                    course={course}
                    onSelect={onSelectCourse}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
