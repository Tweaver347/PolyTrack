import { cn } from "@/lib/utils"

export function ColorSwatch({ color, className }: { color: string; className?: string }) {
  return (
    <div className={cn("h-6 w-6 rounded-full border border-gray-300", className)} style={{ backgroundColor: color }} />
  )
}
