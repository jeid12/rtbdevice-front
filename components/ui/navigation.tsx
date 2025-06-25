import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavigationMenuProps {
  items: NavItem[]
  className?: string
}

export function NavigationMenu({ items, className }: NavigationMenuProps) {
  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex items-center space-x-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
            {item.badge && (
              <span className="rounded-full bg-rtb-secondary px-2 py-1 text-xs text-white">
                {item.badge}
              </span>
            )}
          </div>
        </Link>
      ))}
    </nav>
  )
}

interface SidebarProps {
  items: NavItem[]
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  return (
    <aside className={cn("w-64 bg-card border-r border-border", className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-rtb-primary mb-4">Navigation</h2>
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-rtb-secondary px-2 py-1 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
