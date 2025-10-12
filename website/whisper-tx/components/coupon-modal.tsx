"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scroll } from "lucide-react"

interface CouponModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CouponModal({ open, onOpenChange }: CouponModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[500px] rounded-2xl bg-gradient-to-b from-white to-violet-50 dark:from-slate-900 dark:to-violet-950 border border-violet-100 dark:border-violet-900 shadow-lg shadow-violet-200/20 dark:shadow-violet-900/20">
        <div className="absolute inset-0 bg-charm-pattern opacity-[0.03] rounded-2xl pointer-events-none"></div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-serif text-center text-slate-800 dark:text-white flex items-center justify-center gap-2">
            My Coupons
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-300 font-zen">
            All your cloaked scrolls in one secret vault
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 py-4 space-y-6">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Scroll className="h-16 w-16 text-violet-400 dark:text-violet-500 mb-4 opacity-70" />
            <h3 className="text-xl font-serif text-violet-800 dark:text-violet-300 mb-3">Coming Soon</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              GhostTX will soon let you view, verify, and manage all your crypto coupons in one private dashboard.
            </p>

            <div className="w-full text-left space-y-2 mb-6">
              <h4 className="text-sm font-medium text-violet-700 dark:text-violet-400">✨ Features planned:</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 pl-4">
                <li>• View active + expired coupons</li>
                <li>• Redeem directly from vault</li>
                <li>• Get notified before coupon expiry</li>
                <li>• Filter by amount, expiry, and status</li>
              </ul>
            </div>

            <p className="text-sm italic text-slate-500 dark:text-slate-400">
              Your scrolls are resting quietly — check back soon to summon them.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full border-violet-200 dark:border-violet-800"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
