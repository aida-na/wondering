import { useState } from "react"
import { ArrowLeft, Upload, Link, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSourceViewProps {
  onBack: () => void
  onSubmit: (source: { url?: string; fileName?: string }) => void
}

export function UploadSourceView({ onBack, onSubmit }: UploadSourceViewProps) {
  const [url, setUrl] = useState("")
  const [mockFile, setMockFile] = useState<string | null>(null)

  const handleMockUpload = () => {
    setMockFile("uploaded-document.pdf")
  }

  const handleSubmit = () => {
    onSubmit({
      url: url.trim() || undefined,
      fileName: mockFile || undefined,
    })
  }

  const canSubmit = url.trim() || mockFile

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <span className="text-sm font-medium text-text-secondary">
          From a Source
        </span>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-text-primary young-serif-font">
              Create from a Source
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Upload a document or paste a URL, and we'll turn it into a
              personalized course.
            </p>
          </div>

          {/* Drop zone (visual skeleton only) */}
          <button
            type="button"
            onClick={handleMockUpload}
            className="w-full rounded-xl border-2 border-dashed border-border hover:border-brand-border bg-surface-secondary p-8 text-center transition-colors group"
          >
            <Upload className="mx-auto size-8 text-text-tertiary group-hover:text-brand transition-colors" />
            <p className="mt-3 text-sm font-medium text-text-secondary">
              Click to upload a document
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              PDF, DOCX, or TXT (up to 10 MB)
            </p>
          </button>

          {/* Mock uploaded file */}
          {mockFile && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
              <FileText className="size-5 text-brand shrink-0" />
              <span className="flex-1 text-sm text-text-primary truncate">
                {mockFile}
              </span>
              <button
                onClick={() => setMockFile(null)}
                className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-tertiary">or paste a URL</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* URL input */}
          <div className="relative">
            <Link className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
            />
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            fullWidth
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
