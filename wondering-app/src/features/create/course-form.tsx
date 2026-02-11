import { useState, useMemo } from "react"
import { ArrowLeft, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type {
  CourseGenerationParams,
  ExperienceLevel,
  Frequency,
  SessionDuration,
  TimelineWeeks,
} from "./types"

interface CourseFormProps {
  topic: string
  initialParams?: CourseGenerationParams | null
  onBack: () => void
  onGenerate: (params: CourseGenerationParams) => void
}

const LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "I'm completely new to this",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "I know the basics",
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "I have solid foundation",
  },
]

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "3x_week", label: "3x / week" },
  { value: "weekly", label: "Weekly" },
]

const DURATIONS: { value: SessionDuration; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
]

const TIMELINES: { value: TimelineWeeks; label: string }[] = [
  { value: 1, label: "1 week" },
  { value: 2, label: "2 weeks" },
  { value: 4, label: "1 month" },
  { value: 12, label: "3 months" },
  { value: null, label: "Self-paced" },
]

export function CourseForm({
  topic,
  initialParams,
  onBack,
  onGenerate,
}: CourseFormProps) {
  const [goal, setGoal] = useState(initialParams?.goal ?? "")
  const [level, setLevel] = useState<ExperienceLevel>(
    initialParams?.level ?? "beginner"
  )
  const [frequency, setFrequency] = useState<Frequency>(
    initialParams?.frequency ?? "daily"
  )
  const [duration, setDuration] = useState<SessionDuration>(
    initialParams?.duration ?? 10
  )
  const [timeline, setTimeline] = useState<TimelineWeeks>(
    initialParams?.timeline ?? 4
  )

  const stats = useMemo(() => {
    const sessionsPerWeek = { daily: 7, "3x_week": 3, weekly: 1 }
    const weeks = timeline ?? 4
    const totalSessions = sessionsPerWeek[frequency] * weeks
    const totalMinutes = totalSessions * duration
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10
    return { totalSessions, totalHours, weeks }
  }, [frequency, duration, timeline])

  const canSubmit = goal.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onGenerate({ topic, goal, level, frequency, duration, timeline })
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

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-lg flex-1 px-4 py-6 md:px-6 space-y-8"
      >
        {/* Header */}
        <div className="animate-hero-reveal">
          <h1 className="text-xl font-bold text-text-primary young-serif-font md:text-2xl">
            Personalize your course
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            on <span className="font-medium text-text-primary">{topic}</span>
          </p>
        </div>

        {/* Goal */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">
            What do you want to achieve?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="I want to... (be specific about what you want to achieve)"
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-border bg-surface py-3 px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          />
          <p className="text-xs text-text-tertiary">
            The more specific, the better your course will be
          </p>
        </section>

        {/* Level */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            What's your experience level?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                  level === l.value
                    ? "border-brand bg-brand-bg shadow-sm"
                    : "border-border hover:border-brand-border"
                )}
              >
                <span className="text-sm font-semibold text-text-primary">
                  {l.label}
                </span>
                <span className="text-[11px] leading-snug text-text-tertiary">
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Frequency */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            How often will you study?
          </label>
          <div className="flex gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFrequency(f.value)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
                  frequency === f.value
                    ? "border-brand bg-brand text-text-primary"
                    : "border-border text-text-secondary hover:border-brand-border"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            Session length
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDuration(d.value)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
                  duration === d.value
                    ? "border-brand bg-brand text-text-primary"
                    : "border-border text-text-secondary hover:border-brand-border"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            Course timeline
          </label>
          <div className="flex gap-2 flex-wrap">
            {TIMELINES.map((t) => (
              <button
                key={String(t.value)}
                type="button"
                onClick={() => setTimeline(t.value)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                  timeline === t.value
                    ? "border-brand bg-brand text-text-primary"
                    : "border-border text-text-secondary hover:border-brand-border"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-surface-secondary p-4 space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Clock className="size-4 text-brand" />
            ~{stats.totalHours} hours of content
          </div>
          <p className="text-xs text-text-tertiary">
            {stats.totalSessions} lessons over{" "}
            {timeline === null ? "your own pace" : `${stats.weeks} weeks`}
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canSubmit}
          leadingIcon={<Zap className="size-4" />}
        >
          Generate My Course
        </Button>
      </form>
    </div>
  )
}
