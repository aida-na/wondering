import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getMockChatResponse } from "./create-service"
import type { ChatMessage } from "./types"

interface ChatExploreViewProps {
  onBack: () => void
  onCreateCourse: (chatHistory: ChatMessage[]) => void
}

export function ChatExploreView({
  onBack,
  onCreateCourse,
}: ChatExploreViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm here to help you explore what you'd like to learn. Tell me what you're curious about, and I'll help you discover interesting angles and shape it into a course.",
      },
    ])
  }, [])

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    const reply = await getMockChatResponse(text)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: reply,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const hasUserMessages = messages.some((m) => m.role === "user")

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
        <span className="text-sm font-medium text-text-secondary">
          Explore a Topic
        </span>
        <div className="w-12" />
      </div>

      {/* Messages — extra pb on mobile so content isn't hidden behind fixed input */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto p-4 pb-32 space-y-3 md:pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-brand text-text-primary rounded-br-md"
                  : "bg-surface-secondary text-text-primary rounded-bl-md border border-border"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-tertiary">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA + Input wrapper: extra bottom space on mobile so fixed form doesn't cover CTA */}
      <div className="shrink-0 pb-24 md:pb-0">
        {hasUserMessages && (
          <div className="border-t border-border bg-surface px-4 py-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => onCreateCourse(messages)}
              leadingIcon={<Sparkles className="size-4" />}
            >
              Create Course from This Conversation
            </Button>
          </div>
        )}

        {/* Input — fixed on mobile so it stays above nav; static on desktop */}
        <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-border bg-surface p-4 safe-area-bottom fixed bottom-24 left-0 right-0 z-30 md:static md:bottom-auto md:left-auto md:right-auto"
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you curious about?"
            className="flex-1 rounded-xl border border-border bg-surface py-2.5 px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="icon"
            disabled={!input.trim() || isTyping}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </form>
      </div>
    </div>
  )
}
