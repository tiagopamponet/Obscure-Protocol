"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function SummonGhostButton() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false)
      }, 3000) // Hide after 3 seconds
      return () => clearTimeout(timer)
    }
  }, [showPopup])

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowPopup(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 animate-pulse-slow"
        >
          <span className="text-2xl">👻</span>
          <span className="sr-only">Summon Ghost</span>
        </Button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-[40vh] opacity-15 animate-ghost-float">👻</div>
        </div>
      )}
    </>
  )
}
