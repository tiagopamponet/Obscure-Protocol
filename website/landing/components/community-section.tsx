import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github, BookOpen, Users } from "lucide-react"
import Link from "next/link"

export default function CommunitySection() {
  return (
    <section
      id="community"
      className="py-24 bg-gradient-to-br from-white to-lavender-50 dark:from-slate-900 dark:to-purple-950/30 rounded-3xl"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Community & Trust</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          GhostTX is open for collaboration. Join our quest to bring real privacy and utility to Solana — peacefully,
          responsibly, and creatively.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-200/30 via-mint-200/30 to-coral-200/30 rounded-3xl blur-3xl"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-4">Join Our Community</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Connect with like-minded privacy advocates and developers. Share ideas, contribute code, or simply stay
                updated on the latest developments.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="https://github.com/cadalt0/GhostTx" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub
                </Button>
              </Link>
              <Link href="https://x.com/Ghost_TX_" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2 text-[#1DA1F2] dark:text-[#1DA1F2]/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  Twitter
                </Button>
              </Link>
              <Link href="https://pepper-beaufort-d3d.notion.site/GhostTX-Documentation-18b19f511dce80938e25fa5a6c22e42e" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Documentation
                </Button>
              </Link>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Discord
              </Button>
            </div>
          </div>

          <div className="relative h-64 md:h-auto rounded-xl overflow-hidden">
            <Image
              src="/team.jpg?height=300&width=400"
              alt="Shrine courtyard with ghosts holding scrolls"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* <div className="mt-16 text-center">
        <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-4">What Powers the Cloak</h3>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-32 h-16 bg-white/80 dark:bg-slate-800/80 rounded-lg flex items-center justify-center"
            >
              <div className="w-24 h-8 bg-slate-200/50 dark:bg-slate-700/50 rounded"></div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  )
}
