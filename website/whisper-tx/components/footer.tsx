import Link from "next/link"
import { Github, FileText, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center mr-2">
              <span className="text-purple-800 dark:text-purple-200 font-serif text-sm">裏</span>
            </div>
            <span className="font-serif text-lg text-slate-800 dark:text-white">GhostTX</span>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <Link
              href="#"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="sr-only">Docs</span>
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Discord</span>
            </Link>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} GhostTX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
