import { NavigationSection, pageMetadataToNavigationLink } from '@/types/navigation'
import { PageMetadata } from '@/types/page'

// This will be imported from pageRegistry once it's generated
// For now, we export a function that takes pages as input
export function buildNavigation(pages: PageMetadata[]): NavigationSection[] {
  const grouped = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = {
        type: page.category,
        name: page.categoryName,
        links: []
      }
    }
    acc[page.category].links.push(pageMetadataToNavigationLink(page))
    return acc
  }, {} as Record<string, NavigationSection>)

  return Object.values(grouped)
}

// Helper to get navigation with pages from registry
export function getNavigation(): NavigationSection[] {
  // This will be updated to import from pageRegistry after generation
  return []
}
