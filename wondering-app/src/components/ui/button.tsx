import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "share-tech-mono-font text-base uppercase border border-brand-active bg-brand text-text-primary shadow-[0_4px_0_0_hsl(var(--w-brand-primary-hover)),0_5px_0_0_hsl(var(--w-brand-primary-active))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--w-brand-primary-hover)),0_7px_0_0_hsl(var(--w-brand-primary-active))] active:translate-y-1 active:shadow-none",
        secondary:
          "border border-button-secondary-border bg-button-secondary text-button-secondary-foreground shadow-[0_4px_0_0_hsl(var(--w-button-secondary-hover)),0_5px_0_0_hsl(var(--w-button-secondary-active))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--w-button-secondary-hover)),0_7px_0_0_hsl(var(--w-button-secondary-active))] active:translate-y-1 active:shadow-none",
        tertiary:
          "border border-button-tertiary-border bg-button-tertiary text-button-tertiary-foreground shadow-[0_4px_0_0_hsl(var(--w-button-tertiary-shadow)),0_5px_0_0_hsl(var(--w-button-tertiary-shadow-active))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--w-button-tertiary-shadow)),0_7px_0_0_hsl(var(--w-button-tertiary-shadow-active))] active:translate-y-1 active:shadow-none",
        "primary-success":
          "border border-button-success-border bg-button-success text-text-primary shadow-[0_4px_0_0_hsl(var(--w-button-success-shadow)),0_5px_0_0_hsl(var(--w-button-success-border))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--w-button-success-shadow)),0_7px_0_0_hsl(var(--w-button-success-border))] active:translate-y-1 active:shadow-none",
        danger:
          "border border-button-danger-border bg-button-danger-foreground text-button-danger shadow-[0_4px_0_0_hsl(var(--w-button-danger-shadow)),0_5px_0_0_hsl(var(--w-button-danger-border))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--w-button-danger-shadow)),0_7px_0_0_hsl(var(--w-button-danger-border))] active:translate-y-1 active:shadow-none",
        outline:
          "border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-hover",
        ghost: "text-text-primary hover:bg-surface-hover",
        link: "text-brand underline-offset-4 hover:underline",
        game: "share-tech-mono-font rounded-2xl border border-brand-hover bg-brand font-bold tracking-wide text-text-primary shadow-[0_4px_0_0_hsl(var(--w-brand-primary-hover)),0_4px_0_1px_hsl(var(--w-brand-primary-active))] hover:bg-brand-hover active:translate-y-1 active:shadow-none",
      },
      size: {
        sm: "rounded-lg px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-4 py-3 text-base",
        xl: "px-6 py-3.5 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        game: "px-8 py-4 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      uppercase: true,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      uppercase,
      asChild = false,
      isLoading = false,
      loadingText = "Loading",
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, uppercase, className }))}
        ref={ref}
        aria-disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span role="status" className="inline-flex items-center gap-2">
            <svg
              className="size-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </span>
        ) : (
          <>
            {leadingIcon}
            {children}
            {trailingIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
