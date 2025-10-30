"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DepositModal } from "@/components/deposit-modal"
import { WithdrawModal } from "@/components/withdraw-modal"
import { CouponModal } from "@/components/coupon-modal"

export function HomeCards() {
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [couponOpen, setCouponOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-purple-100 dark:border-purple-900 rounded-2xl overflow-hidden group hover:shadow-md hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 transition-all duration-300">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-serif text-purple-800 dark:text-purple-300">🧧</span>
            </div>
            <h3 className="text-xl font-serif text-slate-800 dark:text-white mb-3">
            Cloak Your Transaction
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
            Offer SOL under the cloak of anonymity. A one-time charm will be your only echo.
            </p>
            <Button
              onClick={() => setDepositOpen(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Deposit Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-purple-100 dark:border-purple-900 rounded-2xl overflow-hidden group hover:shadow-md hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 transition-all duration-300">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-serif text-indigo-800 dark:text-indigo-300">🌀	</span>
            </div>
            <h3 className="text-xl font-serif text-slate-800 dark:text-white mb-3">
            Return from the Mist
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
            Whisper your code. The chain will remember your offering — and return it silently.
            </p>
            <Button
              onClick={() => setWithdrawOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
            >
              Withdraw Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-purple-100 dark:border-purple-900 rounded-2xl overflow-hidden group hover:shadow-md hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 transition-all duration-300">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-serif text-violet-800 dark:text-violet-300">📜</span>
            </div>
            <h3 className="text-xl font-serif text-slate-800 dark:text-white mb-3">Whispers Remembered</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
            Each code is a trace of a silent offering. Revisit the ones you've kept cloaked.
            </p>
            <Button
              onClick={() => setCouponOpen(true)}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            >
              Check Coupon
            </Button>
          </CardContent>
        </Card>
      </div>

      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <CouponModal open={couponOpen} onOpenChange={setCouponOpen} />
    </>
  )
}
