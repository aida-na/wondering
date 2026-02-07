import type { Course, ShareLinkData } from "./types"

const BASE_URL = "https://wondering.app"

export function generateShareLink(
  course: Course,
  sharedByName = "Someone"
): ShareLinkData {
  const shareUrl = `${BASE_URL}/course/shared/${course.id}`
  const description = course.name

  return {
    courseId: course.id,
    courseName: course.name,
    creator: course.creator,
    description,
    shareUrl,
  }
}

const isMobile = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export async function shareCourse(shareData: ShareLinkData): Promise<"shared" | "copied"> {
  // Use native share sheet only on mobile (iOS/Android)
  if (isMobile() && navigator.share) {
    try {
      await navigator.share({
        title: shareData.courseName,
        text: shareData.description,
        url: shareData.shareUrl,
      })
      return "shared"
    } catch (err) {
      if ((err as DOMException).name === "AbortError") {
        return "copied"
      }
    }
  }

  // Web: always copy to clipboard — description + link
  const clipboardText = `${shareData.description}\n${shareData.shareUrl}`
  await navigator.clipboard.writeText(clipboardText)
  return "copied"
}

/**
 * Check if a course already exists in the user's library.
 * In production this would be an API call.
 */
export function checkCourseExists(
  courseId: string,
  userCourses: Course[]
): boolean {
  return userCourses.some((c) => c.id === courseId)
}

/**
 * Accept a shared course — adds it to the user's library with fresh progress.
 * In production this would be a POST to the backend.
 */
export function acceptSharedCourse(
  courseName: string,
  creator: string,
  totalLessons: number
): Course {
  return {
    id: crypto.randomUUID(),
    name: courseName,
    creator,
    status: "Not Started",
    doneLessons: 0,
    totalLessons,
    createdAt: new Date().toISOString().split("T")[0],
    isShared: true,
    shareCount: 0,
  }
}
