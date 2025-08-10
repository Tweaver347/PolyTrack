import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle: string
  icon: LucideIcon
}

export function PageHeader({ title, subtitle, icon: _Icon }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}
