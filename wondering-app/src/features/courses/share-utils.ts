import type { Course, ShareLinkData } from "./types"

const BASE_URL = "https://wondering.app"

export function generateShareLink(
  course: Course,
  sharedByName = "Someone"
): ShareLinkData {
  const shareUrl = `${BASE_URL}/course/shared/${course.id}`
  const description = `${sharedByName} is inviting you to check out the "${course.name}" course on Wondering`

  return {
    courseId: course.id,
    courseName: course.name,
    creator: course.creator,
    description,
    shareUrl,
  }
}

export async function shareCourse(shareData: ShareLinkData): Promise<"shared" | "copied"> {
  // Use Web Share API on supported platforms (iOS Safari, etc.)
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareData.courseName,
        text: shareData.description,
        url: shareData.shareUrl,
      })
      return "shared"
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if ((err as DOMException).name === "AbortError") {
        return "copied" // user cancelled, don't show error
      }
    }
  }

  // Fallback: copy to clipboard (web) — include description + link
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
