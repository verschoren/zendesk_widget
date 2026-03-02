import { ComponentType } from 'react'

export interface PageMetadata {
  id: string              // Unique page identifier (e.g., 'authentication')
  category: string        // Category slug (e.g., 'messaging', 'classic')
  categoryName: string    // Display name for category (e.g., 'Messaging Widget')
  name: string            // Page display name (e.g., 'Authentication')
  icon: string            // Emoji icon for the page
  path: string            // Route path (e.g., '/messaging/authentication')
  title: string           // Page title for SEO
  description: string     // Page description for SEO
  external?: boolean      // Whether this is an external link
  url?: string            // External URL if applicable
  component?: ComponentType  // React component for the page
  parentId?: string       // Optional parent navigation item ID (for nested navigation)
}

export interface PageModule {
  metadata: PageMetadata
  default: ComponentType
}
