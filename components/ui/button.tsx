import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button. The default style has a filled
   * background. Outline style uses a transparent background with a
   * border. Ghost style is text only.
   */
  variant?: 'default' | 'outline' | 'ghost'
  /** Size of the button. */
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantClasses =
    variant === 'outline'
      ? 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
      : variant === 'ghost'
        ? 'bg-transparent text-poly-blue hover:bg-poly-blue/10'
        : 'bg-poly-blue text-white hover:bg-poly-blue/90'
  const sizeClasses =
    size === 'sm'
      ? 'text-sm px-2.5 py-1.5'
      : size === 'lg'
        ? 'text-base px-5 py-3'
        : 'text-sm px-4 py-2'
  return (
    <button className={clsx(base, variantClasses, sizeClasses, className)} {...props} />
  )
}