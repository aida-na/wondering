import { useState, useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getGenerationStatus, getGeneratedCourse } from "./create-service"
import type { GeneratedCourse, GenerationStatus } from "./types"

interface GenerationProgressProps {
  courseId: string
  onComplete: (course: GeneratedCourse) => void
  onError: () => void
}

const STAGE_LABELS = [
  "Analyzing your goals",
  "Designing course structure",
  "Creating lessons",
  "Finalizing your course",
]

export function GenerationProgress({
  courseId,
  onComplete,
  onError,
}: GenerationProgressProps) {
  const [status, setStatus] = useState<GenerationStatus>({
    status: "generating",
    progressPercentage: 0,
    currentStep: "Analyzing your goals...",
  })
  const [failed, setFailed] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const s = await getGenerationStatus(courseId)
      setStatus(s)

      if (s.status === "completed") {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const course = await getGeneratedCourse(courseId)
        if (course) {
          // Small delay so user sees 100%
          setTimeout(() => onComplete(course), 400)
        } else {
          setFailed(true)
        }
      } else if (s.status === "failed") {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setFailed(true)
      }
    }, 400)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  // Determine which stage label to highlight
  const stageIndex =
    status.progressPercentage < 20
      ? 0
      : status.progressPercentage < 45
        ? 1
        : status.progressPercentage < 85
          ? 2
          : 3

  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-text-secondary">
          Something went wrong during generation.
        </p>
        <Button variant="secondary" size="md" onClick={onError}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Animated icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-bg animate-hero-reveal">
          <Sparkles className="size-8 text-brand animate-pulse-scale" />
        </div>

        {/* Current step */}
        <p className="text-lg font-semibold text-text-primary young-serif-font">
          {status.currentStep}
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${status.progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            {status.progressPercentage}%
          </p>
        </div>

        {/* Stage indicators */}
        <div className="space-y-2">
          {STAGE_LABELS.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs transition-colors duration-300"
            >
              <div
                className={
                  i < stageIndex
                    ? "size-1.5 rounded-full bg-success"
                    : i === stageIndex
                      ? "size-1.5 rounded-full bg-brand"
                      : "size-1.5 rounded-full bg-border"
                }
              />
              <span
                className={
                  i <= stageIndex
                    ? "text-text-primary"
                    : "text-text-tertiary"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-tertiary">
          This usually takes 30–60 seconds
        </p>
      </div>
    </div>
  )
}
