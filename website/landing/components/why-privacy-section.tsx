import Image from "next/image"
import { Shield, Gift, TrendingUp } from "lucide-react"

export default function WhyPrivacySection() {
  return (
    <section
      id="why-privacy"
      className="py-24 bg-gradient-to-br from-white to-lavender-50 dark:from-slate-900 dark:to-purple-950/50 rounded-3xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Why Privacy Matters
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Privacy protects freedom. Whether you're gifting, donating, rewarding, or simply organizing your finances —
            not everything needs to be public.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">Prevent wallet tracing</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Keep your financial activity private from prying eyes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Gift className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">
                  Keep gift sources hidden
                </h3>
                <p className="text-slate-600 dark:text-slate-400">Send gifts without revealing your identity.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-mint-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-mint-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">
                  Avoid deal front-running
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Prevent others from seeing and acting on your transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/3rdscroll.webp?height=400&width=500"
              alt="Anime character covering a scroll"
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
