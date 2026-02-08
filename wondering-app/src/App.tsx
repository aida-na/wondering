import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { CoursesPage } from "@/features/courses/courses-page"
import { SharedCoursePage } from "@/features/courses/shared-course-page"
import { CoursePreviewPage } from "@/features/courses/course-preview-page"
import { CourseCatalogPage } from "@/features/courses/course-catalog-page"
import { CreatePage } from "@/features/create/create-page"
import { ToastContainer } from "@/components/ui/toast"
import type { CatalogCourse, Course } from "@/features/courses/types"

type Page = "home" | "create" | "courses" | "profile" | "shared-course" | "course-catalog" | "course-preview"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("courses")
  const [catalogReturnTo, setCatalogReturnTo] = useState<"courses" | "create" | null>(null)
  const [catalogCourseForCreate, setCatalogCourseForCreate] = useState<CatalogCourse | null>(null)
  const [newCourseForList, setNewCourseForList] = useState<Course | null>(null)

  const handleBrowseCatalog = () => {
    setCatalogReturnTo("create")
    setCurrentPage("course-catalog")
  }

  const handleCatalogSelect = (course: CatalogCourse) => {
    if (catalogReturnTo === "create") {
      setCatalogCourseForCreate(course)
      setCatalogReturnTo(null)
      setCurrentPage("create")
    } else {
      setCurrentPage("course-preview")
    }
  }

  const handleCatalogClose = () => {
    if (catalogReturnTo === "create") {
      setCatalogReturnTo(null)
      setCurrentPage("create")
    } else {
      setCurrentPage("courses")
    }
  }

  const handleCreateComplete = (course: Course) => {
    setCatalogCourseForCreate(null)
    setNewCourseForList(course)
    setCurrentPage("courses")
  }

  const handleConsumedNewCourse = () => {
    setNewCourseForList(null)
  }

  return (
    <div className="theme-v2 inter-font flex h-screen bg-surface text-text-primary">
      {/* Shared course page is full-screen, no sidebar/nav */}
      {currentPage === "shared-course" ? (
        <SharedCoursePage
          isLoggedIn={true}
          onNavigateToLibrary={() => setCurrentPage("courses")}
        />
      ) : (
        <>
          <Sidebar
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
          <main className="flex-1 overflow-auto">
            {currentPage === "courses" && (
              <CoursesPage
                onOpenPreview={() => { setCatalogReturnTo("courses"); setCurrentPage("course-catalog") }}
                newCourse={newCourseForList}
                onConsumedNewCourse={handleConsumedNewCourse}
              />
            )}
            {currentPage === "course-catalog" && (
              <CourseCatalogPage
                onClose={handleCatalogClose}
                onSelectCourse={handleCatalogSelect}
              />
            )}
            {currentPage === "course-preview" && (
              <CoursePreviewPage onBack={() => setCurrentPage("course-catalog")} />
            )}
            {currentPage === "create" && (
              <CreatePage
                onBrowseCatalog={handleBrowseCatalog}
                onComplete={handleCreateComplete}
                catalogCourse={catalogCourseForCreate}
              />
            )}
            {currentPage === "home" && (
              <div className="flex h-full items-center justify-center">
                <p className="text-text-tertiary">Home — select Courses to see the sharing feature</p>
              </div>
            )}
            {currentPage === "profile" && (
              <div className="flex h-full items-center justify-center">
                <p className="text-text-tertiary">Profile — select Courses to see the sharing feature</p>
              </div>
            )}
          </main>
          <BottomNav
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page as Page)}
          />
        </>
      )}

      {/* Demo toggle for shared course page */}
      {currentPage !== "shared-course" && (
        <button
          onClick={() => setCurrentPage("shared-course")}
          className="fixed bottom-16 right-4 md:bottom-4 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-text-primary shadow-lg hover:bg-brand-hover transition-colors z-50"
        >
          Preview: Open Shared Link
        </button>
      )}

      <ToastContainer />
    </div>
  )
}

export default App
