import Link from "next/link"
import { Github, FileText, Twitter, Ghost } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center mr-2">
              <Ghost className="h-5 w-5 text-purple-500" />
            </div>
            <span className="font-serif text-lg text-slate-800 dark:text-white">GhostTX</span>
          </div>

          <div className="flex space-x-6 mb-6 md:mb-0">
            <Link
              href="https://github.com/cadalt0/GhostTx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://pepper-beaufort-d3d.notion.site/GhostTX-Documentation-18b19f511dce80938e25fa5a6c22e42e"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="sr-only">Docs</span>
            </Link>
            <Link
              href="https://x.com/Ghost_TX_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
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
