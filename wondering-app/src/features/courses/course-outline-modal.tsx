import { useEffect } from "react"
import { X, Clock, Lock, CheckCircle } from "lucide-react"
import type { Course, LearningPath, LearningLesson } from "./types"
import { mockLearningPaths, generateLearningPath } from "./mock-data"

/* ─── Lesson status icon ─── */

function LessonIcon({ lesson }: { lesson: LearningLesson }) {
  if (lesson.status === "active") {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-text-primary ring-2 ring-brand ring-offset-2 ring-offset-surface">
        <CheckCircle className="size-5 text-text-inverse" />
      </div>
    )
  }

  if (lesson.status === "locked" || lesson.isReview) {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
        <Lock className="size-4 text-text-tertiary" />
      </div>
    )
  }

  // pending
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
      <Clock className="size-4 text-text-tertiary" />
    </div>
  )
}

/* ─── Modal ─── */

interface CourseOutlineModalProps {
  course: Course
  onClose: () => void
}

export function CourseOutlineModal({ course, onClose }: CourseOutlineModalProps) {
  const path: LearningPath = mockLearningPaths[course.id] ?? generateLearningPath(course)

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 mt-4 flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl animate-hero-reveal md:mt-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-text-primary truncate pr-4">
            {path.courseName}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {path.sections.map((section, si) => (
            <div key={section.id} className={si > 0 ? "mt-8" : ""}>
              {/* Section header */}
              <div className="rounded-xl border border-border bg-surface-secondary px-5 py-3.5">
                <h3 className="text-base font-bold text-text-primary">
                  {si + 1}. {section.title}
                </h3>
                <p className="mt-0.5 text-sm text-text-tertiary">
                  {section.doneLessons}/{section.totalLessons} lessons
                </p>
              </div>

              {/* Lessons timeline */}
              <div className="mt-6 flex flex-col items-center gap-5">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-4">
                    <LessonIcon lesson={lesson} />
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        {lesson.title}
                      </span>
                      {lesson.isReview && lesson.reviewProgress && (
                        <p className="text-xs text-text-tertiary">
                          {lesson.reviewProgress}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
