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

export interface ShareLinkData {
  courseId: string
  courseName: string
  creator: string
  description: string
  previewImageUrl?: string
  shareUrl: string
}
