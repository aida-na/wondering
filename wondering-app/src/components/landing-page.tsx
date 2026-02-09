import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onStartLearning: () => void
}

export function LandingPage({ onStartLearning }: LandingPageProps) {
  return (
    <div className="flex min-h-full flex-col overflow-auto">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="text-center animate-hero-reveal">
          <div className="mx-auto mb-4 flex justify-center overflow-visible">
            <video
              src="/walking-character.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-24 w-auto object-contain md:h-32"
              style={{ background: "transparent" }}
              aria-hidden
            />
          </div>
          <h1 className="young-serif-font text-3xl font-bold leading-tight text-text-primary md:text-4xl lg:text-5xl">
            learn. obsess. repeat.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
            Turn any rabbit holes into progress. Curated topics, lessons that fit
            into your schedule, and satisfying streaks — for people who learn
            because they can&apos;t help it.
          </p>
          <Button
            variant="primary"
            size="xl"
            className="mt-10 share-tech-mono-font"
            onClick={onStartLearning}
            uppercase={true}
          >
            Start learning
          </Button>
        </div>
      </div>
    </div>
  )
}
