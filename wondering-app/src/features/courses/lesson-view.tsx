import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GeneratedCard } from "@/features/create/types"

interface LessonViewProps {
  lessonTitle: string
  cards: GeneratedCard[]
  onBack: () => void
}

export function LessonView({ lessonTitle, cards, onBack }: LessonViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = cards[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === cards.length - 1

  const goNext = () => {
    if (isLast) return
    setFlipped(false)
    setCurrentIndex((i) => i + 1)
  }

  const goPrev = () => {
    if (isFirst) return
    setFlipped(false)
    setCurrentIndex((i) => i - 1)
  }

  if (!card) return null

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-text-primary truncate">
            {lessonTitle}
          </h2>
        </div>
        <span className="shrink-0 text-xs text-text-tertiary">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 px-5 pt-4">
        {cards.map((_, i) => (
          <div
            key={i}
            className={
              i === currentIndex
                ? "h-1.5 w-6 rounded-full bg-brand transition-all"
                : i < currentIndex
                  ? "size-1.5 rounded-full bg-success transition-all"
                  : "size-1.5 rounded-full bg-border transition-all"
            }
          />
        ))}
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-5 py-6">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full max-w-sm text-left"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "16rem",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Badge variant="brand" className="self-start text-[10px]">
                {card.type}
              </Badge>
              <p className="text-base font-medium leading-relaxed text-text-primary">
                {card.question}
              </p>
              <p className="text-center text-xs text-text-tertiary">
                tap to reveal
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col gap-4 overflow-auto rounded-2xl border border-brand bg-brand-bg p-6"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-sm font-medium leading-relaxed text-text-primary">
                {card.answer}
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                {card.explanation}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {card.keyTerms.map((term) => (
                  <span
                    key={term}
                    className="rounded-lg bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-border"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <Button
          variant="outline"
          size="md"
          uppercase={false}
          disabled={isFirst}
          onClick={goPrev}
          leadingIcon={<ChevronLeft className="size-4" />}
        >
          Previous
        </Button>
        {isLast ? (
          <Button variant="primary" size="md" onClick={onBack}>
            Done
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={goNext}
            trailingIcon={<ChevronRight className="size-4" />}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
