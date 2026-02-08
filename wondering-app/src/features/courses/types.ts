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

export type LessonStatus = "active" | "pending" | "locked"

export interface LearningLesson {
  id: string
  title: string
  status: LessonStatus
  isReview?: boolean
  reviewProgress?: string // e.g. "0/3 sessions"
}

export interface LearningSection {
  id: string
  title: string
  doneLessons: number
  totalLessons: number
  lessons: LearningLesson[]
}

export interface LearningPath {
  courseId: string
  courseName: string
  sections: LearningSection[]
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
  isFamousAuthor?: boolean
  sharedByFriend?: string
  isPublishedByUser?: boolean
  recommendedScore?: number
}

export type CatalogTab =
  | "recommended"
  | "all"
  | "famous-authors"
  | "my-friends"
  | "my-published"

export interface CatalogFetchParams {
  tab: CatalogTab
  category?: string
  search?: string
}

export interface CatalogFetchResult {
  courses: CatalogCourse[]
  categories: string[]
}

export interface ShareLinkData {
  courseId: string
  courseName: string
  creator: string
  description: string
  previewImageUrl?: string
  shareUrl: string
}
