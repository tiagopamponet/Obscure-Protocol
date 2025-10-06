import Image from "next/image"
import { Lightbulb, Lock, Clock } from "lucide-react"

export default function CouponShowcaseSection() {
  return (
    <section
      id="coupon-showcase"
      className="py-24 bg-gradient-to-br from-white to-pink-50 dark:from-slate-900 dark:to-pink-950/30 rounded-3xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Every hidden transfer becomes a charm
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            GhostTX converts your anonymous deposits into onchain-secured crypto coupons — unique digital scrolls that
            hold value.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Lightbulb className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Onchain verification</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Every coupon is secured and verified by Solana's blockchain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-mint-100 p-3 rounded-lg">
                <Lock className="h-6 w-6 text-mint-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">One-time use</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Coupons can only be redeemed once, ensuring security.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-coral-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-coral-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Optional expiry</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Set time limits for redemption to add urgency or security
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/onchain.jpg?height=400&width=500"
              alt="Glowing coupon scroll with QR code"
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
