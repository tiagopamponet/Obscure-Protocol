"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Users } from "lucide-react"

declare global {
  interface Window {
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
}

export function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkPhantom = async () => {
      try {
        if (window.phantom?.solana?.isConnected) {
          const publicKey = window.phantom.solana.publicKey?.toString()
          if (publicKey) {
            setConnected(true)
            setAddress(publicKey)
          } else {
            await window.phantom.solana.disconnect()
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

    const handleConnect = () => {
      const publicKey = window.phantom?.solana?.publicKey?.toString()
      if (publicKey) {
        setConnected(true)
        setAddress(publicKey)
      }
    }

    const handleDisconnect = () => {
      setConnected(false)
      setAddress("")
    }

    window.phantom?.solana?.on("connect", handleConnect)
    window.phantom?.solana?.on("disconnect", handleDisconnect)

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.phantom?.solana?.removeListener("connect", handleConnect)
      window.phantom?.solana?.removeListener("disconnect", handleDisconnect)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (!window.phantom?.solana) {
        window.open("https://phantom.app/", "_blank")
        return
      }

      if (window.phantom.solana.isConnected) {
        await window.phantom.solana.disconnect()
      }

      const { publicKey } = await window.phantom.solana.connect()
      setConnected(true)
      setAddress(publicKey.toString())
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setConnected(false)
      setAddress("")
    }
  }

  const disconnectWallet = async () => {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect()
        setConnected(false)
        setAddress("")
        setShowMenu(false)
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const changeAccount = async () => {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect()
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { publicKey } = await window.phantom.solana.connect()
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
