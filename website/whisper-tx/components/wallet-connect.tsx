"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Users } from "lucide-react"

interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      isConnected: boolean;
      publicKey: { toString(): string } | null;
      on(event: "connect" | "disconnect" | "accountChanged", callback: (publicKey: { toString(): string } | null) => void): void;
      removeListener(event: "connect" | "disconnect" | "accountChanged", callback: (publicKey: { toString(): string } | null) => void): void;
    };
  };
}

export function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkPhantom = async () => {
      try {
        const phantom = (window as PhantomWindow).phantom?.solana
        if (phantom?.isConnected) {
          const publicKey = phantom.publicKey?.toString()
          if (publicKey) {
            setConnected(true)
            setAddress(publicKey)
          } else {
            await phantom.disconnect()
            setConnected(false)
            setAddress("")
          }
        }
      } catch (error) {
        console.error("Error checking wallet status:", error)
        setConnected(false)
        setAddress("")
      }
    }

    checkPhantom()

    const handleConnect = (publicKey: { toString(): string } | null) => {
      const pk = publicKey?.toString()
      if (pk) {
        setConnected(true)
        setAddress(pk)
      }
    }

    const handleDisconnect = () => {
      setConnected(false)
      setAddress("")
    }

    const handleAccountChange = (publicKey: { toString(): string } | null) => {
      const pk = publicKey?.toString()
      if (pk) {
        setConnected(true)
        setAddress(pk)
      } else {
        setConnected(false)
        setAddress("")
      }
    }

    const phantom = (window as PhantomWindow).phantom?.solana
    phantom?.on("connect", handleConnect)
    phantom?.on("disconnect", handleDisconnect)
    phantom?.on("accountChanged", handleAccountChange)

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      phantom?.removeListener("connect", handleConnect)
      phantom?.removeListener("disconnect", handleDisconnect)
      phantom?.removeListener("accountChanged", handleAccountChange)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMounted])

  const connectWallet = async () => {
    if (!isMounted) return
    try {
      const phantom = (window as PhantomWindow).phantom?.solana
      if (!phantom) {
        window.open("https://phantom.app/", "_blank")
        return
      }

      if (phantom.isConnected) {
        await phantom.disconnect()
      }

      const { publicKey } = await phantom.connect()
      setConnected(true)
      setAddress(publicKey.toString())
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setConnected(false)
      setAddress("")
    }
  }

  const disconnectWallet = async () => {
    if (!isMounted) return
    try {
      const phantom = (window as PhantomWindow).phantom?.solana
      if (phantom) {
        await phantom.disconnect()
        setConnected(false)
        setAddress("")
        setShowMenu(false)
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const changeAccount = async () => {
    if (!isMounted) return
    try {
      const phantom = (window as PhantomWindow).phantom?.solana
      if (phantom) {
        await phantom.disconnect()
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { publicKey } = await phantom.connect()
        if (publicKey) {
          setConnected(true)
          setAddress(publicKey.toString())
          setShowMenu(false)
        }
      }
    } catch (error) {
      console.error("Failed to change account:", error)
      setConnected(false)
      setAddress("")
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connected) {
      setShowMenu(!showMenu)
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="relative overflow-hidden group transition-all duration-300 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
      >
        <Wallet className="h-4 w-4 mr-2 text-purple-700 dark:text-purple-400" />
        <span className="relative z-10 text-slate-800 dark:text-slate-200">
          Connect Wallet
        </span>
      </Button>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        onClick={connected ? toggleMenu : connectWallet}
        className="relative overflow-hidden group transition-all duration-300 border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-pink-100/30 dark:from-purple-900/30 dark:to-pink-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Wallet className="h-4 w-4 mr-2 text-purple-700 dark:text-purple-400" />
        <span className="relative z-10 text-slate-800 dark:text-slate-200">
          {connected ? formatAddress(address) : "Connect Wallet"}
        </span>
      </Button>

      {showMenu && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-purple-100 dark:border-purple-800 overflow-hidden z-50">
          <div 
            className="p-2 flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors duration-200 border-b border-purple-100 dark:border-purple-800"
            onClick={changeAccount}
          >
            <Users className="h-4 w-4" />
            <span>Change Account</span>
          </div>
          <div 
            className="p-2 flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-200"
            onClick={disconnectWallet}
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple provider component that just renders its children
export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
