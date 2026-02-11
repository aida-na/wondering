import { useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Check,
  Lock,
  RefreshCw,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GeneratedCourse, GeneratedLevel } from "./types"

interface CoursePreviewProps {
  course: GeneratedCourse
  onStartLearning: () => void
  onRegenerate: () => void
  onEditParams: () => void
  onBack: () => void
}

export function CoursePreview({
  course,
  onStartLearning,
  onRegenerate,
  onEditParams,
  onBack,
}: CoursePreviewProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(
    new Set([0])
  )
  const [flipped, setFlipped] = useState(false)

  const totalLessons = course.structure.levels.reduce(
    (sum, l) => sum + l.lessons.length,
    0
  )

  const sampleCard = course.structure.levels[0]?.lessons[0]?.cards?.[0]

  const toggleLevel = (idx: number) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      {/* Top bar */}
      <div className="shrink-0 flex items-center border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-6 md:px-6 space-y-8">
        {/* Success header */}
        <div className="animate-hero-reveal text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-success/15">
            <Check className="size-6 text-success" />
          </div>
          <h1 className="text-xl font-bold text-text-primary young-serif-font md:text-2xl">
            Your course is ready!
          </h1>
        </div>

        {/* Course info */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary">
            {course.title}
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {course.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Layers className="size-4" />}
            value={course.structure.levels.length}
            label="Levels"
          />
          <StatCard
            icon={<BookOpen className="size-4" />}
            value={totalLessons}
            label="Lessons"
          />
          <StatCard
            icon={<Clock className="size-4" />}
            value={course.estimatedHours}
            label="Hours"
          />
        </div>

        {/* Course outline */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Course Outline
          </h3>
          <div className="space-y-2">
            {course.structure.levels.map((level, idx) => (
              <LevelAccordion
                key={level.levelNumber}
                level={level}
                expanded={expandedLevels.has(idx)}
                onToggle={() => toggleLevel(idx)}
              />
            ))}
          </div>
        </section>

        {/* Sample flashcard */}
        {sampleCard && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Sample Flashcard
            </h3>
            <p className="text-xs text-text-tertiary">
              Tap to flip — this is what your lessons will look like
            </p>
            <button
              onClick={() => setFlipped((f) => !f)}
              className="w-full text-left"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative h-48 w-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-xl border border-border bg-surface p-5 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Badge variant="brand" className="self-start text-[10px]">
                    {sampleCard.type}
                  </Badge>
                  <p className="text-sm font-medium text-text-primary leading-relaxed">
                    {sampleCard.question}
                  </p>
                  <p className="text-xs text-text-tertiary text-center">
                    tap to reveal answer
                  </p>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl border border-brand bg-brand-bg p-5 flex flex-col gap-3 overflow-auto"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-sm font-medium text-text-primary leading-relaxed">
                    {sampleCard.answer}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {sampleCard.explanation}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {sampleCard.keyTerms.map((term) => (
                      <span
                        key={term}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-8">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onStartLearning}
          >
            Start Learning
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              uppercase={false}
              onClick={onRegenerate}
              leadingIcon={<RefreshCw className="size-3.5" />}
            >
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              uppercase={false}
              onClick={onEditParams}
              leadingIcon={<Pencil className="size-3.5" />}
            >
              Edit Parameters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Sub-components ─── */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-3 text-center space-y-1">
      <div className="flex items-center justify-center text-brand">{icon}</div>
      <p className="text-lg font-bold text-text-primary">{value}</p>
      <p className="text-[11px] text-text-tertiary">{label}</p>
    </div>
  )
}

function LevelAccordion({
  level,
  expanded,
  onToggle,
}: {
  level: GeneratedLevel
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left hover:bg-surface-hover transition-colors"
      >
        {expanded ? (
          <ChevronDown className="size-4 text-text-tertiary shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-text-tertiary shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            Level {level.levelNumber}: {level.title}
          </p>
          <p className="text-xs text-text-tertiary truncate">
            {level.lessons.length} lessons
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-surface-secondary/50 px-3 py-2 space-y-1">
          {level.lessons.map((lesson) => (
            <div
              key={lesson.lessonId}
              className="flex items-center gap-2 py-1.5 px-1"
            >
              {lesson.status === "generated" ? (
                <Check className="size-3.5 text-success shrink-0" />
              ) : (
                <Lock className="size-3.5 text-text-tertiary shrink-0" />
              )}
              <span className="text-xs text-text-secondary truncate">
                {lesson.lessonNumber} — {lesson.title}
              </span>
              <span className="ml-auto text-[10px] text-text-tertiary shrink-0">
                {lesson.estimatedMinutes}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
