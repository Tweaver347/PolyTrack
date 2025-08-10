import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle: string
  icon: LucideIcon
}

/**
 * The page header displays a title with an icon and a subtitle underneath.
 * It is used at the top of each page to provide context about the
 * content. Icons are passed in from lucide-react.
 */
export default function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon className="h-6 w-6 text-poly-blue" />
        {title}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}