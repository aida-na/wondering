export type CreationMethod = "quick" | "chat" | "upload" | "catalog"

export type CreateFlowStep =
  | "landing"
  | "chat-explore"
  | "upload-source"
  | "personalizing"
  | "creating"
  | "course-form"
  | "generating"
  | "preview"

export interface PersonalizationQuestion {
  id: string
  text: string
  options: string[]
}

export interface PersonalizationAnswer {
  questionId: string
  answer: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface CreateCourseParams {
  method: CreationMethod
  topic?: string
  chatHistory?: ChatMessage[]
  sourceUrl?: string
  sourceFile?: string
  catalogCourseId?: string
  /** When adding from catalog, the original course author to preserve */
  creator?: string
}

/* ─── Course Generation Types ─── */

export type ExperienceLevel = "beginner" | "intermediate" | "advanced"
export type Frequency = "daily" | "3x_week" | "weekly"
export type SessionDuration = 5 | 10 | 15 | 30
export type TimelineWeeks = 1 | 2 | 4 | 12 | null

export interface CourseGenerationParams {
  topic: string
  goal: string
  level: ExperienceLevel
  frequency: Frequency
  duration: SessionDuration
  timeline: TimelineWeeks
}

export interface GeneratedCard {
  cardId: string
  type: "concept" | "definition" | "comparison" | "review"
  question: string
  answer: string
  explanation: string
  keyTerms: string[]
  visualDescription: string
}

export interface GeneratedLesson {
  lessonId: string
  lessonNumber: string
  title: string
  description: string
  estimatedMinutes: number
  cardsCount: number
  status: "generated" | "pending"
  cards?: GeneratedCard[]
}

export interface GeneratedLevel {
  levelNumber: number
  title: string
  description: string
  lessons: GeneratedLesson[]
}

export interface GeneratedCourse {
  courseId: string
  title: string
  description: string
  topic: string
  goal: string
  level: ExperienceLevel
  estimatedHours: number
  structure: {
    levels: GeneratedLevel[]
  }
}

export interface GenerationStatus {
  status: "generating" | "completed" | "failed"
  progressPercentage: number
  currentStep: string
  errorMessage?: string
}
