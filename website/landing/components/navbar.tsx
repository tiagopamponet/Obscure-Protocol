"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Ghost className="h-6.6 w-6.6 text-purple-500" />
          <span className="font-medium text-lg text-slate-800 dark:text-slate-100">GhostTX</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#what-is" className="text-slate-600 hover:text-purple-500 transition-colors">
            About
          </Link>
          <Link href="#features" className="text-slate-600 hover:text-purple-500 transition-colors">
            Features
          </Link>
          <Link href="#use-cases" className="text-slate-600 hover:text-purple-500 transition-colors">
            Use Cases
          </Link>
          <Link href="#community" className="text-slate-600 hover:text-purple-500 transition-colors">
            Community
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="https://whisper.ghosttx.me/">
            <Button 
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white border-none dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700"
            >
              Whisper
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
