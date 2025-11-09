"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Copy, ArrowLeft } from "lucide-react"
import { PublicKey } from "@solana/web3.js"
import { handleDeposit, type DepositProgress, RefundProcessedError } from "@/scripts/deposit"
import { useToast } from "@/components/ui/use-toast"

interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      isConnected: boolean;
      publicKey: { toString(): string } | null;
      on(event: "connect" | "disconnect", callback: () => void): void;
      removeListener(event: "connect" | "disconnect", callback: () => void): void;
    };
  };
}

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DepositStep =
  | "select-amount"
  | "sending-to-contract"
  | "waiting-for-pda"
  | "generating-code"
  | "writing-proof"
  | "refunding"
  | "complete"
  | "refunded"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("0.001")
  const [step, setStep] = useState<DepositStep>("select-amount")
  const [saveCode, setSaveCode] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refundSignature, setRefundSignature] = useState<string | null>(null)
  const [memoFailed, setMemoFailed] = useState(false)

  // Check wallet connection on mount and when modal opens
  useEffect(() => {
    const checkWallet = async () => {
      const phantom = (window as PhantomWindow).phantom?.solana
      if (phantom?.isConnected) {
        const pk = phantom.publicKey
        if (pk) {
          setPublicKey(new PublicKey(pk.toString()))
          setConnected(true)
        }
      } else {
        setConnected(false)
        setPublicKey(null)
      }
    }
    checkWallet()

    // Add event listeners for wallet connection changes
    const handleConnect = () => {
      const phantom = (window as PhantomWindow).phantom?.solana
      const pk = phantom?.publicKey
      if (pk) {
        setPublicKey(new PublicKey(pk.toString()))
        setConnected(true)
      }
    }

    const handleDisconnect = () => {
      setConnected(false)
      setPublicKey(null)
    }

    const phantom = (window as PhantomWindow).phantom?.solana
    phantom?.on("connect", handleConnect)
    phantom?.on("disconnect", handleDisconnect)

    return () => {
      phantom?.removeListener("connect", handleConnect)
      phantom?.removeListener("disconnect", handleDisconnect)
    }
  }, [open])

  const handleDepositClick = async () => {
    if (!publicKey) return
    setError(null)
    setMemoFailed(false)

    try {
      const result = await handleDeposit(publicKey, (progress) => {
        setStep(progress.step)
        if (progress.couponCode) {
          setCouponCode(progress.couponCode)
        }
        if (progress.step === "refunding") {
          setMemoFailed(true)
        }
      })
      if (result && typeof result === 'object' && 'refundSignature' in result) {
        setRefundSignature(result.refundSignature)
        setStep("refunded")
        return
      }
      setRefundSignature(null)
    } catch (error) {
      console.error("Deposit failed:", error)
      toast({
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "An error occurred during deposit",
        variant: "destructive"
      })
      setStep("select-amount")
    }
  }

  const resetModal = () => {
    setStep("select-amount")
    setAmount("0.001")
    setSaveCode(false)
    setCouponCode("")
    setIsSaved(false)
    setSaveError(null)
    setIsSaving(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(resetModal, 300)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[600px] rounded-2xl bg-gradient-to-b from-white to-pink-50 dark:from-slate-900 dark:to-purple-950 border border-purple-100 dark:border-purple-800 shadow-lg shadow-purple-200/20 dark:shadow-purple-900/20">
        <div className="absolute inset-0 bg-sakura-pattern opacity-[0.03] rounded-2xl pointer-events-none"></div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-serif text-center text-slate-800 dark:text-white flex items-center justify-center gap-2">
            {step === "select-amount" && "👻 Deposit Your SOL"}
            {step !== "select-amount" && step !== "complete" && "Processing Your Deposit"}
            {step === "complete" && "✨ Deposit Complete"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-300 font-zen">
            {step === "select-amount" && "Let your assets vanish peacefully into the chain"}
            {step !== "select-amount" && step !== "complete" && "Your transaction is being processed..."}
            {step === "complete" && "Your one-time coupon code has been generated"}
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 py-4">
          {step === "select-amount" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Choose amount</h3>
                <RadioGroup defaultValue={amount} onValueChange={setAmount} className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="0.001" id="amount-1" className="peer sr-only" />
                    <Label
                      htmlFor="amount-1"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-slate-900/50 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/30 peer-data-[state=checked]:border-purple-500 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:bg-purple-50 dark:[&:has([data-state=checked])]:bg-purple-900/30 transition-all duration-200"
                    >
                      0.001 SOL
                    </Label>
                  </div>
                  <div className="relative group">
                    <RadioGroupItem value="0.1" id="amount-2" className="peer sr-only" disabled />
                    <Label
                      htmlFor="amount-2"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-slate-900/50 p-4 opacity-50 cursor-not-allowed"
                    >
                      0.1 SOL
                    </Label>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-xl">
                      <span className="text-white text-sm">Coming Soon</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <RadioGroupItem value="1" id="amount-3" className="peer sr-only" disabled />
                    <Label
                      htmlFor="amount-3"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-purple-100 dark:border-purple-900 bg-white/50 dark:bg-slate-900/50 p-4 opacity-50 cursor-not-allowed"
                    >
                      1 SOL
                    </Label>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-xl">
                      <span className="text-white text-sm">Coming Soon</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                This transaction will be unlinkable.
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handleDepositClick}
                disabled={!connected || !publicKey}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
              >
                {!connected ? "Connect Wallet to Deposit" : "Deposit Anonymously"}
              </Button>
            </div>
          )}

          {step !== "select-amount" && step !== "complete" && step !== "refunded" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className={`flex items-center space-x-3 ${["sending-to-contract","waiting-for-pda","generating-code","writing-proof","refunding"].includes(step) ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"}`}>
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {["sending-to-contract","waiting-for-pda","generating-code","writing-proof","refunding"].includes(step) ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </div>
                    <span>Requesting SOL...</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${["waiting-for-pda","generating-code","writing-proof","refunding"].includes(step) ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"}`}>
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {["waiting-for-pda","generating-code","writing-proof","refunding"].includes(step) ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </div>
                    <span>Sending to contract...</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${["generating-code","writing-proof","refunding"].includes(step) ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"}`}>
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {["generating-code","writing-proof","refunding"].includes(step) ? <Check className="h-3 w-3" /> : null}
                    </div>
                    <span>Generating one-time code...</span>
                  </div>

                  <div className={`flex items-center space-x-3 ${memoFailed ? "text-red-600 dark:text-red-400" : (["writing-proof","refunding"].includes(step) ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-600")}`}>
                    <div className={`w-6 h-6 rounded-full border-2 ${memoFailed ? "border-red-600 dark:border-red-400" : "border-current"} flex items-center justify-center`}>
                      {memoFailed ? (
                        <span className="text-red-600 dark:text-red-400 font-bold text-lg">&#10005;</span>
                      ) : (["writing-proof","refunding"].includes(step) ? <Check className="h-3 w-3" /> : null)}
                    </div>
                    <span>Writing on-chain proof...</span>
                  </div>

                  {(["refunding"].includes(step) || memoFailed) && (
                    <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                      <div className="w-6 h-6 rounded-full border-2 border-red-600 dark:border-red-400 flex items-center justify-center">
                        <span className="font-bold text-lg">&#8635;</span>
                      </div>
                      <span>Processing refund...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-500 dark:border-t-purple-400 animate-spin"></div>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl transition-colors duration-200 ${
                isCopied 
                  ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800'
              } border text-center`}>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Here's your coupon code:</div>
                <div className="font-mono text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">
                  {couponCode}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy Code
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-code"
                  checked={saveCode || isSaved}
                  disabled={isSaving || isSaved}
                  onCheckedChange={async (checked) => {
                    if (isSaved) {
                      setSaveCode(false);
                      setIsSaved(false);
                      return;
                    }
                    
                    setSaveCode(checked as boolean);
                    setSaveError(null);
                    
                    if (checked && publicKey && couponCode) {
                      setIsSaving(true);
                      try {
                        const response = await fetch(`${API_URL}/api/save-code`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            walletAddress: publicKey.toString(),
                            code: couponCode,
                            amount: parseFloat(amount)
                          })
                        });

                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to save code');
                        }

                        const data = await response.json();
                        if (!data.success) {
                          throw new Error('Failed to save code');
                        }
                        
                        setIsSaved(true);
                      } catch (error) {
                        console.error("Error saving code:", error);
                        setSaveError(error instanceof Error ? error.message : 'Failed to save code');
                        setSaveCode(false);
                      } finally {
                        setIsSaving(false);
                      }
                    }
                  }}
                />
                <Label htmlFor="save-code" className="text-sm text-slate-700 dark:text-slate-300">
                  {isSaving ? 'Saving...' : isSaved ? '📜 Saved ' : 'Save your redeem code , later accessed by wallet sign in'}
                </Label>
                {saveError && (
                  <div className="text-sm text-red-500 mt-1">
                    {saveError}
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
                You must keep this code safe. It can only be used once.
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-purple-200 dark:border-purple-800"
                  onClick={handleClose}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={resetModal}
                >
                  New Deposit
                </Button>
              </div>
            </div>
          )}

          {step === "refunded" && (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Refund Processed</div>
                <div className="text-slate-700 dark:text-slate-300 mb-2">
                  There was a problem processing your deposit.<br />Your funds have been returned. Please try again.
                </div>
                {refundSignature && (
                  <a
                    href={`https://explorer.solana.com/tx/${refundSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-purple-700 dark:text-purple-300 underline text-sm"
                  >
                    View Refund on Explorer
                  </a>
                )}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={() => { setStep("select-amount"); setRefundSignature(null); }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
