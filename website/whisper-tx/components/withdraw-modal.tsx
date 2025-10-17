"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowLeft } from "lucide-react"
import { PublicKey } from "@solana/web3.js"
import { handleWithdraw, WithdrawProgress } from "@/scripts/withdraw"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type WithdrawStep =
  | "enter-code"
  | "validating-code"
  | "matching-deposit"
  | "initiating-withdrawal"
  | "sending-funds"
  | "complete"

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const [couponCode, setCouponCode] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [step, setStep] = useState<WithdrawStep>("enter-code")
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string>("")

  const handleWithdrawClick = async () => {
    if (!couponCode || !walletAddress) return
    setError(null)

    try {
      const recipient = new PublicKey(walletAddress)
      
      const onProgress = (progress: WithdrawProgress) => {
        switch (progress.step) {
          case "verifying-code":
            setStep("validating-code")
            break
          case "checking-memo":
            setStep("matching-deposit")
            break
          case "withdrawing":
            setStep("initiating-withdrawal")
            break
          case "complete":
            setStep("complete")
            setSignature(progress.signature || "")
            break
        }
      }

      await handleWithdraw(couponCode, recipient, onProgress)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed")
      setStep("enter-code")
    }
  }

  const resetModal = () => {
    setStep("enter-code")
    setCouponCode("")
    setError(null)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(resetModal, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[600px] rounded-2xl bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-indigo-950 border border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-200/20 dark:shadow-indigo-900/20">
        <div className="absolute inset-0 bg-wave-pattern opacity-[0.03] rounded-2xl pointer-events-none"></div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-serif text-center text-slate-800 dark:text-white flex items-center justify-center gap-2">
            {step === "enter-code" && "Withdraw Your SOL"}
            {step !== "enter-code" && step !== "complete" && "Processing Your Withdrawal"}
            {step === "complete" && "✨ Withdrawal Complete"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-300 font-zen">
            {step === "enter-code" && "Redeem your value from the silent cloak"}
            {step !== "enter-code" && step !== "complete" && "Your transaction is being processed..."}
            {step === "complete" && "Your funds have been sent to your wallet"}
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 py-4">
          {step === "enter-code" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enter Coupon Code
                  </Label>
                  <Input
                    id="coupon-code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter your code"
                    className="bg-white/50 dark:bg-slate-900/50 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300 dark:focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-address" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Wallet Address to Receive Funds
                  </Label>
                  <Input
                    id="wallet-address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-white/50 dark:bg-slate-900/50 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300 dark:focus:border-indigo-600"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                One-time use only. Ensure address is correct.
              </div>

              <Button
                onClick={handleWithdrawClick}
                disabled={!couponCode || !walletAddress}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white disabled:opacity-50"
              >
                Redeem Now
              </Button>
            </div>
          )}

          {step !== "enter-code" && step !== "complete" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div
                    className={`flex items-center space-x-3 ${step === "validating-code" || step === "matching-deposit" || step === "initiating-withdrawal" || step === "sending-funds" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {step === "validating-code" ||
                      step === "matching-deposit" ||
                      step === "initiating-withdrawal" ||
                      step === "sending-funds" ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </div>
                    <span>Verifying Deposit...</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${step === "matching-deposit" || step === "initiating-withdrawal" || step === "sending-funds" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {step === "matching-deposit" || step === "initiating-withdrawal" || step === "sending-funds" ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </div>
                    <span>Validating code...</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${step === "initiating-withdrawal" || step === "sending-funds" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {step === "initiating-withdrawal" || step === "sending-funds" ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </div>
                    <span>Initiating withdrawal...</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 ${step === "sending-funds" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {step === "sending-funds" ? <Check className="h-3 w-3" /> : null}
                    </div>
                    <span>Sending funds from PDA...</span>
                  </div>
                </div>
              </div>

              <div className="h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-center">
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Funds sent to:</div>
                <div className="font-mono text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                  {walletAddress}
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">
                  Transaction complete! 0.001 SOL has been transferred.
                  {signature && (
                    <>
                      {" "}
                      <span>View on Explorer: </span>
                      <a
                        href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-500"
                        style={{ wordBreak: "break-all" }}
                      >
                        {signature}
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                Success! This coupon is now marked as used.
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                GhostTX ensures no link between the original deposit and this withdrawal.
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-indigo-200 dark:border-indigo-800"
                  onClick={handleClose}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                  onClick={resetModal}
                >
                  Verify Another Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
