import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// Adjust this value to match your header height (e.g., 64px for typical headers)
const HEADER_HEIGHT = 64;

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center pb-16 overflow-hidden mt-16"
    >
      {/* Background image for laptop screens */}
      <div className="hidden lg:block absolute inset-0 w-full h-full z-0">
        <Image
          src="/3rd.png"
          alt="Background wallpaper"
          fill
          priority
          className="object-cover w-full h-full"
          quality={100}
          sizes="100vw"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="order-2 lg:order-1">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400 dark:from-purple-400 dark:to-pink-300">
              GhostTX
            </span>
          </h1>
          <p className="text-sm italic flex items-center gap-2 mb-6 text-slate-600 dark:text-slate-400">
            <span>Built on</span>
            <Image
              src="/solanaLogo.svg?height=20&width=100"
              alt="Solana logo"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </p>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Whisper your transactions into the chain — and let it travel unseen
          </p>
          <Link href="https://whisper.ghosttx.me/">
            <Button 
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-purple-200/50 dark:from-purple-600 dark:to-pink-600 dark:shadow-purple-900/30"
            >
              Whisper
            </Button>
          </Link>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/2st.png"
              alt="Anime-style scene with floating Solana blocks covered by a ghost cloak"
              width={600}
              height={500}
              className="rounded-xl lg:hidden"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
