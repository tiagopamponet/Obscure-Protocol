import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FinalCtaSection() {
  return (
    <section id="final-cta" className="py-32">
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 via-mint-200/40 to-pink-200/40 rounded-3xl blur-3xl"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Ready to Vanish?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Make your next transaction disappear — and reappear as something more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="https://whisper.ghosttx.me/">
                <Button 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-purple-200/50 dark:from-purple-600 dark:to-pink-600 dark:shadow-purple-900/30"
                >
                  Whisper
                </Button>
              </Link>
              <Link href="https://t.me/cadalt" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto rounded-xl dark:border-slate-700 dark:text-slate-300"
                >
                  Support
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/spell.jpg?height=400&width=500"
              alt="Calm lake with a ghost cloak floating above"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
