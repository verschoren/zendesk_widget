import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary'

interface BaseProps {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
    href?: never
    to?: never
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    as: 'a'
    href: string
    to?: never
  }

type ButtonAsRouterLink = BaseProps &
  Omit<LinkProps, 'className' | 'children'> & {
    as: 'link'
    to: string
    href?: never
  }

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-matcha dark:bg-shamrock text-licorice dark:text-white hover:bg-lime dark:hover:bg-cactus',
  secondary: 'bg-white dark:bg-licorice text-licorice dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  as = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (as === 'a') {
    const { href, ...anchorProps } = props as ButtonAsLink
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  if (as === 'link') {
    const { to, ...linkProps } = props as ButtonAsRouterLink
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
