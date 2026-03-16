import { NavigationSection, NavigationLink, pageMetadataToNavigationLink } from '@/types/navigation'
import { PageMetadata } from '@/types/page'

// Define the desired order of categories
const CATEGORY_ORDER = [
  'messaging',
  'classic',
  'proactive',
  'answerbot',
  'storage'
]

// This will be imported from pageRegistry once it's generated
// For now, we export a function that takes pages as input
export function buildNavigation(pages: PageMetadata[]): NavigationSection[] {
  // First, group pages by category
  const grouped = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = {
        type: page.category,
        name: page.categoryName,
        links: []
      }
    }

    // Only add non-child pages directly to the category
    if (!page.parentId) {
      acc[page.category].links.push(pageMetadataToNavigationLink(page))
    }

    return acc
  }, {} as Record<string, NavigationSection>)

  // Now handle parent-child relationships
  // For pages with parentId, add them as children to their parent
  pages.forEach(page => {
    if (page.parentId) {
      // Find the parent link in the appropriate category
      const categorySection = grouped[page.category]
      if (categorySection) {
        const parentLink = categorySection.links.find(link => link.id === page.parentId)

        if (parentLink) {
          // Initialize children array if it doesn't exist
          if (!parentLink.children) {
            parentLink.children = []
          }

          // Add the child page
          parentLink.children.push(pageMetadataToNavigationLink(page))
        }
      }
    }
  })

  // Add virtual navigation links for proactive messaging variations
  if (grouped['proactive']) {
    const proactiveSection = grouped['proactive']

    // Find the Contact link and add VIP Contact after it
    const contactIndex = proactiveSection.links.findIndex(link => link.id === 'proactive-contact')
    if (contactIndex !== -1) {
      proactiveSection.links.splice(contactIndex + 1, 0, {
        id: 'proactive-contact-vip',
        icon: '👑',
        name: 'VIP Contact',
        path: '/proactive/contact#vip',
        title: 'Proactive Messaging - VIP',
        description: 'Demo page to showcase the Proactive Messaging for VIP customers'
      })
    }

    // Find the Product link and add Product Campaign after it
    const productIndex = proactiveSection.links.findIndex(link => link.id === 'proactive-product')
    if (productIndex !== -1) {
      proactiveSection.links.splice(productIndex + 1, 0, {
        id: 'proactive-product-campaign',
        icon: '🦕',
        name: 'Product with Campaign',
        path: '/proactive/product?utm_campaign=trex',
        title: 'Proactive Messaging - Product Campaign',
        description: 'Demo page with UTM campaign parameter'
      })
    }
  }

  // Sort by the defined order
  return CATEGORY_ORDER
    .map(category => grouped[category])
    .filter(Boolean) // Remove undefined entries
}

// Helper to get navigation with pages from registry
export function getNavigation(): NavigationSection[] {
  // This will be updated to import from pageRegistry after generation
  return []
}
