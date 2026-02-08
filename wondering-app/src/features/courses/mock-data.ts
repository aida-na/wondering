import type { CatalogCourse, Course, CourseOutline, LearningPath } from "./types"

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Bio-Optimized Nutrition for Peak Energy",
    creator: "Shane Parrish",
    status: "In Progress",
    doneLessons: 1,
    totalLessons: 20,
    createdAt: "2026-02-04",
    isShared: true,
    shareCount: 12,
  },
  {
    id: "2",
    name: "Architecture of Gamified Learning",
    creator: "Nir Eyal",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 1,
    createdAt: "2026-02-04",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "3",
    name: "Hooked for Hardware Onboarding",
    creator: "Nir Eyal",
    status: "In Progress",
    doneLessons: 3,
    totalLessons: 22,
    createdAt: "2026-01-30",
    isShared: true,
    shareCount: 5,
  },
  {
    id: "4",
    name: "Naked-Eye Astronomy Basics",
    creator: "Chris Voss",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 6,
    createdAt: "2026-02-03",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "5",
    name: "Mental Models for Roadmaps",
    creator: "Shane Parrish",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 25,
    createdAt: "2026-01-30",
    isShared: true,
    shareCount: 34,
  },
]

export const recommendedCourses: Course[] = [
  {
    id: "r1",
    name: "The Great Mental Models Volume 1",
    creator: "Shane Parrish",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 18,
    createdAt: "2026-02-06",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "r2",
    name: "Never Split the Difference",
    creator: "Chris Voss",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 14,
    createdAt: "2026-02-06",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "r3",
    name: "The Psychology of Money",
    creator: "Morgan Housel",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 20,
    createdAt: "2026-02-06",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "r4",
    name: "Astrophysics for People in a Hurry",
    creator: "Neil deGrasse Tyson",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 12,
    createdAt: "2026-02-06",
    isShared: false,
    shareCount: 0,
  },
  {
    id: "r5",
    name: "The Design of Everyday Things",
    creator: "Don Norman",
    status: "Not Started",
    doneLessons: 0,
    totalLessons: 16,
    createdAt: "2026-02-06",
    isShared: false,
    shareCount: 0,
  },
]

export const catalogCategories = [
  "For You", "All", "Psychology", "Philosophy", "Science", "Design",
  "Learning", "Longevity", "AI", "Analytic Philosophy", "Analytics",
  "Architecture", "Art", "Artificial Intelligence", "Business",
  "Business Strategy",
] as const

export const mockCatalogCourses: CatalogCourse[] = [
  // Psychology
  { id: "c1", name: "The Great Mental Models Volume 1", creator: "Shane Parrish and Rhiannon Beaubien", category: "Psychology", popular: true, recommendedScore: 0.95 },
  { id: "c2", name: "Never Split the Difference", creator: "Chris Voss", category: "Psychology", popular: true, recommendedScore: 0.88 },
  { id: "c3", name: "Hooked: How to Build Habit-Forming Products", creator: "Nir Eyal", category: "Psychology", popular: true, isFamousAuthor: true, recommendedScore: 0.82 },
  { id: "c4", name: "100 Things Every Designer Needs to Know About People", creator: "Susan M. Weinschenk", category: "Psychology", popular: true },
  { id: "c5", name: "The Psychology of Money", creator: "Morgan Housel", category: "Psychology", popular: true, isFamousAuthor: true, recommendedScore: 0.91 },
  // Philosophy
  { id: "c6", name: "The Creative Act: A Way of Being", creator: "Rick Rubin", category: "Philosophy", popular: true, isFamousAuthor: true, recommendedScore: 0.87 },
  { id: "c7", name: "The Almanack of Naval Ravikant", creator: "Eric Jorgenson", category: "Philosophy", popular: true, recommendedScore: 0.78 },
  { id: "c8", name: "Great Thinkers", creator: "The School of Life", category: "Philosophy", popular: true },
  { id: "c9", name: "A Little History of Philosophy", creator: "Nigel Warburton", category: "Philosophy", popular: true },
  { id: "c10", name: "The Timeless Way of Building", creator: "Christopher Alexander", category: "Philosophy", popular: true },
  // Science
  { id: "c11", name: "Astrophysics for People in a Hurry", creator: "Neil deGrasse Tyson", category: "Science", popular: true, isFamousAuthor: true, recommendedScore: 0.93 },
  { id: "c12", name: "A Short History of Nearly Everything", creator: "Bill Bryson", category: "Science", popular: true },
  { id: "c13", name: "The Gene: An Intimate History", creator: "Siddhartha Mukherjee", category: "Science" },
  { id: "c14", name: "Sapiens: A Brief History of Humankind", creator: "Yuval Noah Harari", category: "Science", popular: true, isFamousAuthor: true, recommendedScore: 0.96 },
  { id: "c15", name: "The Elegant Universe", creator: "Brian Greene", category: "Science" },
  // Design
  { id: "c16", name: "The Design of Everyday Things", creator: "Don Norman", category: "Design", popular: true, isFamousAuthor: true, recommendedScore: 0.89 },
  { id: "c17", name: "Refactoring UI", creator: "Adam Wathan & Steve Schoger", category: "Design", popular: true },
  { id: "c18", name: "Don't Make Me Think", creator: "Steve Krug", category: "Design" },
  { id: "c19", name: "Grid Systems in Graphic Design", creator: "Josef Müller-Brockmann", category: "Design" },
  { id: "c20", name: "Designing Interfaces", creator: "Jenifer Tidwell", category: "Design", popular: true },
  // AI
  { id: "c21", name: "Life 3.0", creator: "Max Tegmark", category: "AI", popular: true, recommendedScore: 0.75 },
  { id: "c22", name: "Superintelligence", creator: "Nick Bostrom", category: "AI", isFamousAuthor: true },
  { id: "c23", name: "The Alignment Problem", creator: "Brian Christian", category: "AI", popular: true, recommendedScore: 0.80 },
  { id: "c24", name: "Human Compatible", creator: "Stuart Russell", category: "AI" },
  { id: "c25", name: "AI Superpowers", creator: "Kai-Fu Lee", category: "AI", popular: true },
]

export const mockFriendCourses: CatalogCourse[] = [
  { id: "f1", name: "Thinking, Fast and Slow", creator: "Daniel Kahneman", category: "Psychology", popular: true, sharedByFriend: "Alex M." },
  { id: "f2", name: "The Art of Strategy", creator: "Avinash K. Dixit", category: "Business", sharedByFriend: "Mia K." },
  { id: "f3", name: "Atomic Habits", creator: "James Clear", category: "Psychology", popular: true, sharedByFriend: "Jordan T.", recommendedScore: 0.92 },
  { id: "f4", name: "Deep Work", creator: "Cal Newport", category: "Learning", sharedByFriend: "Alex M." },
  { id: "f5", name: "The Structure of Scientific Revolutions", creator: "Thomas Kuhn", category: "Science", sharedByFriend: "Sam R." },
]

export const mockPublishedCourses: CatalogCourse[] = [
  { id: "p1", name: "Intro to Product Thinking", creator: "You", category: "Business", isPublishedByUser: true },
  { id: "p2", name: "Design Systems for Startups", creator: "You", category: "Design", isPublishedByUser: true },
  { id: "p3", name: "Behavioral Psychology in UX", creator: "You", category: "Psychology", isPublishedByUser: true },
]

export const mockCourseOutline: CourseOutline = {
  courseId: "5",
  name: "Mental Models for Product Strategy",
  description:
    "Master core mental models like First Principles and Inversion to build defensible product roadmaps and prioritize high-impact features.",
  creator: "Shane Parrish",
  estimatedMinutes: 20,
  dailyGoalMinutes: 10,
  sections: [
    {
      id: "s1",
      title: "Core Models",
      lessons: [
        { id: "s1-l1", title: "First Principles" },
        { id: "s1-l2", title: "Inversion Thinking" },
      ],
    },
    {
      id: "s2",
      title: "Strategic Planning",
      lessons: [
        { id: "s2-l1", title: "Roadmap Strategy" },
        { id: "s2-l2", title: "Impact Prioritization" },
      ],
    },
  ],
}

/** Mock learning paths keyed by course id */
export const mockLearningPaths: Record<string, LearningPath> = {
  "1": {
    courseId: "1",
    courseName: "Bio-Optimized Nutrition for Peak Energy",
    sections: [
      {
        id: "lp1-s1",
        title: "Nutrition Foundations",
        doneLessons: 1,
        totalLessons: 3,
        lessons: [
          { id: "lp1-s1-l1", title: "Macronutrient Basics", status: "active" },
          { id: "lp1-s1-l2", title: "Micronutrient Essentials", status: "pending" },
          { id: "lp1-s1-l3", title: "Hydration Science", status: "pending" },
          { id: "lp1-s1-r", title: "Section Review", status: "locked", isReview: true, reviewProgress: "0/3 sessions" },
        ],
      },
      {
        id: "lp1-s2",
        title: "Meal Timing & Energy",
        doneLessons: 0,
        totalLessons: 3,
        lessons: [
          { id: "lp1-s2-l1", title: "Circadian Eating", status: "pending" },
          { id: "lp1-s2-l2", title: "Pre- & Post-Workout Fuel", status: "pending" },
          { id: "lp1-s2-l3", title: "Fasting Windows", status: "pending" },
          { id: "lp1-s2-r", title: "Section Review", status: "locked", isReview: true, reviewProgress: "0/3 sessions" },
        ],
      },
    ],
  },
  "3": {
    courseId: "3",
    courseName: "Hooked for Hardware Onboarding",
    sections: [
      {
        id: "lp3-s1",
        title: "Hook Model Basics",
        doneLessons: 3,
        totalLessons: 3,
        lessons: [
          { id: "lp3-s1-l1", title: "Trigger Design", status: "active" },
          { id: "lp3-s1-l2", title: "Action Simplification", status: "active" },
          { id: "lp3-s1-l3", title: "Variable Rewards", status: "active" },
          { id: "lp3-s1-r", title: "Section Review", status: "pending", isReview: true, reviewProgress: "0/3 sessions" },
        ],
      },
      {
        id: "lp3-s2",
        title: "Hardware Applications",
        doneLessons: 0,
        totalLessons: 3,
        lessons: [
          { id: "lp3-s2-l1", title: "Onboarding Friction", status: "pending" },
          { id: "lp3-s2-l2", title: "Physical-Digital Bridges", status: "pending" },
          { id: "lp3-s2-l3", title: "Retention Loops", status: "locked" },
          { id: "lp3-s2-r", title: "Section Review", status: "locked", isReview: true, reviewProgress: "0/3 sessions" },
        ],
      },
    ],
  },
}

/** Fallback: generate a generic learning path from any Course */
export function generateLearningPath(course: Course): LearningPath {
  const lessonsPerSection = 3
  const sectionCount = Math.max(1, Math.ceil(course.totalLessons / lessonsPerSection))
  let remaining = course.totalLessons
  let done = course.doneLessons

  const sections: LearningPath["sections"] = Array.from({ length: sectionCount }, (_, si) => {
    const count = Math.min(lessonsPerSection, remaining)
    remaining -= count
    const sectionDone = Math.min(done, count)
    done -= sectionDone

    const lessons: LearningPath["sections"][0]["lessons"] = Array.from({ length: count }, (_, li) => {
      const lessonDone = li < sectionDone
      const isNext = li === sectionDone && sectionDone < count
      return {
        id: `gen-s${si}-l${li}`,
        title: `Lesson ${si * lessonsPerSection + li + 1}`,
        status: lessonDone ? "active" as const : isNext ? "pending" as const : "locked" as const,
      }
    })

    lessons.push({
      id: `gen-s${si}-r`,
      title: "Section Review",
      status: "locked",
      isReview: true,
      reviewProgress: `0/${count} sessions`,
    })

    return {
      id: `gen-s${si}`,
      title: `Section ${si + 1}`,
      doneLessons: sectionDone,
      totalLessons: count,
      lessons,
    }
  })

  return { courseId: course.id, courseName: course.name, sections }
}
