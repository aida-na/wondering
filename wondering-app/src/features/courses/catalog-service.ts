import type { CatalogCourse, CatalogFetchParams, CatalogFetchResult } from "./types"
import { mockCatalogCourses, mockFriendCourses, mockPublishedCourses } from "./mock-data"

/**
 * Fetch catalog courses with tab-based filtering, category, and search.
 *
 * Equivalent REST endpoint:
 *   GET /api/catalog/courses?tab={tab}&category={category}&search={search}
 *
 * Response shape: { courses: CatalogCourse[], categories: string[] }
 *
 * Filter pipeline: tab (base dataset) → category → search → return
 */
export async function fetchCatalogCourses(
  params: CatalogFetchParams
): Promise<CatalogFetchResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300))

  let courses = getBaseDataset(params.tab)

  // Category filter
  if (params.category && params.category !== "For You" && params.category !== "All") {
    courses = courses.filter((c) => c.category === params.category)
  }

  // Search filter
  if (params.search?.trim()) {
    const q = params.search.toLowerCase()
    courses = courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.creator.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }

  // Derive available categories from unfiltered tab dataset (before category/search)
  const allTabCourses = getBaseDataset(params.tab)
  const categories = deriveCategories(allTabCourses)

  return { courses, categories }
}

function getBaseDataset(tab: CatalogFetchParams["tab"]): CatalogCourse[] {
  switch (tab) {
    case "recommended":
      return [...mockCatalogCourses]
        .filter((c) => c.recommendedScore != null)
        .sort((a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0))
    case "all":
      return [...mockCatalogCourses]
    case "famous-authors":
      return mockCatalogCourses.filter((c) => c.isFamousAuthor)
    case "my-friends":
      return [...mockFriendCourses]
    case "my-published":
      return [...mockPublishedCourses]
  }
}

function deriveCategories(courses: CatalogCourse[]): string[] {
  const seen = new Set<string>()
  for (const c of courses) {
    seen.add(c.category)
  }
  return ["For You", ...Array.from(seen).sort()]
}
