import { useState, useEffect, useRef } from "react"
import { MessageSquare, Upload, BookOpen, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockCatalogCourses } from "@/features/courses/mock-data"
import type { CatalogCourse } from "@/features/courses/types"
import { PersonalizationChat } from "./personalization-chat"
import { ChatExploreView } from "./chat-explore-view"
import { UploadSourceView } from "./upload-source-view"
import type { ChatMessage, CreateFlowStep, CreationMethod } from "./types"

interface CreatePageProps {
  onBrowseCatalog: () => void
  onComplete: () => void
  catalogCourse?: CatalogCourse | null
}

// Get top 6 trending courses by recommendedScore
const trendingCourses = [...mockCatalogCourses]
  .filter((c) => c.recommendedScore != null)
  .sort((a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0))
  .slice(0, 6)

const CARD_COLORS = [
  "bg-[hsl(202,35%,89%)]",
  "bg-[hsl(43,40%,88%)]",
  "bg-[hsl(154,30%,88%)]",
  "bg-[hsl(28,35%,87%)]",
  "bg-[hsl(340,25%,90%)]",
  "bg-[hsl(260,25%,90%)]",
]

export function CreatePage({
  onBrowseCatalog,
  onComplete,
  catalogCourse,
}: CreatePageProps) {
  const [step, setStep] = useState<CreateFlowStep>("landing")
  const [topic, setTopic] = useState("")
  const [method, setMethod] = useState<CreationMethod>("quick")
  const [sourceUrl, setSourceUrl] = useState<string | undefined>()
  const [sourceFile, setSourceFile] = useState<string | undefined>()
  const [catalogCourseId, setCatalogCourseId] = useState<string | undefined>()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-transition when returning from catalog with a selected course
  useEffect(() => {
    if (catalogCourse) {
      setTopic(catalogCourse.name)
      setMethod("catalog")
      setCatalogCourseId(catalogCourse.id)
      setStep("personalizing")
    }
  }, [catalogCourse])

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    setMethod("quick")
    setStep("personalizing")
  }

  const handleTrendingClick = (course: CatalogCourse) => {
    setTopic(course.name)
    setMethod("catalog")
    setCatalogCourseId(course.id)
    setStep("personalizing")
  }

  const handleChatCreate = (history: ChatMessage[]) => {
    setMethod("chat")
    const firstUserMsg = history.find((m) => m.role === "user")
    setTopic(firstUserMsg?.content ?? "Explored topic")
    setStep("personalizing")
  }

  const handleUploadSubmit = (source: {
    url?: string
    fileName?: string
  }) => {
    setSourceUrl(source.url)
    setSourceFile(source.fileName)
    setMethod("upload")
    setTopic(source.fileName ?? source.url ?? "From source")
    setStep("personalizing")
  }

  // Sub-views
  if (step === "chat-explore") {
    return (
      <ChatExploreView
        onBack={() => setStep("landing")}
        onCreateCourse={handleChatCreate}
      />
    )
  }

  if (step === "upload-source") {
    return (
      <UploadSourceView
        onBack={() => setStep("landing")}
        onSubmit={handleUploadSubmit}
      />
    )
  }

  if (step === "personalizing" || step === "creating") {
    return (
      <PersonalizationChat
        topic={topic}
        method={method}
        sourceUrl={sourceUrl}
        sourceFile={sourceFile}
        catalogCourseId={catalogCourseId}
        onBack={() => setStep("landing")}
        onComplete={onComplete}
        onSkip={onComplete}
      />
    )
  }

  // Landing view
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6">
        {/* Hero */}
        <div className="text-center animate-hero-reveal">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-bg">
            <Sparkles className="size-6 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary young-serif-font md:text-3xl">
            What do you want to learn?
          </h1>
          <p className="mt-2 text-sm text-text-secondary md:text-base">
            Tell me what you're curious about, and I'll create a personalized
            course for you
          </p>
        </div>

        {/* Topic input */}
        <form onSubmit={handleTopicSubmit} className="mt-8">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleTopicSubmit(e)
                }
              }}
              placeholder="e.g., I want to learn about cognitive biases in decision making..."
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-surface py-3 pl-4 pr-12 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              size="icon-sm"
              disabled={!topic.trim()}
              className="absolute bottom-2.5 right-2.5"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-text-tertiary whitespace-nowrap">
            or create another way
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Method cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <MethodCard
            icon={<MessageSquare className="size-5" />}
            label="Explore First"
            description="Chat to discover what to learn"
            onClick={() => setStep("chat-explore")}
            delay={0}
          />
          <MethodCard
            icon={<Upload className="size-5" />}
            label="From a Source"
            description="Upload a doc or paste a URL"
            onClick={() => setStep("upload-source")}
            delay={1}
          />
          <MethodCard
            icon={<BookOpen className="size-5" />}
            label="Browse Library"
            description="Pick from our course catalog"
            onClick={onBrowseCatalog}
            delay={2}
          />
        </div>

        {/* Trending carousel */}
        {trendingCourses.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-tertiary whitespace-nowrap">
                Trending on Wondering
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:-mx-6 md:px-6">
              {trendingCourses.map((course, i) => (
                <button
                  key={course.id}
                  onClick={() => handleTrendingClick(course)}
                  className="group w-36 shrink-0 text-left transition-transform active:scale-[0.97]"
                >
                  <div
                    className={cn(
                      "aspect-[4/3] w-full rounded-xl border border-border flex items-center justify-center",
                      CARD_COLORS[i % CARD_COLORS.length]
                    )}
                  >
                    <BookOpen className="size-6 text-text-tertiary/40" />
                  </div>
                  <h3 className="mt-2 text-xs font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-brand-text transition-colors">
                    {course.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-text-tertiary truncate">
                    {course.creator}
                  </p>
                  {course.popular && (
                    <Badge
                      variant="brand"
                      className="mt-1 rounded-md px-1.5 py-0 text-[10px]"
                    >
                      Trending
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Method Card ─── */

function MethodCard({
  icon,
  label,
  description,
  onClick,
  delay,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  delay: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center transition-all hover:border-brand-border hover:bg-brand-bg hover-lift",
        "animate-on-load animate-cascade-drop-in",
        `cascade-delay-${delay}`
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-surface-secondary text-text-secondary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-text-tertiary">
          {description}
        </p>
      </div>
    </button>
  )
}
