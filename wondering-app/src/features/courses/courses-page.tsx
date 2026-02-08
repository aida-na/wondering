import { useState, useEffect } from "react"
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
import { MoreVertical, Pencil, Trash2, Share2, Users, Plus, Globe, Check } from "lucide-react"
import type { Course, CourseStatus } from "./types"
import { recommendedCourses } from "./mock-data"
import { generateShareLink, shareCourse } from "./share-utils"
import { registerPublishedCourse, unregisterPublishedCourse } from "./catalog-service"
import { CourseOutlineModal } from "./course-outline-modal"

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

/* ─── Kebab menu (shared between card and table row) ─── */

interface CourseMenuProps {
  course: Course
  onShare: (course: Course) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onDelete: (id: string) => void
  onEditName: (id: string) => void
  onOpenPreview?: () => void
  onOpenOutline?: (course: Course) => void
}

function CourseMenu({ course, onShare, onPublish, onUnpublish, onDelete, onEditName }: CourseMenuProps) {
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
        {!course.isPublished ? (
          <DropdownMenuItem onSelect={() => onPublish(course.id)}>
            <Globe className="size-4 text-text-tertiary" />
            Publish
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem disabled className="opacity-70 cursor-default">
              <Check className="size-4 text-text-tertiary" />
              Published ✓
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onUnpublish(course.id)}>
              <Globe className="size-4 text-text-tertiary" />
              Unpublish
            </DropdownMenuItem>
          </>
        )}
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

function CourseCard({ course, onShare, onPublish, onUnpublish, onDelete, onEditName, onOpenOutline }: CourseMenuProps) {
  return (
    <div
      className="w-56 shrink-0 snap-start rounded-xl border border-border bg-surface p-3 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onOpenOutline?.(course)}
    >
      {/* Name + kebab */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug text-text-primary line-clamp-2">
          {course.name}
        </h3>
        <div onClick={(e) => e.stopPropagation()}>
          <CourseMenu
            course={course}
            onShare={onShare}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onDelete={onDelete}
            onEditName={onEditName}
          />
        </div>
      </div>
      <span className="mt-0.5 block text-xs text-text-tertiary">by {course.creator}</span>

      {/* Status + lessons */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <Badge variant={statusBadgeVariant(course.status)}>
          {course.status}
        </Badge>
        {!course.isPublished && (
          <Badge variant="warning">Draft</Badge>
        )}
        <span className="text-xs text-text-secondary">
          {course.doneLessons}/{course.totalLessons}
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
        <Button variant="tertiary" size="sm" uppercase={false} fullWidth>
          Saved
        </Button>
        <Button variant="primary" size="sm" fullWidth>
          Review
        </Button>
      </div>
    </div>
  )
}

/* ─── Carousel row ─── */

function CourseCarousel({
  title,
  courses,
  menuProps,
  emptyMessage,
}: {
  title: string
  courses: Course[]
  menuProps: Omit<CourseMenuProps, "course">
  emptyMessage?: string
}) {
  if (courses.length === 0 && emptyMessage) {
    return (
      <div className="mb-6">
        <h2 className="mb-3 text-base font-bold text-text-primary">{title}</h2>
        <p className="text-sm text-text-tertiary">{emptyMessage}</p>
      </div>
    )
  }
  if (courses.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-base font-bold text-text-primary">{title}</h2>
      <div className="-mr-4 md:-mr-6">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} {...menuProps} />
          ))}
          <div className="min-w-3 shrink-0 md:min-w-6" />
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */

interface CoursesPageProps {
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
  onOpenPreview?: () => void
  newCourse?: Course | null
  onConsumedNewCourse?: () => void
}

export function CoursesPage({
  courses,
  setCourses,
  onOpenPreview,
  newCourse,
  onConsumedNewCourse,
}: CoursesPageProps) {
  const [outlineCourse, setOutlineCourse] = useState<Course | null>(null)

  useEffect(() => {
    if (!newCourse) return
    setCourses((prev) => [newCourse, ...prev])
    showToast("Course created!", "success")
    onConsumedNewCourse?.()
  }, [newCourse, onConsumedNewCourse, setCourses])

  async function handleShare(course: Course) {
    const shareData = generateShareLink(course)
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

  function handlePublish(id: string) {
    const course = courses.find((c) => c.id === id)
    if (!course || course.isPublished) return
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: true } : c))
    )
    registerPublishedCourse({
      id: course.id,
      name: course.name,
      creator: course.creator,
      category: "For You",
      isPublishedByUser: true,
    })
    showToast("Course published!", "success")
  }

  function handleUnpublish(id: string) {
    const course = courses.find((c) => c.id === id)
    if (!course || !course.isPublished) return
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: false } : c))
    )
    unregisterPublishedCourse(id)
    showToast("Course unpublished", "info")
  }

  const inProgress = courses.filter((c) => c.status === "In Progress")
  const notStarted = courses.filter((c) => c.status === "Not Started")
  const completed = courses.filter((c) => c.status === "Completed")

  const cardProps = {
    onShare: handleShare,
    onPublish: handlePublish,
    onUnpublish: handleUnpublish,
    onDelete: handleDelete,
    onEditName: handleEditName,
    onOpenPreview,
    onOpenOutline: (course: Course) => setOutlineCourse(course),
  }

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
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenPreview}
          leadingIcon={<Plus className="size-4" />}
        >
          Add a course
        </Button>
      </div>

      {/* ─── Carousels ─── */}
      <CourseCarousel
        title="In Progress"
        courses={inProgress}
        menuProps={cardProps}
        emptyMessage="No courses in progress yet."
      />
      <CourseCarousel
        title="Not Started"
        courses={notStarted}
        menuProps={cardProps}
      />
      <CourseCarousel
        title="Finished"
        courses={completed}
        menuProps={cardProps}
        emptyMessage="No completed courses yet."
      />
      <CourseCarousel
        title="Recommended"
        courses={recommendedCourses}
        menuProps={cardProps}
      />

      {/* Course outline modal */}
      {outlineCourse && (
        <CourseOutlineModal
          course={outlineCourse}
          onClose={() => setOutlineCourse(null)}
        />
      )}
    </div>
  )
}
