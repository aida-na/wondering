import type { Course, CourseOutline } from "./types"

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
