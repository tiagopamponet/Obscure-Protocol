import { ArrowRight } from "lucide-react"

export default function BlockchainCouponSection() {
  return (
    <section id="blockchain-coupon" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">From chain to charm</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Your transaction enters the GhostTX cloak and reappears as a redeemable digital scroll
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-200/30 via-mint-200/30 to-coral-200/30 rounded-3xl blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-purple-500">1</span>
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Deposit</h3>
            <p className="text-slate-600 dark:text-slate-300">Send your SOL to the GhostTX vault</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-purple-300" />
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center">
            <div className="bg-mint-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-mint-500">2</span>
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Cloak</h3>
            <p className="text-slate-600 dark:text-slate-300">Your transaction is anonymized</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-purple-300" />
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-pink-500">3</span>
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Mint Coupon</h3>
            <p className="text-slate-600 dark:text-slate-300">Receive a redeemable digital scroll</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-purple-300" />
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center">
            <div className="bg-coral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-coral-500">4</span>
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Redeem or Gift</h3>
            <p className="text-slate-600 dark:text-slate-300">Use or share your coupon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
