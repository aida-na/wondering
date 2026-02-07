export type CourseStatus = "In Progress" | "Not Started" | "Completed"

export interface Course {
  id: string
  name: string
  creator: string
  status: CourseStatus
  doneLessons: number
  totalLessons: number
  createdAt: string // ISO date
  isShared: boolean
  shareCount: number
}

export interface Lesson {
  id: string
  title: string
}

export interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

export interface CourseOutline {
  courseId: string
  name: string
  description: string
  creator: string
  sections: Section[]
  estimatedMinutes: number
  dailyGoalMinutes: number
}

export interface CatalogCourse {
  id: string
  name: string
  creator: string
  category: string
  popular?: boolean
}

export interface ShareLinkData {
  courseId: string
  courseName: string
  creator: string
  description: string
  previewImageUrl?: string
  shareUrl: string
}
