import { useState, useMemo } from "react"
import { Search, X, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockCatalogCourses, catalogCategories } from "./mock-data"
import type { CatalogCourse } from "./types"

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

      {/* Info — fixed height so cards align across the row */}
      <h3 className="mt-2.5 min-h-[2.5rem] text-sm font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-brand-text transition-colors">
        {course.name}
      </h3>
      <p className="mt-0.5 text-xs text-text-tertiary truncate">
        {course.creator}
      </p>
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
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("For You")

  const filteredCourses = useMemo(() => {
    let courses = mockCatalogCourses

    if (search.trim()) {
      const q = search.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.creator.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
    }

    if (activeCategory !== "For You" && activeCategory !== "All") {
      courses = courses.filter((c) => c.category === activeCategory)
    }

    return courses
  }, [search, activeCategory])

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogCourse[]>()
    for (const c of filteredCourses) {
      const list = map.get(c.category) ?? []
      list.push(c)
      map.set(c.category, list)
    }
    return Array.from(map.entries())
  }, [filteredCourses])

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
          {catalogCategories.map((cat) => (
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

      {/* Course grid by category */}
      <div className="p-4 pb-24 md:p-6 md:pb-6">
        {grouped.length === 0 && (
          <div className="py-12 text-center text-text-tertiary">
            No courses found for "{search}"
          </div>
        )}

        {grouped.map(([category, courses]) => (
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
              {courses.map((course) => (
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
