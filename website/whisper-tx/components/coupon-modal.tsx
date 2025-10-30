"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scroll } from "lucide-react"
import { useState, useEffect } from "react"
import { SavedCoupons } from "./saved-coupons"

// Extend the existing Window interface
interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      isConnected: boolean;
      publicKey: { toString(): string } | null;
      on(event: "connect" | "disconnect" | "accountChanged", callback: (publicKey: { toString(): string } | null) => void): void;
      removeListener(event: "connect" | "disconnect" | "accountChanged", callback: (publicKey: { toString(): string } | null) => void): void;
      signMessage(message: Uint8Array, display?: string): Promise<{ signature: Uint8Array }>;
    };
  };
}

interface CouponModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CouponModal({ open, onOpenChange }: CouponModalProps) {
  const [showSavedCoupons, setShowSavedCoupons] = useState(false)
  const [coupons, setCoupons] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [signedWallet, setSignedWallet] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [displayedCoupons, setDisplayedCoupons] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const COUPONS_PER_PAGE = 5

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkPhantom = async () => {
      try {
        const phantom = (window as PhantomWindow).phantom?.solana
        if (phantom?.isConnected) {
          const pk = phantom.publicKey?.toString()
          if (pk) {
            setPublicKey(pk)
            // If wallet changed, clear signed state
            if (signedWallet && signedWallet !== pk) {
              setSignedWallet(null)
              setShowSavedCoupons(false)
            }
          }
        }
      } catch (error) {
        console.error("Error checking wallet status:", error)
        setPublicKey(null)
        setSignedWallet(null)
        setShowSavedCoupons(false)
      }
    }

    checkPhantom()

    const handleConnect = (publicKey: { toString(): string } | null) => {
      const pk = publicKey?.toString()
      if (pk) {
        setPublicKey(pk)
        // If wallet changed, clear signed state
        if (signedWallet && signedWallet !== pk) {
          setSignedWallet(null)
          setShowSavedCoupons(false)
        }
      }
    }

    const handleDisconnect = () => {
      setPublicKey(null)
      setSignedWallet(null)
      setShowSavedCoupons(false)
    }

    const handleAccountChange = (publicKey: { toString(): string } | null) => {
      const pk = publicKey?.toString()
      if (pk) {
        setPublicKey(pk)
        // If wallet changed, clear signed state
        if (signedWallet && signedWallet !== pk) {
          setSignedWallet(null)
          setShowSavedCoupons(false)
        }
      } else {
        setPublicKey(null)
        setSignedWallet(null)
        setShowSavedCoupons(false)
      }
    }

    const phantom = (window as PhantomWindow).phantom?.solana
    phantom?.on("connect", handleConnect)
    phantom?.on("disconnect", handleDisconnect)
    phantom?.on("accountChanged", handleAccountChange)

    return () => {
      phantom?.removeListener("connect", handleConnect)
      phantom?.removeListener("disconnect", handleDisconnect)
      phantom?.removeListener("accountChanged", handleAccountChange)
    }
  }, [isMounted, signedWallet])

  useEffect(() => {
    if (publicKey && showSavedCoupons && signedWallet === publicKey) {
      fetchCoupons()
    }
  }, [publicKey, showSavedCoupons, signedWallet])

  const fetchCoupons = async () => {
    if (!publicKey || !signedWallet || publicKey !== signedWallet) return
    setLoading(true)
    try {
      const response = await fetch(`https://ghosttx-d9440cd585bc.herokuapp.com/api/get-codes/${publicKey}`, {
        headers: {
          'X-Wallet-Address': publicKey,
          'X-Signed-Wallet': signedWallet
        }
      })
      const data = await response.json()
      const allCoupons = data.codes || {}
      setCoupons(allCoupons)
      
      // Get first page of coupons
      const firstPageCoupons = Object.entries(allCoupons)
        .slice(0, COUPONS_PER_PAGE)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
      setDisplayedCoupons(firstPageCoupons)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setCoupons({})
      setDisplayedCoupons({})
    }
    setLoading(false)
  }

  const loadMore = () => {
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * COUPONS_PER_PAGE
    const endIndex = startIndex + COUPONS_PER_PAGE
    
    const newCoupons = Object.entries(coupons)
      .slice(startIndex, endIndex)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    
    setDisplayedCoupons(prev => ({ ...prev, ...newCoupons }))
    setCurrentPage(nextPage)
  }

  const hasMore = Object.keys(coupons).length > Object.keys(displayedCoupons).length

  const handleSignIn = async () => {
    if (!isMounted) return
    const phantom = (window as PhantomWindow).phantom?.solana
    if (!phantom) {
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      if (!phantom.isConnected) {
        await phantom.connect()
      }

      const currentWallet = phantom.publicKey?.toString()
      if (!currentWallet) {
        throw new Error("No wallet connected")
      }
      
      const message = `Sign in to view your saved coupons for wallet: ${currentWallet}`
      const encodedMessage = new TextEncoder().encode(message)
      
      try {
        const { signature } = await phantom.signMessage(encodedMessage, "utf8")
        if (signature) {
          setSignedWallet(currentWallet)
          setShowSavedCoupons(true)
        } else {
          throw new Error("No signature received")
        }
      } catch (signError) {
        console.error('Error signing message:', signError)
        if (signError instanceof Error) {
          if (signError.message.includes("User rejected")) {
            throw new Error("You rejected the signature request")
          }
        }
        throw new Error("Failed to sign message. Please try again.")
      }
    } catch (error) {
      console.error('Error in handleSignIn:', error)
      setSignedWallet(null)
      setShowSavedCoupons(false)
      // You might want to show an error message to the user here
    }
  }

  if (!isMounted) {
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
              <h3 className="text-xl font-serif text-violet-800 dark:text-violet-300 mb-3">
                Loading...
              </h3>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (showSavedCoupons && signedWallet === publicKey) {
    return (
      <SavedCoupons
        open={open}
        onOpenChange={(newOpen) => {
          setShowSavedCoupons(false)
          onOpenChange(newOpen)
        }}
        coupons={displayedCoupons}
        isLoading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    )
  }

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
            <h3 className="text-xl font-serif text-violet-800 dark:text-violet-300 mb-3">
              Sign in to View Coupons
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Sign a message with your wallet to view your saved coupons.
            </p>

            <Button
              onClick={handleSignIn}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!(window as PhantomWindow).phantom?.solana}
            >
              Sign Message
            </Button>
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
