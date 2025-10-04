import Image from "next/image"
import { Gift, Sparkles, Ticket, Coins } from "lucide-react"

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Use Cases</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Discover the many ways GhostTX can enhance your privacy and experience on Solana.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="flex gap-6">
          <div className="bg-purple-100 p-4 h-fit rounded-xl">
            <Gift className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-3">Secret Gifting</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Send crypto gifts to friends, family, or colleagues without revealing your wallet address.
            </p>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="/gift.png?height=200&width=300"
                alt="Secret gifting illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="bg-mint-100 p-4 h-fit rounded-xl flex items-center justify-center">
            <span className="text-3xl">🪶</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-3">Featherlight Send</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No slippage. No signal. Just a pure 1:1 handoff cloaked in silence
            </p>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="/feather.png?height=200&width=300"
                alt="Airdrop illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="bg-pink-100 p-4 h-fit rounded-xl flex items-center justify-center">
            <span className="text-3xl">🧭</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-3">Ghost Route</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Send from one wallet to another through the cloak — no one sees the origin.
            </p>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="/route.jpg?height=200&width=300"
                alt="Private ticketing illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="bg-coral-100 p-4 h-fit rounded-xl">
            <Coins className="h-8 w-8 text-coral-500" />
          </div>
          <div>
            <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-200 mb-3">Anonymous Donations</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Support causes you care about without revealing your identity or donation amount.
            </p>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="/donation.jpg?height=200&width=300"
                alt="Anonymous donations illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
