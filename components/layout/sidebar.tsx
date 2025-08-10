"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, Cpu, Gauge, List, Package, Settings, ChevronLeft, ChevronRight, Printer, ScanLine } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/machines", label: "Machines", icon: Cpu },
  { href: "/storage", label: "Storage", icon: Package },
  { href: "/nfc-pairing", label: "NFC Pairing", icon: ScanLine },
  { href: "/logs", label: "Logs", icon: List },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "sticky top-0 left-0 h-screen bg-poly-dark text-white flex flex-col transition-all duration-300 ease-in-out z-50",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Printer className="h-8 w-8 text-poly-blue" />
              <span className="text-xl font-heading font-bold">PolyTrack</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-700">
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-700",
                  isActive ? "bg-poly-blue text-white" : "text-gray-300",
                  isCollapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }
            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
