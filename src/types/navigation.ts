import { PageMetadata } from './page'

export interface NavigationSection {
  type: string            // Category slug (e.g., 'messaging')
  name: string            // Display name (e.g., 'Messaging Widget')
  links: NavigationLink[]
}

export interface NavigationLink {
  icon: string
  id: string
  name: string
  url?: string            // For external links
  path?: string           // For internal routes
  title: string
  description: string
  external?: boolean
}

export function pageMetadataToNavigationLink(page: PageMetadata): NavigationLink {
  return {
    icon: page.icon,
    id: page.id,
    name: page.name,
    url: page.external ? page.url : undefined,
    path: page.external ? undefined : page.path,
    title: page.title,
    description: page.description,
    external: page.external,
  }
}
