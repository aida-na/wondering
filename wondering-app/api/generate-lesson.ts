export const config = { runtime: "nodejs" }

interface GenerateLessonRequest {
  topic: string
  goal: string
  level: "beginner" | "intermediate" | "advanced"
  lesson: {
    lessonId: string
    lessonNumber: string
    title: string
    description: string
  }
  cardsCount?: number
}

interface GeneratedCard {
  cardId: string
  type: "concept" | "definition" | "comparison" | "review"
  question: string
  answer: string
  explanation: string
  keyTerms: string[]
  visualDescription: string
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "GEMINI_API_KEY is not configured. Set it in your environment to generate real course content.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  let body: GenerateLessonRequest
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { topic, goal, level, lesson, cardsCount = 10 } = body
  if (!topic || !goal || !level || !lesson?.lessonId || !lesson?.title) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: topic, goal, level, lesson" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const levelGuidance =
    level === "beginner"
      ? "Assume no background, explain everything"
      : level === "intermediate"
        ? "Can reference foundational concepts"
        : "Can use technical language, focus on nuance"

  const prompt = `You are creating flashcard content for a Duolingo-style learning app.

COURSE CONTEXT:
- Topic: ${topic}
- User Goal: ${goal}
- User Level: ${level}
- Lesson: ${lesson.lessonNumber} - ${lesson.title}
- Description: ${lesson.description}

TASK:
Create ${cardsCount} flashcards for this lesson. Each card must have topic-specific, substantive content—no generic placeholders.

FLASHCARD REQUIREMENTS:
1. Types to include (mix these):
   - Concept cards: Explain a single idea (60%)
   - Definition cards: Define key terms (20%)
   - Comparison cards: Show relationships (10%)
   - Review card: Summarize lesson (10%, always last card)

2. Each flashcard needs:
   - Clear question/prompt (front of card)
   - Concise answer (2-3 sentences max)
   - Engaging explanation or fun fact
   - 2-3 key terms (topic-specific)
   - Visual description (what diagram/image would help)

3. Content guidelines:
   - Use simple, conversational language
   - Build on previous cards in the lesson
   - Include concrete examples and analogies specific to ${topic}
   - Add engaging context or real-world applications
   - Make it memorable (fun facts, surprising connections)
   - For ${level} level: ${levelGuidance}
   - IMPORTANT: Generate real, topic-specific content. Do NOT use generic phrases like "systematic thinking" or "evidence-based reasoning" for every topic.

4. Card order:
   - Card 1: Most fundamental concept for this lesson
   - Cards 2-${cardsCount - 1}: Progressive building blocks
   - Card ${cardsCount}: Review card that tests comprehension

OUTPUT FORMAT (JSON only, no markdown):
{
  "cards": [
    {
      "cardId": "${lesson.lessonId}-c1",
      "type": "concept",
      "question": "Topic-specific question here",
      "answer": "Clear, concise answer with real content",
      "explanation": "Fun fact or additional context",
      "keyTerms": ["term1", "term2"],
      "visualDescription": "Specific description of helpful visual"
    }
  ]
}

Generate all ${cardsCount} flashcards now. Output only valid JSON.`

  try {
    const model = "gemini-2.0-flash"
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API error ${res.status}: ${errText}`)
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> }
      }>
    }
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
    if (!text) {
      throw new Error("Empty response from Gemini")
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : text
    const parsed = JSON.parse(jsonStr) as { cards?: GeneratedCard[] }

    if (!parsed?.cards || !Array.isArray(parsed.cards)) {
      throw new Error("Invalid response format: expected { cards: [...] }")
    }

    const cards = parsed.cards.map((c, i) => ({
      cardId: c.cardId ?? `${lesson.lessonId}-c${i + 1}`,
      type: c.type ?? "concept",
      question: c.question ?? "",
      answer: c.answer ?? "",
      explanation: c.explanation ?? "",
      keyTerms: Array.isArray(c.keyTerms) ? c.keyTerms : [],
      visualDescription: c.visualDescription ?? "",
    }))

    return new Response(JSON.stringify({ cards }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("generate-lesson error:", err)
    return new Response(
      JSON.stringify({ error: "Generation failed", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
