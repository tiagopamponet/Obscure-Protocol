import { Ghost, Ticket, Zap, Puzzle } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-white to-mint-50 dark:from-slate-900 dark:to-emerald-950/30 rounded-3xl"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">Features</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          GhostTX combines privacy, utility, and ease of use in one elegant solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Ghost className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-3">Cloaked Transfers</h3>
          <p className="text-slate-600 dark:text-slate-300">No trace, no link between sender and receiver.</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-mint-100 dark:border-mint-900 hover:shadow-md transition-shadow">
          <div className="bg-mint-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Ticket className="h-8 w-8 text-mint-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-3">Crypto Coupons</h3>
          <p className="text-slate-600 dark:text-slate-300">Redeemable, tradable digital scrolls that hold value.</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-pink-100 dark:border-pink-900 hover:shadow-md transition-shadow">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-3">Fast & Cheap</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Built on Solana for lightning-fast transactions at minimal cost.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-coral-100 dark:border-coral-900 hover:shadow-md transition-shadow">
          <div className="bg-coral-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Puzzle className="h-8 w-8 text-coral-500" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-3">Plug & Play</h3>
          <p className="text-slate-600 dark:text-slate-300">
            Works seamlessly with wallets and dApps in the Solana ecosystem.
          </p>
        </div>
      </div>
    </section>
  )
}
