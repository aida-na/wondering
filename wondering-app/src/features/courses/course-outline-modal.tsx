import { useState, useEffect } from "react"
import { X, Clock, Lock, CheckCircle, ChevronRight } from "lucide-react"
import type { Course, LearningPath, LearningLesson } from "./types"
import { mockLearningPaths, generateLearningPath } from "./mock-data"
import { getCourseContent } from "@/features/create/create-service"
import { LessonView } from "./lesson-view"
import type { GeneratedCard } from "@/features/create/types"

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

/* ─── Helpers ─── */

/** Find the cards for a lesson from the generated course content. */
function findLessonCards(
  courseId: string,
  lessonId: string
): GeneratedCard[] | null {
  const content = getCourseContent(courseId)
  if (!content) return null
  for (const level of content.structure.levels) {
    for (const lesson of level.lessons) {
      if (lesson.lessonId === lessonId && lesson.cards && lesson.cards.length > 0) {
        return lesson.cards
      }
    }
  }
  return null
}

/* ─── Modal ─── */

interface CourseOutlineModalProps {
  course: Course
  onClose: () => void
}

export function CourseOutlineModal({ course, onClose }: CourseOutlineModalProps) {
  const path: LearningPath =
    mockLearningPaths[course.id] ?? generateLearningPath(course)

  const [activeLesson, setActiveLesson] = useState<{
    title: string
    cards: GeneratedCard[]
  } | null>(null)

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeLesson) setActiveLesson(null)
        else onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, activeLesson])

  const handleLessonClick = (lesson: LearningLesson) => {
    if (lesson.isReview) return
    const cards = findLessonCards(course.id, lesson.id)
    if (!cards) return
    setActiveLesson({ title: lesson.title, cards })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 mt-4 flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl animate-hero-reveal md:mt-12">
        {activeLesson ? (
          <LessonView
            lessonTitle={activeLesson.title}
            cards={activeLesson.cards}
            onBack={() => setActiveLesson(null)}
          />
        ) : (
          <>
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
                    {section.lessons.map((lesson) => {
                      const cards = lesson.isReview
                        ? null
                        : findLessonCards(course.id, lesson.id)
                      const clickable = !!cards

                      return (
                        <button
                          key={lesson.id}
                          disabled={!clickable}
                          onClick={() => clickable && handleLessonClick(lesson)}
                          className={
                            clickable
                              ? "flex w-full max-w-xs items-center gap-4 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-surface-hover"
                              : "flex w-full max-w-xs items-center gap-4 px-2 py-1.5 text-left cursor-default"
                          }
                        >
                          <LessonIcon lesson={lesson} />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-text-primary">
                              {lesson.title}
                            </span>
                            {lesson.isReview && lesson.reviewProgress && (
                              <p className="text-xs text-text-tertiary">
                                {lesson.reviewProgress}
                              </p>
                            )}
                          </div>
                          {clickable && (
                            <ChevronRight className="size-4 text-text-tertiary shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
