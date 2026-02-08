export type CreationMethod = "quick" | "chat" | "upload" | "catalog"

export type CreateFlowStep =
  | "landing"
  | "chat-explore"
  | "upload-source"
  | "personalizing"
  | "creating"

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
