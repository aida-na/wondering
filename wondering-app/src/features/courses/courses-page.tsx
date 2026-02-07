import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { showToast } from "@/components/ui/toast"
import { MoreVertical, Pencil, Trash2, Share2, Users } from "lucide-react"
import type { Course, CourseStatus } from "./types"
import { mockCourses } from "./mock-data"
import { generateShareLink, shareCourse } from "./share-utils"

function statusBadgeVariant(status: CourseStatus) {
  switch (status) {
    case "In Progress":
      return "brand"
    case "Completed":
      return "success"
    case "Not Started":
    default:
      return "default"
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/* ─── Kebab menu (shared between card and table row) ─── */

interface CourseMenuProps {
  course: Course
  onShare: (course: Course) => void
  onDelete: (id: string) => void
  onEditName: (id: string) => void
  onOpenPreview?: () => void
}

function CourseMenu({ course, onShare, onDelete, onEditName }: CourseMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-2 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors">
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEditName(course.id)}>
          <Pencil className="size-4 text-text-tertiary" />
          Edit name
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onShare(course)}>
          <Share2 className="size-4 text-text-tertiary" />
          Share course
          {course.shareCount > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-text-tertiary">
              <Users className="size-3" />
              {course.shareCount}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => onDelete(course.id)}>
          <Trash2 className="size-4" />
          Delete course
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ─── Mobile: Course Card ─── */

function CourseCard({ course, onShare, onDelete, onEditName, onOpenPreview }: CourseMenuProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      {/* Top row: name + kebab */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="font-medium text-text-primary leading-snug cursor-pointer hover:text-brand-text transition-colors"
            onClick={onOpenPreview}
          >
            {course.name}
          </h3>
          <span className="text-xs text-text-tertiary">by {course.creator}</span>
        </div>
        <CourseMenu
          course={course}
          onShare={onShare}
          onDelete={onDelete}
          onEditName={onEditName}
        />
      </div>

      {/* Meta row: status + lesson count */}
      <div className="mt-3 flex items-center gap-3">
        <Badge variant={statusBadgeVariant(course.status)}>
          {course.status}
        </Badge>
        <span className="text-sm text-text-secondary">
          {course.doneLessons} / {course.totalLessons} lessons
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="tertiary" size="md" uppercase={false} fullWidth>
          View Saved
        </Button>
        <Button variant="primary" size="md" fullWidth>
          Review
        </Button>
      </div>
    </div>
  )
}

/* ─── Desktop: Table Row ─── */

function CourseRow({ course, onShare, onDelete, onEditName, onOpenPreview }: CourseMenuProps) {
  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-surface-hover/50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <span
            className="font-medium text-text-primary cursor-pointer hover:text-brand-text transition-colors"
            onClick={onOpenPreview}
          >
            {course.name}
          </span>
          <span className="ml-2 text-xs text-text-tertiary">
            by {course.creator}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge variant={statusBadgeVariant(course.status)}>
          {course.status}
        </Badge>
      </td>
      <td className="px-4 py-4 text-center text-text-secondary">
        {course.doneLessons}
      </td>
      <td className="px-4 py-4 text-center text-text-secondary">
        {course.totalLessons}
      </td>
      <td className="px-4 py-4 text-text-tertiary text-sm">
        {formatDate(course.createdAt)}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="sm" uppercase={false}>
            View Saved
          </Button>
          <Button variant="primary" size="sm">
            Review
          </Button>
          <CourseMenu
            course={course}
            onShare={onShare}
            onDelete={onDelete}
            onEditName={onEditName}
          />
        </div>
      </td>
    </tr>
  )
}

/* ─── Page ─── */

interface CoursesPageProps {
  onOpenPreview?: () => void
}

export function CoursesPage({ onOpenPreview }: CoursesPageProps) {
  const [courses, setCourses] = useState<Course[]>(mockCourses)

  async function handleShare(course: Course) {
    const shareData = generateShareLink(course, "Aidana")
    const result = await shareCourse(shareData)

    if (result === "copied") {
      showToast("Link copied to clipboard", "success")
    } else {
      showToast("Course shared!", "success")
    }

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id ? { ...c, isShared: true, shareCount: c.shareCount + 1 } : c
      )
    )
  }

  function handleDelete(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id))
    showToast("Course deleted", "info")
  }

  function handleEditName(id: string) {
    const course = courses.find((c) => c.id === id)
    if (!course) return
    const newName = prompt("Edit course name:", course.name)
    if (newName && newName !== course.name) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
      )
    }
  }

  const menuProps = { onShare: handleShare, onDelete: handleDelete, onEditName: handleEditName, onOpenPreview }

  return (
    <div className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div>
          <h1 className="text-lg font-semibold text-text-primary md:hidden">Course</h1>
          <p className="text-text-secondary text-sm">
            View and manage your learning courses
          </p>
        </div>
      </div>

      {/* ─── Mobile: Card list ─── */}
      <div className="flex flex-col gap-3 md:hidden">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} {...menuProps} />
        ))}
      </div>

      {/* ─── Desktop: Table ─── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th className="px-6 py-3 text-sm font-semibold text-text-primary">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                Done Lessons
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                Total Lessons
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">
                Created
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <CourseRow key={course.id} course={course} {...menuProps} />
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <div className="py-12 text-center text-text-tertiary">
          No courses yet. Create one to get started.
        </div>
      )}
    </div>
  )
}
