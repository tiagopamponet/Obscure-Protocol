import Image from "next/image"

export default function BehindCloakSection() {
  return (
    <section id="behind-cloak" className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            The art of disappearance, backed by Solana.
          </h2>

          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              <span className="font-medium text-purple-500 dark:text-purple-400">•</span> Users deposit fixed amounts of
              SOL into a shared smart contract vault
            </p>
            <p className="leading-relaxed">
              <span className="font-medium text-purple-500 dark:text-purple-400">•</span> Withdrawals later happen to
              unrelated addresses
            </p>
            <p className="leading-relaxed">
              <span className="font-medium text-purple-500 dark:text-purple-400">•</span> Since amounts are identical
              and randomized, it's nearly impossible to trace who sent what
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-4">Technical Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900">
                <p className="text-slate-700 dark:text-slate-300">Solana smart contracts</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-mint-100 dark:border-mint-900">
                <p className="text-slate-700 dark:text-slate-300">Optional coupon expiry logic</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-pink-100 dark:border-pink-900">
                <p className="text-slate-700 dark:text-slate-300">Fixed-value mixing design</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-mint-200/30 to-lavender-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/vault.jpg?height=400&width=500"
              alt="Blueprint scroll or ghost-over-vault diagram"
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
