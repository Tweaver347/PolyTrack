import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm ${className}`}>{children}</div>
}

interface CardSectionProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardSectionProps) {
  return <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: CardSectionProps) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

export function CardContent({ children, className = '' }: CardSectionProps) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: CardSectionProps) {
  return <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}