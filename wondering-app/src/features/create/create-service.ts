import type { Course } from "@/features/courses/types"
import type {
  CreateCourseParams,
  PersonalizationAnswer,
  PersonalizationQuestion,
  CourseGenerationParams,
  GenerationStatus,
  GeneratedCourse,
  GeneratedLevel,
  GeneratedLesson,
  GeneratedCard,
  Frequency,
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

/* ─── Course Generation (mock) ─── */

interface GenerationEntry {
  status: GenerationStatus
  course?: GeneratedCourse
  params: CourseGenerationParams
}

const generationStore = new Map<string, GenerationEntry>()

/* ─── Public course-content store ─── */
const courseContentStore = new Map<string, GeneratedCourse>()

/** Persist a generated course so it can be retrieved later (e.g. by the outline modal). */
export function registerCourseContent(course: GeneratedCourse) {
  courseContentStore.set(course.courseId, course)
}

/** Look up a generated course's full content (levels, lessons, cards). */
export function getCourseContent(courseId: string): GeneratedCourse | null {
  return (
    courseContentStore.get(courseId) ??
    generationStore.get(courseId)?.course ??
    null
  )
}

/**
 * Kick off course generation. Returns immediately with a courseId.
 * Progress is polled via `getGenerationStatus`.
 *
 * **Backend contract:**
 * ```
 * POST /api/courses/generate
 * Body: CourseGenerationParams
 * Response: { courseId: string, status: "generating" }
 * ```
 */
export async function generateCourse(
  params: CourseGenerationParams
): Promise<{ courseId: string }> {
  const courseId = `gen-${Date.now()}`
  generationStore.set(courseId, {
    status: {
      status: "generating",
      progressPercentage: 0,
      currentStep: "Analyzing your goals...",
    },
    params,
  })
  simulateGeneration(courseId, params)
  return { courseId }
}

function updateProgress(
  courseId: string,
  pct: number,
  step: string
) {
  const entry = generationStore.get(courseId)
  if (entry) {
    entry.status = {
      status: "generating",
      progressPercentage: pct,
      currentStep: step,
    }
  }
}

async function simulateGeneration(
  courseId: string,
  params: CourseGenerationParams
) {
  try {
    updateProgress(courseId, 15, "Analyzing your goals...")
    await new Promise((r) => setTimeout(r, 600))

    updateProgress(courseId, 35, "Designing course structure...")
    await new Promise((r) => setTimeout(r, 800))

    const course = await buildCourse(courseId, params, (pct, step) =>
      updateProgress(courseId, pct, step)
    )

    const entry = generationStore.get(courseId)
    if (entry) {
      entry.status = {
        status: "completed",
        progressPercentage: 100,
        currentStep: "Complete!",
      }
      entry.course = course
    }
  } catch (err) {
    const entry = generationStore.get(courseId)
    if (entry) {
      entry.status = {
        status: "failed",
        progressPercentage: 0,
        currentStep: "Generation failed",
        errorMessage: err instanceof Error ? err.message : "Unknown error",
      }
    }
  }
}

const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : ""

/**
 * Fetch AI-generated lesson cards from the API. Falls back to mock cards on failure.
 */
async function generateLessonCards(
  params: CourseGenerationParams,
  lesson: GeneratedLesson,
  verb: string
): Promise<GeneratedCard[]> {
  try {
    const res = await fetch(`${API_BASE}/api/generate-lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: params.topic,
        goal: params.goal,
        level: params.level,
        lesson: {
          lessonId: lesson.lessonId,
          lessonNumber: lesson.lessonNumber,
          title: lesson.title,
          description: lesson.description,
        },
        cardsCount: 10,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? `API error ${res.status}`)
    }

    const data = (await res.json()) as { cards?: GeneratedCard[] }
    const cards = data.cards
    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error("Invalid API response")
    }

    return cards.map((c, i) => ({
      cardId: c.cardId ?? `${lesson.lessonId}-c${i + 1}`,
      type: c.type ?? "concept",
      question: c.question ?? "",
      answer: c.answer ?? "",
      explanation: c.explanation ?? "",
      keyTerms: Array.isArray(c.keyTerms) ? c.keyTerms : [],
      visualDescription: c.visualDescription ?? "",
    }))
  } catch {
    return buildMockCards(params, lesson.lessonId, verb)
  }
}

/**
 * Poll generation status.
 *
 * **Backend contract:**
 * ```
 * GET /api/courses/{courseId}/status
 * Response: GenerationStatus
 * ```
 */
export async function getGenerationStatus(
  courseId: string
): Promise<GenerationStatus> {
  const entry = generationStore.get(courseId)
  if (!entry) {
    return {
      status: "failed",
      progressPercentage: 0,
      currentStep: "Course not found",
      errorMessage: "Course not found",
    }
  }
  return entry.status
}

/**
 * Get the fully generated course once status is "completed".
 *
 * **Backend contract:**
 * ```
 * GET /api/courses/{courseId}
 * Response: GeneratedCourse
 * ```
 */
export async function getGeneratedCourse(
  courseId: string
): Promise<GeneratedCourse | null> {
  const entry = generationStore.get(courseId)
  return entry?.course ?? null
}

/* ─── Course builder ─── */

const LEVEL_TEMPLATES = [
  { title: "Foundations", desc: "Build your base understanding" },
  { title: "Core Concepts", desc: "Master the essential ideas" },
  { title: "Practical Application", desc: "Put knowledge into practice" },
  { title: "Advanced Topics", desc: "Dive deeper into nuanced areas" },
  { title: "Mastery & Synthesis", desc: "Bring it all together" },
]

const LESSON_VERBS = [
  ["Introduction to", "Understanding", "Exploring", "Discovering"],
  ["Deep Dive into", "Analyzing", "Breaking Down", "Examining"],
  ["Applying", "Practicing", "Building with", "Working with"],
  ["Advanced", "Optimizing", "Evaluating", "Mastering"],
  ["Synthesizing", "Creating with", "Innovating in", "Teaching"],
]

async function buildCourse(
  courseId: string,
  params: CourseGenerationParams,
  onProgress: (pct: number, step: string) => void
): Promise<GeneratedCourse> {
  const sessionsPerWeek: Record<Frequency, number> = {
    daily: 7,
    "3x_week": 3,
    weekly: 1,
  }
  const weeks = params.timeline ?? 4
  const totalSessions = sessionsPerWeek[params.frequency] * weeks
  const totalMinutes = totalSessions * params.duration
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const numLevels = totalHours <= 2 ? 3 : totalHours <= 6 ? 4 : 5
  const lessonsPerLevel = totalHours <= 3 ? 2 : totalHours <= 8 ? 3 : 4

  const levels: GeneratedLevel[] = []
  let lessonCount = 0
  const lessonsWithCards: Array<{ lesson: GeneratedLesson; verb: string }> = []

  for (let l = 0; l < numLevels; l++) {
    const lessons: GeneratedLesson[] = []
    for (let s = 0; s < lessonsPerLevel; s++) {
      lessonCount++
      const lessonId = `lesson-${l + 1}-${s + 1}`
      const verb = LESSON_VERBS[l][s % LESSON_VERBS[l].length]

      const lesson: GeneratedLesson = {
        lessonId,
        lessonNumber: `${l + 1}.${s + 1}`,
        title: `${verb} ${params.topic}`,
        description: `Learn to ${verb.toLowerCase()} key aspects of ${params.topic} in this ${params.duration}-minute lesson.`,
        estimatedMinutes: params.duration,
        cardsCount: 10,
        status: lessonCount <= 3 ? "generated" : "pending",
      }

      if (lessonCount <= 3) {
        lessonsWithCards.push({ lesson, verb })
      }
      lessons.push(lesson)
    }

    levels.push({
      levelNumber: l + 1,
      title: LEVEL_TEMPLATES[l].title,
      description: `${LEVEL_TEMPLATES[l].desc} of ${params.topic}`,
      lessons,
    })
  }

  for (let i = 0; i < lessonsWithCards.length; i++) {
    const pct = 50 + ((i + 1) / lessonsWithCards.length) * 45
    onProgress(pct, `Creating lesson ${i + 1}/${lessonsWithCards.length}...`)
    const { lesson, verb } = lessonsWithCards[i]
    lesson.cards = await generateLessonCards(params, lesson, verb)
  }

  onProgress(95, "Finalizing your course...")

  const titleMap = {
    beginner: `${params.topic}: A Beginner's Journey`,
    intermediate: `Leveling Up in ${params.topic}`,
    advanced: `Mastering ${params.topic}`,
  }

  const freqLabel =
    params.frequency === "daily"
      ? "daily"
      : params.frequency === "3x_week"
        ? "3x/week"
        : "weekly"

  return {
    courseId,
    title: titleMap[params.level],
    description: `A personalized ${totalHours}-hour course designed to help you ${params.goal.toLowerCase().replace(/\.$/, "")}. Built for ${params.level} learners with ${params.duration}-minute ${freqLabel} sessions.`,
    topic: params.topic,
    goal: params.goal,
    level: params.level,
    estimatedHours: totalHours,
    structure: { levels },
  }
}

/** Flashcard mix per spec: 60% concept, 20% definition, 10% comparison, 10% review (last). */
function buildMockCards(
  params: CourseGenerationParams,
  lessonId: string,
  verb: string
): GeneratedCard[] {
  const { topic, goal, level } = params
  const verbLower = verb.toLowerCase()

  const conceptTemplates = [
    {
      q: `What is ${topic} and why does it matter?`,
      a: `${topic} is a rich area of study with significant real-world applications. Understanding it helps you ${goal.toLowerCase().replace(/\.$/, "")} and see the world differently.`,
      e: `The field has been studied extensively and continues to evolve with new discoveries.`,
      k: [topic, "fundamentals", "applications"],
      v: `A diagram showing the key areas of ${topic} and how they connect.`,
    },
    {
      q: `What are the core principles of ${verbLower} ${topic}?`,
      a: `The core principles include systematic thinking, evidence-based reasoning, and practical application. These form the foundation for ${level} learners.`,
      e: `These principles form the backbone of effective learning in this area.`,
      k: ["principles", "systematic thinking", "evidence-based"],
      v: `An illustrated list of the core principles with icons.`,
    },
    {
      q: `How can you apply ${topic} concepts in everyday life?`,
      a: `You can apply these concepts by observing patterns, asking critical questions, and testing your understanding through practice. This supports your goal: ${goal.toLowerCase().replace(/\.$/, "")}.`,
      e: `Real-world application accelerates learning and deepens understanding.`,
      k: ["application", "practice", "patterns"],
      v: `A before/after comparison showing how knowledge changes perspective.`,
    },
    {
      q: `What makes ${topic} different from related fields?`,
      a: `${topic} focuses on specific methods, frameworks, and outcomes that distinguish it from adjacent disciplines. The key is how concepts are applied.`,
      e: `Understanding boundaries helps you know when and where to use what you learn.`,
      k: ["distinction", "focus", "frameworks"],
      v: `A Venn diagram comparing ${topic} with related fields.`,
    },
    {
      q: `What common mistakes do people make when learning ${topic}?`,
      a: `Common mistakes include skipping fundamentals, memorizing without understanding, and not practicing enough. ${level} learners often benefit from building a strong base first.`,
      e: `Avoiding these pitfalls can save you time and frustration.`,
      k: ["mistakes", "pitfalls", "fundamentals"],
      v: `A checklist of pitfalls to avoid, with checkmarks.`,
    },
    {
      q: `How does ${verbLower} ${topic} connect to your overall goal?`,
      a: `This lesson builds toward your goal of ${goal.toLowerCase().replace(/\.$/, "")} by introducing essential concepts you'll use later. Each card adds another building block.`,
      e: `Connecting new knowledge to your goals improves retention.`,
      k: ["connection", "goal", "progression"],
      v: `A progress path from this lesson toward your goal.`,
    },
  ]

  const definitionTemplates = [
    {
      q: `Define the term "core competency" in the context of ${topic}.`,
      a: `In ${topic}, core competency refers to the fundamental skills and knowledge you need to understand and apply key concepts effectively.`,
      e: `Having a clear definition helps you recognize when you've mastered a concept.`,
      k: ["core competency", "fundamentals", topic],
      v: `An illustrated definition card with key terms highlighted.`,
    },
    {
      q: `What does "evidence-based" mean when applied to ${topic}?`,
      a: `Evidence-based means relying on research, data, and proven methods rather than opinions or anecdotes. In ${topic}, this ensures your learning is grounded in what works.`,
      e: `Evidence-based practice has roots in medicine and has spread to many disciplines.`,
      k: ["evidence-based", "research", "data"],
      v: `A diagram showing data flowing into decisions.`,
    },
  ]

  const comparisonTemplate = {
    q: `How does ${topic} for beginners differ from ${topic} for advanced learners?`,
    a: `Beginners focus on foundations and core concepts; advanced learners tackle nuance, edge cases, and specialized applications. Your ${level} level shapes what you learn next.`,
    e: `The same topic unfolds differently depending on where you start.`,
    k: ["beginner", "advanced", "progression"],
    v: `A comparison timeline showing beginner vs advanced paths.`,
  }

  const reviewTemplate = {
    q: `Quick review: Summarize the key takeaways about ${topic} from this lesson.`,
    a: `This lesson covered core principles of ${verbLower} ${topic}, how to apply them, common pitfalls, and how they connect to your goal of ${goal.toLowerCase().replace(/\.$/, "")}. You now have a solid base to build on.`,
    e: `Summarizing helps consolidate what you've learned and identify any gaps.`,
    k: ["review", "summary", topic],
    v: `A mind-map summarizing the lesson's key points.`,
  }

  const mix: Array<"concept" | "definition" | "comparison" | "review"> = [
    "concept",
    "concept",
    "definition",
    "concept",
    "concept",
    "comparison",
    "concept",
    "concept",
    "definition",
    "review",
  ]

  let conceptIdx = 0
  let definitionIdx = 0

  return mix.map((type, i) => {
    let content: { q: string; a: string; e: string; k: string[]; v: string }
    switch (type) {
      case "concept":
        content = conceptTemplates[conceptIdx++ % conceptTemplates.length]
        break
      case "definition":
        content = definitionTemplates[definitionIdx++ % definitionTemplates.length]
        break
      case "comparison":
        content = comparisonTemplate
        break
      case "review":
        content = reviewTemplate
        break
    }

    return {
      cardId: `${lessonId}-c${i + 1}`,
      type,
      question: content.q,
      answer: content.a,
      explanation: content.e,
      keyTerms: content.k,
      visualDescription: content.v,
    }
  })
}
