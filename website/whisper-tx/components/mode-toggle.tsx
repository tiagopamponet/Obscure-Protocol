"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <span className="sr-only">Toggle theme</span>
        <div className="h-5 w-5"></div>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative h-9 w-9 overflow-hidden transition-all duration-300"
    >
      <span className="sr-only">Toggle theme</span>
      <Sun
        className={`h-5 w-5 absolute transition-all duration-500 ${
          theme === "dark" ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
        }`}
      />
      <Moon
        className={`h-5 w-5 absolute transition-all duration-500 ${
          theme === "dark" ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      />
    </Button>
  )
}
