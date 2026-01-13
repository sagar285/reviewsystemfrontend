"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Waves, Sunset } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  // Fallback UI if DropdownMenu is not available (since we didn't confirm it's installed)
  // But wait, the user asked for "mult theme specially user can selected".
  // Let's assume we might not have DropdownMenu installed. 
  // I'll create a simple accessible list of buttons for now to be safe and robust.
  
  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
    { name: "ocean", icon: Waves, label: "Ocean" },
    { name: "sunset", icon: Sunset, label: "Sunset" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-background/50 backdrop-blur-sm rounded-full border border-border shadow-sm">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.name
        return (
          <Button
            key={t.name}
            variant={isActive ? "default" : "ghost"}
            size="icon"
            onClick={() => setTheme(t.name)}
            className={`rounded-full w-8 h-8 transition-all ${isActive ? 'scale-110 shadow-md' : 'hover:scale-110'}`}
            title={t.label}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{t.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
