"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Scroll, Shield, Database, Lock } from "lucide-react"

export function LearnSection() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="text-center">
        <h2 className="text-3xl font-serif text-slate-800 dark:text-white mb-6">How It Works</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          GhostTX uses advanced cryptography to ensure your transactions remain private and unlinkable.
        </p>

        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Learn More
        </Button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90%] md:max-w-[700px] rounded-2xl bg-gradient-to-b from-white to-pink-50 dark:from-slate-900 dark:to-purple-950 border border-purple-100 dark:border-purple-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center text-slate-800 dark:text-white">
              How GhostTX Works
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-300 font-zen">
              Understanding the privacy mechanics behind your transactions
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Scroll className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-serif text-lg text-slate-800 dark:text-white">How deposits work</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
              When you deposit SOL, it’s sent to a Program Derived Address (PDA) on the Solana blockchain, and a unique, one-time coupon code is generated onchain. You can store this coupon securely (encrypted).


              </p>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-serif text-lg text-slate-800 dark:text-white">What is a coupon?</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                A coupon is a cryptographically secure one-time code that proves you have the right to withdraw funds
                from the pool. It's like a bearer bond - whoever has the code can redeem the funds. The coupon has no
                connection to your original deposit address.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Database className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-serif text-lg text-slate-800 dark:text-white">Where is your data stored?</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                GhostTX doesn't store any user data. The only data stored on-chain is a cryptographic hash of your
                coupon code, which cannot be reversed to find your code. If you choose to save your coupons, they're
                encrypted and only accessible with your wallet.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-serif text-lg text-slate-800 dark:text-white">How we maintain unlinkability</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                By using fixed amounts and a common pool, all deposits and withdrawals look identical on-chain. There's
                no way to connect a specific deposit to a specific withdrawal. The coupon code is the only link, and
                it's only known to you.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
