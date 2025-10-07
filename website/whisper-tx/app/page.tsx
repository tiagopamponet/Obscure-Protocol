import { Header } from "@/components/header"
import { HomeCards } from "@/components/home-cards"
import { LearnSection } from "@/components/learn-section"
import { FaqAccordion } from "@/components/faq-accordion"
import { SecuritySection } from "@/components/security-section"
import { Footer } from "@/components/footer"
import { SummonGhostButton } from "@/components/summon-ghost-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-slate-950 dark:to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-sakura-pattern opacity-[0.05] pointer-events-none z-0"></div>
      <Header />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-800 dark:text-white mb-4">
            Whisper a Transaction Into the Chain
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-zen">
            Send or redeem your SOL in silence — no identity, no trail.
          </p>
        </div>

        <HomeCards />

        <div className="mt-24 space-y-24">
          <LearnSection />
          <FaqAccordion />
          <SecuritySection />
        </div>
      </div>

      <Footer />
      <SummonGhostButton />
    </main>
  )
}
