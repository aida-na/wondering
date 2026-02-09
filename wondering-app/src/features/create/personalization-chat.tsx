import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Course } from "@/features/courses/types"
import { startCourseCreation, submitPersonalization } from "./create-service"
import type {
  CreationMethod,
  PersonalizationQuestion,
  PersonalizationAnswer,
  CreateCourseParams,
} from "./types"

interface ChatBubble {
  id: string
  role: "system" | "user"
  content: string
  options?: string[]
}

interface PersonalizationChatProps {
  topic: string
  method: CreationMethod
  onBack: () => void
  onComplete: (course: Course) => void
  onSkip: (course: Course) => void
  sourceUrl?: string
  sourceFile?: string
  catalogCourseId?: string
  /** When adding from catalog, the original course author to preserve */
  creator?: string
}

export function PersonalizationChat({
  topic,
  method,
  onBack,
  onComplete,
  onSkip,
  sourceUrl,
  sourceFile,
  catalogCourseId,
  creator,
}: PersonalizationChatProps) {
  const [bubbles, setBubbles] = useState<ChatBubble[]>([])
  const [questions, setQuestions] = useState<PersonalizationQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<PersonalizationAnswer[]>([])
  const [customInput, setCustomInput] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const params: CreateCourseParams = {
    method,
    topic,
    sourceUrl,
    sourceFile,
    catalogCourseId,
    creator,
  }

  // Scroll to bottom when bubbles change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [bubbles, isCreating])

  // Load questions on mount
  useEffect(() => {
    const intro: ChatBubble[] = [
      {
        id: "intro",
        role: "system",
        content:
          "Let's personalize your course! I'll ask a few quick questions to tailor the content to you.",
      },
      {
        id: "topic-echo",
        role: "system",
        content: `Great choice — "${topic}". Let me set things up...`,
      },
    ]
    setBubbles(intro)

    startCourseCreation(params).then((qs) => {
      setQuestions(qs)
      setIsLoading(false)
      setBubbles((prev) => [
        ...prev,
        {
          id: qs[0].id,
          role: "system",
          content: qs[0].text,
          options: qs[0].options,
        },
      ])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnswer = async (answer: string) => {
    const question = questions[currentQuestionIndex]
    const newAnswers = [...answers, { questionId: question.id, answer }]
    setAnswers(newAnswers)

    // Add user bubble
    setBubbles((prev) => [
      ...prev,
      { id: `answer-${question.id}`, role: "user", content: answer },
    ])
    setCustomInput("")

    const nextIndex = currentQuestionIndex + 1

    if (nextIndex < questions.length) {
      // Show next question after a short delay
      setCurrentQuestionIndex(nextIndex)
      setTimeout(() => {
        const next = questions[nextIndex]
        setBubbles((prev) => [
          ...prev,
          {
            id: next.id,
            role: "system",
            content: next.text,
            options: next.options,
          },
        ])
      }, 400)
    } else {
      // All questions answered — finalize
      await finalize(newAnswers)
    }
  }

  const finalize = async (finalAnswers: PersonalizationAnswer[]) => {
    setIsCreating(true)
    setBubbles((prev) => [
      ...prev,
      {
        id: "creating",
        role: "system",
        content: "Creating your personalized course...",
      },
    ])
    const course = await submitPersonalization(params, finalAnswers)
    onComplete(course)
  }

  const handleSkip = async () => {
    setIsCreating(true)
    setBubbles((prev) => [
      ...prev,
      {
        id: "skip",
        role: "system",
        content: "No problem! Creating your course with default settings...",
      },
    ])
    const course = await submitPersonalization(params, [])
    onSkip(course)
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customInput.trim() && !isCreating && !isLoading) {
      handleAnswer(customInput.trim())
    }
  }

  const showOptions =
    !isCreating &&
    !isLoading &&
    currentQuestionIndex < questions.length &&
    answers.length === currentQuestionIndex

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        {!isCreating && (
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-text-tertiary hover:text-text-primary transition-colors"
          >
            Skip Personalization
          </button>
        )}
      </div>

      {/* Chat area — extra pb on mobile so content isn't hidden behind fixed form */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-auto p-4 pb-32 space-y-3 md:pb-4"
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={cn(
              "flex",
              bubble.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                bubble.role === "user"
                  ? "bg-brand text-text-primary rounded-br-md"
                  : "bg-surface-secondary text-text-primary rounded-bl-md border border-border"
              )}
            >
              {bubble.content}
            </div>
          </div>
        ))}

        {/* Multiple-choice chips */}
        {showOptions && questions[currentQuestionIndex] && (
          <div className="flex flex-wrap gap-2 pl-1 pt-1">
            {questions[currentQuestionIndex].options.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                uppercase={false}
                onClick={() => handleAnswer(option)}
                className="rounded-full"
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {/* Creating indicator */}
        {isCreating && (
          <div className="flex items-center gap-2 pl-1 pt-2 text-sm text-text-tertiary">
            <Sparkles className="size-4 animate-pulse-scale text-brand" />
            <span>Building your course...</span>
          </div>
        )}

        {isLoading && !isCreating && (
          <div className="flex items-center gap-2 pl-1 pt-2 text-sm text-text-tertiary">
            <Loader2 className="size-4 animate-spin" />
            <span>Setting up...</span>
          </div>
        )}
      </div>

      {/* Bottom input — fixed on mobile so it stays above nav and demo button; static on desktop */}
      {!isCreating && !isLoading && (
        <form
          onSubmit={handleCustomSubmit}
          className="shrink-0 border-t border-border bg-surface p-4 safe-area-bottom fixed bottom-24 left-0 right-0 z-30 md:static md:bottom-auto md:left-auto md:right-auto"
        >
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type your own answer..."
              className="flex-1 rounded-xl border border-border bg-surface py-2.5 px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              size="icon"
              disabled={!customInput.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
