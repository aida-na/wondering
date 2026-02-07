import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { mockCourseOutline } from "./mock-data"
import type { CourseOutline, Section } from "./types"

function SectionAccordion({
  section,
  index,
  defaultOpen = false,
}: {
  section: Section
  index: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl bg-surface-secondary px-5 py-4 text-left transition-colors hover:bg-surface-tertiary"
      >
        <div>
          <h3 className="text-base font-bold text-text-primary">
            {index + 1}. {section.title}
          </h3>
          <p className="mt-0.5 text-sm text-text-tertiary">
            {section.lessons.length} {section.lessons.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>
        {open ? (
          <ChevronUp className="size-5 shrink-0 text-text-tertiary" />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-text-tertiary" />
        )}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {section.lessons.map((lesson, lessonIdx) => (
            <div
              key={lesson.id}
              className="rounded-xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary"
            >
              {index + 1}.{lessonIdx + 1}. {lesson.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface CoursePreviewPageProps {
  outline?: CourseOutline
  onBack?: () => void
}

export function CoursePreviewPage({
  outline = mockCourseOutline,
  onBack,
}: CoursePreviewPageProps) {
  const totalLessons = outline.sections.reduce(
    (sum, s) => sum + s.lessons.length,
    0
  )
  const estimatedDays = Math.ceil(
    outline.estimatedMinutes / outline.dailyGoalMinutes
  )

  const stats = [
    `${outline.sections.length} ${outline.sections.length === 1 ? "section" : "sections"}`,
    `${totalLessons} ${totalLessons === 1 ? "lesson" : "lessons"}`,
    `~${outline.estimatedMinutes} min total`,
    `~${estimatedDays} ${estimatedDays === 1 ? "day" : "days"} at ${outline.dailyGoalMinutes} min daily goal`,
  ]

  return (
    <div className="flex-1 overflow-auto p-4 pb-24 md:p-6 md:pb-6">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-sm text-text-tertiary hover:text-text-primary transition-colors"
          >
            &larr; Back to courses
          </button>
        )}

        {/* Title & description */}
        <h1 className="text-xl font-semibold text-text-primary md:text-2xl">
          {outline.name}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-text-secondary">
          {outline.description}
        </p>

        {/* Stats badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.map((stat) => (
            <span
              key={stat}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
            >
              {stat}
            </span>
          ))}
        </div>

        {/* Section outline */}
        <div className="mt-8 flex flex-col gap-4">
          {outline.sections.map((section, idx) => (
            <SectionAccordion
              key={section.id}
              section={section}
              index={idx}
              defaultOpen
            />
          ))}
        </div>
      </div>
    </div>
  )
}
