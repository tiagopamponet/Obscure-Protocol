import Image from "next/image"

export default function WhatIsSection() {
  return (
    <section id="what-is" className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-mint-200/30 to-lavender-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/2ndscroll.webp?height=350&width=450"
              alt="Ghost cloak wrapping a Solana coin"
              width={500}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Transfer value without a trace
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            GhostTX lets you move assets anonymously across the Solana blockchain — wrapped in a soft cloak of privacy
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Instead of direct transfers, your SOL enters a secure pool and re-emerges elsewhere, unlinkable and
            untraceable
          </p>
          <p className="text-xl text-purple-500 dark:text-purple-400 font-medium italic">
            "You send. We vanish. They receive."
          </p>
        </div>
      </div>
    </section>
  )
}
