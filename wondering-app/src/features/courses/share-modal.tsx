import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import type { Course, ShareLinkData } from "./types"
import { generateShareLink, shareCourse } from "./share-utils"
import { courseImage } from "./courses-page"

interface ShareModalProps {
  course: Course
  onClose: () => void
  onShared: () => void
}

export function ShareModal({ course, onClose, onShared }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareData: ShareLinkData = generateShareLink(course)

  // Estimate reading time: ~2.5 min per lesson
  const estimatedMin = Math.round(course.totalLessons * 2.5)

  // Lock body scroll
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

  const shareMessage = `i made this course on Wondering, join me so we stay motivated:)`

  async function handleiMessage() {
    const text = `${shareMessage}\n\n${course.name}\n${shareData.shareUrl}`
    const smsUrl = `sms:&body=${encodeURIComponent(text)}`
    window.open(smsUrl, "_blank")
    onShared()
  }

  async function handleTwitter() {
    const text = `${shareMessage}\n\n${course.name}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.shareUrl)}`
    window.open(twitterUrl, "_blank")
    onShared()
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareData.shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleNativeShare() {
    const result = await shareCourse(shareData)
    if (result === "shared" || result === "copied") {
      onShared()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-xl animate-hero-reveal">
        {/* ─── Background image ─── */}
        <img
          src={courseImage(course.id)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay: transparent top → white bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-white/70 to-white" />

        {/* ─── Content (over image) ─── */}
        <div className="relative z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/80 hover:text-white backdrop-blur-sm bg-black/10 hover:bg-black/20 transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* ─── Course card preview ─── */}
          <div ref={cardRef} className="px-8 pt-28 pb-6">
            <div className="flex flex-col items-start">
              {/* Course title — biggest element */}
              <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-text-primary">
                {course.name}
              </h2>

              {/* Creator */}
              <p className="mt-2.5 text-sm text-text-secondary">
                by {course.creator}
              </p>

              {/* Course length */}
              <p className="mt-1 text-sm text-text-tertiary">
                {course.totalLessons} lessons &middot; {estimatedMin} min
              </p>

              {/* CTA arrow + branding */}
              <div className="mt-6 flex items-center gap-2">
                <span className="text-brand text-lg">&rarr;</span>
                <span className="text-xs tracking-wide text-text-tertiary logo-font">
                  wondering
                </span>
              </div>
            </div>
          </div>

          {/* ─── Share actions ─── */}
          <div className="px-8 pb-6 flex flex-col gap-2">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">
              Share via
            </p>

            {/* iMessage */}
            <button
              onClick={handleiMessage}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-text-primary bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors text-left"
            >
              <span className="text-base">💬</span>
              iMessage
            </button>

            {/* Twitter */}
            <button
              onClick={handleTwitter}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-text-primary bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors text-left"
            >
              <span className="text-base">𝕏</span>
              Twitter
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-text-primary bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors text-left"
            >
              <span className="text-base">🔗</span>
              {copied ? "Copied!" : "Copy link"}
            </button>

            {/* Native share (mobile) */}
            {"share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-text-primary bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors text-left"
              >
                <span className="text-base">📤</span>
                More options...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
