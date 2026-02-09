import type { Course } from "@/features/courses/types"
import type {
  CreateCourseParams,
  PersonalizationAnswer,
  PersonalizationQuestion,
} from "./types"

const MOCK_QUESTIONS: PersonalizationQuestion[] = [
  {
    id: "q1",
    text: "What's your current experience level with this topic?",
    options: ["Complete Beginner", "Some Knowledge", "Intermediate", "Advanced"],
  },
  {
    id: "q2",
    text: "How do you prefer to learn?",
    options: [
      "Short daily lessons",
      "Deep-dive sessions",
      "Practice-heavy",
      "Theory first",
    ],
  },
  {
    id: "q3",
    text: "What's your main goal?",
    options: [
      "General understanding",
      "Apply at work",
      "Teach others",
      "Personal curiosity",
    ],
  },
]

const CANNED_RESPONSES = [
  "That's a great topic to explore! There are many fascinating angles we could take. What aspect interests you most?",
  "Interesting! I can see a few directions we could go. Would you like to focus on the fundamentals first, or dive into a specific area?",
  "I love that question. Let me think about how to structure that into a learning path for you. What would you like to be able to do after completing the course?",
  "That's a wonderful area of study. Many learners find it helpful to start with the history and context. Does that appeal to you?",
]

/**
 * Start course creation and receive personalization questions.
 *
 * **Backend contract:**
 * ```
 * POST /api/courses/create/start
 * Body: CreateCourseParams
 * Response: { questions: PersonalizationQuestion[] }
 * ```
 */
export async function startCourseCreation(
  _params: CreateCourseParams
): Promise<PersonalizationQuestion[]> {
  await new Promise((r) => setTimeout(r, 300))
  return MOCK_QUESTIONS
}

/**
 * Submit personalization answers and finalize course creation.
 *
 * **Backend contract:**
 * ```
 * POST /api/courses/create/finalize
 * Body: { params: CreateCourseParams, answers: PersonalizationAnswer[] }
 * Response: Course
 * ```
 */
export async function submitPersonalization(
  params: CreateCourseParams,
  _answers: PersonalizationAnswer[]
): Promise<Course> {
  await new Promise((r) => setTimeout(r, 1500))
  const id = `new-${Date.now()}`
  return {
    id,
    name: params.topic ?? "Untitled course",
    creator: params.creator ?? "You",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 12,
    createdAt: new Date().toISOString().slice(0, 10),
    isShared: false,
    shareCount: 0,
    isPublished: false,
    createdByUser: true,
  }
}

/**
 * Send a message in the chat-explore flow and get a response.
 *
 * **Backend contract:**
 * ```
 * POST /api/chat/explore
 * Body: { message: string, history: ChatMessage[] }
 * Response: { reply: string }
 * ```
 */
export async function getMockChatResponse(
  _message: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 500))
  return CANNED_RESPONSES[Math.floor(Math.random() * CANNED_RESPONSES.length)]
}
