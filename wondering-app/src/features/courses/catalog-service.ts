import type { CatalogCourse, CatalogFetchParams, CatalogFetchResult } from "./types"
import { mockCatalogCourses, mockFriendCourses, mockPublishedCourses, recommendedCatalogIds } from "./mock-data"

let userPublishedCourses: CatalogCourse[] = [...mockPublishedCourses]

export function registerPublishedCourse(course: CatalogCourse): void {
  userPublishedCourses.push(course)
}

export function unregisterPublishedCourse(courseId: string): void {
  userPublishedCourses = userPublishedCourses.filter((c) => c.id !== courseId)
}

/**
 * Fetch catalog courses with tab-based filtering, category, and search.
 *
 * Equivalent REST endpoint:
 *   GET /api/catalog/courses?tab={tab}&category={category}&search={search}
 *
 * Response shape: { courses: CatalogCourse[], categories: string[] }
 *
 * - When search is empty: tab → category → return
 * - When search is set: search across ALL tabs and genres, then apply tab filter, then category filter
 */
export async function fetchCatalogCourses(
  params: CatalogFetchParams
): Promise<CatalogFetchResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  const tabDataset = getBaseDataset(params.tab)
  const hasSearch = Boolean(params.search?.trim())

  let courses: CatalogCourse[]

  if (hasSearch) {
    const q = params.search!.toLowerCase()
    const searchMatches = (c: CatalogCourse) =>
      c.name.toLowerCase().includes(q) ||
      c.creator.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)

    const allSearchable = getAllSearchableCourses()
    const searchResults = allSearchable.filter(searchMatches)

    const tabIds = new Set(tabDataset.map((c) => c.id))
    courses = searchResults.filter((c) => tabIds.has(c.id))

    if (params.category && params.category !== "All") {
      courses = courses.filter((c) => c.category === params.category)
    }
  } else {
    courses = [...tabDataset]
    if (params.category && params.category !== "All") {
      courses = courses.filter((c) => c.category === params.category)
    }
  }

  const categories = deriveCategories(tabDataset)

  return { courses, categories }
}

function getAllSearchableCourses(): CatalogCourse[] {
  const seen = new Set<string>()
  const result: CatalogCourse[] = []
  const tabs: CatalogFetchParams["tab"][] = [
    "recommended",
    "all",
    "famous-authors",
    "my-friends",
    "my-published",
  ]
  for (const tab of tabs) {
    for (const c of getBaseDataset(tab)) {
      if (seen.has(c.id)) continue
      seen.add(c.id)
      result.push(c)
    }
  }
  return result
}

function getBaseDataset(tab: CatalogFetchParams["tab"]): CatalogCourse[] {
  switch (tab) {
    case "recommended":
      return mockCatalogCourses.filter((c) =>
        (recommendedCatalogIds as readonly string[]).includes(c.id)
      )
    case "all":
      return [...mockCatalogCourses]
    case "famous-authors":
      return mockCatalogCourses.filter((c) => c.isFamousAuthor)
    case "my-friends":
      return [...mockFriendCourses]
    case "my-published":
      return [...userPublishedCourses]
  }
}

function deriveCategories(courses: CatalogCourse[]): string[] {
  const seen = new Set<string>()
  for (const c of courses) {
    seen.add(c.category)
  }
  return ["All", ...Array.from(seen).sort().filter((c) => c !== "For You")]
}
