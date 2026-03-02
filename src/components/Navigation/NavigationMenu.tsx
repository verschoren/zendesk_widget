import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { pages } from '@/lib/pageRegistry'
import { buildNavigation } from '@/lib/navigation'
import { NavigationLink } from '@/types/navigation'

interface NavigationMenuProps {
  onLinkClick?: () => void
}

export default function NavigationMenu({ onLinkClick }: NavigationMenuProps) {
  const location = useLocation()
  const navigation = buildNavigation(pages)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(new Set())

  // Auto-expand the section containing the current page
  useEffect(() => {
    const currentPage = pages.find(page => page.path === location.pathname)
    if (currentPage) {
      setExpandedSections(prev => new Set(prev).add(currentPage.category))
      // If page has a parent, expand the parent too
      if (currentPage.parentId) {
        setExpandedChildren(prev => new Set(prev).add(currentPage.parentId))
      }
    }
  }, [location.pathname])

  const toggleSection = (type: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const toggleChild = (id: string) => {
    setExpandedChildren(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderLink = (link: NavigationLink, level = 0) => {
    const isActive = location.pathname === link.path
    const hasChildren = link.children && link.children.length > 0
    const isExpanded = expandedChildren.has(link.id)

    const linkClasses = `flex gap-x-3 rounded-md p-2 text-sm leading-6 ${
      isActive
        ? 'bg-lime text-licorice'
        : 'text-licorice dark:text-white hover:text-licorice hover:bg-matcha'
    }`

    if (hasChildren) {
      return (
        <li key={link.id}>
          <div
            className={`flex justify-between items-center rounded-md p-2 text-sm leading-6 cursor-pointer ${
              isActive
                ? 'bg-lime text-licorice'
                : 'text-licorice dark:text-white hover:text-licorice hover:bg-matcha'
            }`}
            onClick={() => toggleChild(link.id)}
          >
            <span className="truncate">{link.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            >
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
          {isExpanded && (
            <ul role="list" className="ml-4 mt-1 space-y-1">
              {link.children!.map(child => renderLink(child, level + 1))}
            </ul>
          )}
        </li>
      )
    }

    if (link.external) {
      return (
        <li key={link.id}>
          <a
            href={link.url}
            className={linkClasses}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="truncate">{link.name}</span>
          </a>
        </li>
      )
    }

    return (
      <li key={link.id}>
        <Link
          to={link.path!}
          className={linkClasses}
          onClick={onLinkClick}
        >
          <span className="truncate">{link.name}</span>
        </Link>
      </li>
    )
  }

  return (
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      {navigation.map((section) => (
        <li key={section.type}>
          <div
            className="text-sm font-semibold leading-6 text-licorice dark:text-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(section.type)}
          >
            {section.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-5 h-5 transition-transform ${expandedSections.has(section.type) ? 'rotate-90' : ''}`}
            >
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
          {expandedSections.has(section.type) && (
            <ul role="list" className="-mx-2 mt-2 space-y-1 ml-4">
              {section.links.map(link => renderLink(link))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
