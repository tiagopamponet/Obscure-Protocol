"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { Network, Activity, DollarSign, CalendarDays } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Adjust this value to match your header height (e.g., 64px for typical headers)
const HEADER_HEIGHT = 64;
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [txCount, setTxCount] = useState<null | number>(null);
  const [loadingTx, setLoadingTx] = useState(true);
  const [todayTx, setTodayTx] = useState<null | number>(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<null | number>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoadingTx(true);
      setLoadingToday(true);
      try {
        const res = await fetch(`${API_URL}/api/tx-stats`);
        const data = await res.json();
        setTxCount(data.totalTx);
        setTodayTx(data.last24hTx);
        setLastUpdated(data.lastUpdated);
        setLoadingTx(false);
        setLoadingToday(false);
      } catch (e) {
        setTxCount(null);
        setTodayTx(null);
        setLoadingTx(false);
        setLoadingToday(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center pb-16 overflow-hidden mt-16"
    >
      {/* Tally embed script */}
      <Script async src="https://tally.so/widgets/embed.js" />
      {/* Background image for laptop screens (light mode only) */}
      {resolvedTheme !== "dark" ? (
        <div className="hidden lg:block absolute inset-0 w-full h-full z-0">
          <Image
            src="/3rd.png"
            alt="Background wallpaper"
            fill
            priority
            className="object-cover w-full h-full"
            quality={100}
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="hidden lg:block absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-[#0a192f] via-[#2e1065] to-[#14f195]" />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="order-2 lg:order-1">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400 dark:from-purple-400 dark:to-pink-300">
              GhostTX
            </span>
          </h1>
          <p className="text-sm italic flex items-center gap-2 mb-6 text-slate-600 dark:text-slate-400">
            <span>Built on</span>
            <Image
              src="/solanaLogo.svg?height=20&width=100"
              alt="Solana logo"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </p>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Whisper your transactions into the chain — and let it travel unseen
          </p>
          <div className="flex gap-4 mb-8">
            <Link href="https://whisper.ghosttx.me/">
              <Button 
                className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-purple-200/50 dark:from-purple-600 dark:to-pink-600 dark:shadow-purple-900/30"
              >
                Whisper 
              </Button>
            </Link>
            <button
              data-tally-open="mVyqYE"
              data-tally-layout="modal"
              data-tally-emoji-text="👻 "
              data-tally-emoji-animation="tada"
              className="bg-white text-purple-700 border border-purple-200 dark:bg-slate-900 dark:text-purple-200 dark:border-purple-800 text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors duration-200"
            >
              Join waitlist
            </button>
          </div>
          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 items-center justify-start mb-8">
            <div className="flex items-center gap-3">
              <Network className="w-7 h-7 text-purple-500 dark:text-purple-300" />
              <div>
                <div className="font-bold text-2xl font-zen text-slate-800 dark:text-white">Devnet</div>
                <div className="text-xs font-zen text-slate-500 dark:text-slate-400 tracking-wide">Deployed on</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-7 h-7 text-pink-500 dark:text-pink-300" />
              <div>
                <div className="font-bold text-2xl font-zen text-slate-800 dark:text-white">
                  {loadingTx ? <span className="animate-pulse">...</span> : txCount !== null ? txCount.toLocaleString() : "-"}
                </div>
                <div className="text-xs font-zen text-slate-500 dark:text-slate-400 tracking-wide">Total Transactions</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-blue-500 dark:text-blue-300" />
              <div>
                <div className="font-bold text-2xl font-zen text-slate-800 dark:text-white">
                  {loadingToday ? <span className="animate-pulse">...</span> : todayTx !== null ? todayTx.toLocaleString() : "-"}
                </div>
                <div className="text-xs font-zen text-slate-500 dark:text-slate-400 tracking-wide">Today's Transactions</div>
              </div>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 mt-[-12px]">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <Image
              src="/1st.png"
              alt="Anime-style scene with floating Solana blocks covered by a ghost cloak"
              width={600}
              height={500}
              className="rounded-xl lg:hidden"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
