import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import type { Course, ShareLinkData } from "./types"
import { generateShareLink, shareCourse } from "./share-utils"
import { courseImage } from "./courses-page"

type ShareTone = "made" | "together"
type ShareChannel = "imessage" | "twitter" | "instagram" | "linkedin" | "copy" | "native"

const CHANNEL_DEFAULT_TONE: Record<ShareChannel, ShareTone> = {
  imessage: "together",
  twitter: "made",
  instagram: "made",
  linkedin: "made",
  copy: "made",
  native: "together",
}

function getMessage(tone: ShareTone, courseName: string) {
  if (tone === "made") {
    return `I just made a course on ${courseName}`
  }
  return `Learning ${courseName} - want to do it together? We can keep each other on track`
}

interface ShareModalProps {
  course: Course
  onClose: () => void
  onShared: () => void
}

export function ShareModal({ course, onClose, onShared }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [tone, setTone] = useState<ShareTone>("made")
  const cardRef = useRef<HTMLDivElement>(null)

  const shareData: ShareLinkData = generateShareLink(course)

  // Estimate reading time: ~2.5 min per lesson
  const estimatedMin = Math.round(course.totalLessons * 2.5)

  const message = getMessage(tone, course.name)

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

  function shareVia(channel: ShareChannel) {
    const activeTone = CHANNEL_DEFAULT_TONE[channel]
    // Use the channel's default tone for the actual message sent
    const text = getMessage(activeTone, course.name)

    switch (channel) {
      case "imessage": {
        const body = `${text}\n${shareData.shareUrl}`
        window.open(`sms:&body=${encodeURIComponent(body)}`, "_blank")
        break
      }
      case "twitter": {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.shareUrl)}`
        window.open(tweetUrl, "_blank")
        break
      }
      case "instagram": {
        // Copy message to clipboard then open Instagram so user can paste in DM/Story
        const body = `${text}\n${shareData.shareUrl}`
        navigator.clipboard.writeText(body)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        window.open("https://www.instagram.com/", "_blank")
        break
      }
      case "linkedin": {
        const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${text}\n${shareData.shareUrl}`)}`
        window.open(linkedinUrl, "_blank")
        break
      }
      case "copy": {
        const body = `${message}\n${shareData.shareUrl}`
        navigator.clipboard.writeText(body)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return // don't call onShared for copy
      }
      case "native": {
        shareCourse(shareData, text).then((result) => {
          if (result === "shared" || result === "copied") onShared()
        })
        return
      }
    }
    onShared()
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

          {/* ─── Tone toggle ─── */}
          <div className="px-8 pb-4">
            <div className="flex gap-1 rounded-xl bg-white/40 backdrop-blur-sm p-1">
              <button
                onClick={() => setTone("made")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  tone === "made"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Share what I made
              </button>
              <button
                onClick={() => setTone("together")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  tone === "together"
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Invite to learn together
              </button>
            </div>

            {/* Message preview */}
            <p className="mt-3 text-sm text-text-secondary italic leading-snug">
              &ldquo;{message}&rdquo;
            </p>
          </div>

          {/* ─── Share channels ─── */}
          <div className="px-8 pb-6">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
              Share via
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => { setTone(CHANNEL_DEFAULT_TONE.imessage); shareVia("imessage") }}
                className="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
                title="iMessage"
              >
                <img src="/Transparent iMessage Icon.png" alt="iMessage" className="size-7 object-contain" />
              </button>

              <button
                onClick={() => { setTone(CHANNEL_DEFAULT_TONE.twitter); shareVia("twitter") }}
                className="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
                title="Twitter"
              >
                <img src="/Twitter Logo PNG.png" alt="Twitter" className="size-7 object-contain" />
              </button>

              <button
                onClick={() => { setTone(CHANNEL_DEFAULT_TONE.instagram); shareVia("instagram") }}
                className="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
                title="Instagram"
              >
                <img src="/Instagram Icon Transparent.png" alt="Instagram" className="size-7 object-contain" />
              </button>

              <button
                onClick={() => { setTone(CHANNEL_DEFAULT_TONE.linkedin); shareVia("linkedin") }}
                className="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
                title="LinkedIn"
              >
                <img src="/LinkedIn Icon Thumbnail.png" alt="LinkedIn" className="size-7 object-contain" />
              </button>

              <button
                onClick={() => shareVia("copy")}
                className="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
                title={copied ? "Copied!" : "Copy link"}
              >
                <span className="text-lg">{copied ? "✓" : "🔗"}</span>
              </button>
            </div>

            {copied && (
              <p className="mt-2 text-center text-xs text-text-secondary">Copied to clipboard!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
