import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary'
  className?: string
}

/**
 * A small badge used to display status or categories. There are two
 * variants: default (solid colour) and secondary (muted background).
 */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  const variantClasses =
    variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      : 'bg-poly-blue text-white'
  return <span className={clsx(base, variantClasses, className)}>{children}</span>
}