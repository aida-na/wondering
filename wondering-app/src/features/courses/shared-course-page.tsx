import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/ui/toast"
import { BookOpen, User, Layers } from "lucide-react"
import { mockCourses } from "./mock-data"
import { acceptSharedCourse, checkCourseExists } from "./share-utils"
import type { Course } from "./types"

/**
 * Shared Course Landing Page
 *
 * Shown when a user opens a share link like /course/shared/:id
 * Handles three scenarios:
 * 1. Existing user, course not in library → add course
 * 2. Existing user, course already in library → show "already exists"
 * 3. New user → redirect to registration (simulated)
 */

// Simulated: in production these come from route params + API
const DEMO_SHARED_COURSE = {
  id: "shared-demo",
  name: "Bio-Optimized Nutrition for Peak Energy",
  creator: "Shane Parrish",
  totalLessons: 20,
  description:
    "Master the science of nutrition timing, micronutrient optimization, and energy management. 20 bite-sized lessons based on cutting-edge research.",
}

interface SharedCoursePageProps {
  isLoggedIn?: boolean
  userCourses?: Course[]
  onCourseAdded?: (course: Course) => void
  onNavigateToLibrary?: () => void
}

export function SharedCoursePage({
  isLoggedIn = true,
  userCourses = mockCourses,
  onCourseAdded,
  onNavigateToLibrary,
}: SharedCoursePageProps) {
  const [status, setStatus] = useState<
    "loading" | "preview" | "added" | "exists" | "signup"
  >("loading")

  useEffect(() => {
    // Simulate checking auth + course existence
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        setStatus("signup")
      } else if (checkCourseExists(DEMO_SHARED_COURSE.id, userCourses)) {
        setStatus("exists")
      } else {
        setStatus("preview")
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [isLoggedIn, userCourses])

  function handleAddCourse() {
    const newCourse = acceptSharedCourse(
      DEMO_SHARED_COURSE.name,
      DEMO_SHARED_COURSE.creator,
      DEMO_SHARED_COURSE.totalLessons
    )
    onCourseAdded?.(newCourse)
    setStatus("added")
    showToast("Course was added", "success")
  }

  if (status === "loading") {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="text-sm text-text-tertiary">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md animate-hero-reveal">
        {/* Course preview card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          {/* Header gradient */}
          <div className="bg-brand-bg px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-brand/20">
              <BookOpen className="size-8 text-brand-text" />
            </div>
            <h1 className="text-xl font-semibold text-text-primary">
              {DEMO_SHARED_COURSE.name}
            </h1>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-secondary">
              <User className="size-3.5" />
              {DEMO_SHARED_COURSE.creator}
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5">
            <p className="text-sm leading-relaxed text-text-secondary">
              {DEMO_SHARED_COURSE.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-text-tertiary">
              <Layers className="size-4" />
              {DEMO_SHARED_COURSE.totalLessons} lessons
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border px-6 py-4">
            {status === "preview" && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddCourse}
              >
                Add to My Courses
              </Button>
            )}

            {status === "added" && (
              <div className="space-y-3">
                <div className="rounded-xl bg-success-bg px-4 py-3 text-center text-sm font-medium text-success-text">
                  Course was added to your library
                </div>
                <Button
                  variant="tertiary"
                  size="lg"
                  fullWidth
                  onClick={onNavigateToLibrary}
                >
                  Go to My Courses
                </Button>
              </div>
            )}

            {status === "exists" && (
              <div className="space-y-3">
                <div className="rounded-xl bg-info-bg px-4 py-3 text-center text-sm font-medium text-text-primary">
                  This course already exists in your library
                </div>
                <Button
                  variant="tertiary"
                  size="lg"
                  fullWidth
                  onClick={onNavigateToLibrary}
                >
                  Go to My Courses
                </Button>
              </div>
            )}

            {status === "signup" && (
              <div className="space-y-3">
                <Button variant="primary" size="lg" fullWidth>
                  Sign Up to Start Learning
                </Button>
                <p className="text-center text-xs text-text-tertiary">
                  Create a free account and this course will be waiting for you.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Branding footer */}
        <p className="mt-6 text-center text-xs text-text-tertiary">
          <span className="logo-font text-sm text-text-secondary">wondering</span>
          {" "}— Learn What You Thought You Couldn't
        </p>
      </div>
    </div>
  )
}
