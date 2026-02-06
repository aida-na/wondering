import { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, Info, X } from "lucide-react"

export interface Toast {
  id: string
  message: string
  variant?: "success" | "info" | "error"
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onDismiss])

  const icon = {
    success: <CheckCircle className="size-5 shrink-0 text-success-text" />,
    info: <Info className="size-5 shrink-0 text-brand-text" />,
    error: <Info className="size-5 shrink-0 text-error-text" />,
  }[toast.variant ?? "success"]

  const bgClass = {
    success: "bg-success-bg border-success",
    info: "bg-brand-bg border-brand-border",
    error: "bg-error-bg border-error",
  }[toast.variant ?? "success"]

  return (
    <div
      className={cn(
        "animate-slide-up pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
        bgClass
      )}
    >
      {icon}
      <p className="text-sm font-medium text-text-primary">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto shrink-0 rounded-lg p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

// Global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notifyListeners() {
  toastListeners.forEach((l) => l([...toasts]))
}

export function showToast(
  message: string,
  variant: Toast["variant"] = "success",
  duration = 4000
) {
  const id = crypto.randomUUID()
  toasts = [...toasts, { id, message, variant, duration }]
  notifyListeners()
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notifyListeners()
}

export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    toastListeners.push(setItems)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setItems)
    }
  }, [])

  const handleDismiss = useCallback((id: string) => {
    dismissToast(id)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}
