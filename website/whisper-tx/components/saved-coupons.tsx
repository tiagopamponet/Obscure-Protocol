"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Link as LinkIcon, Bell, Scroll, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SavedCoupon {
  value: string
  amount: number
  is_used: boolean
  created_at: string
}

interface SavedCouponsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupons: Record<string, SavedCoupon>
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function SavedCoupons({ open, onOpenChange, coupons, isLoading, hasMore, onLoadMore }: SavedCouponsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [linkedCode, setLinkedCode] = useState<string | null>(null)
  const [notifiedCode, setNotifiedCode] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'default' | 'lowToHigh' | 'highToLow'>('default')
  const [page, setPage] = useState(1)
  const COUPONS_PER_PAGE = 5;
  const containerRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 500)
  }

  const handleLink = (code: string) => {
    setLinkedCode(code)
    setTimeout(() => setLinkedCode(null), 500)
  }

  const handleNotify = (code: string) => {
    setNotifiedCode(code)
    setTimeout(() => setNotifiedCode(null), 500)
  }

  const getSortedCouponEntries = () => {
    const couponEntries = Object.entries(coupons) as [string, SavedCoupon][];
    if (sortOrder === 'default') return couponEntries;
    return couponEntries.sort(([, a], [, b]) => {
      if (sortOrder === 'lowToHigh') return a.amount - b.amount;
      return b.amount - a.amount;
    });
  };

  const paginatedSortedCoupons = () => {
    const sorted = getSortedCouponEntries();
    return sorted.slice(0, page * COUPONS_PER_PAGE);
  };

  useEffect(() => {
    setPage(1);
  }, [coupons, sortOrder]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        if (paginatedSortedCoupons().length < getSortedCouponEntries().length) {
          setPage((prev) => prev + 1);
        }
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [coupons, sortOrder, page]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[500px] rounded-2xl bg-gradient-to-b from-white to-violet-50 dark:from-slate-900 dark:to-violet-950 border border-violet-100 dark:border-violet-900 shadow-lg shadow-violet-200/20 dark:shadow-violet-900/20">
        <div className="absolute inset-0 bg-charm-pattern opacity-[0.03] rounded-2xl pointer-events-none"></div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-serif text-center text-slate-800 dark:text-white flex items-center justify-center gap-2">
            Saved Coupons
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-300 font-zen">
            Your cloaked scrolls in one secret vault
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 py-4">
          {isLoading && Object.keys(coupons).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Scroll className="h-16 w-16 text-violet-400 dark:text-violet-500 mb-4 opacity-70 animate-spin" />
              <p className="text-slate-600 dark:text-slate-300">
                Searching for your scrolls...
              </p>
            </div>
          ) : Object.keys(coupons).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                No coupons found in your vault.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-between">
                      {sortOrder === 'default' && 'Sort by amount'}
                      {sortOrder === 'lowToHigh' && 'Low to High'}
                      {sortOrder === 'highToLow' && 'High to Low'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder('default')}>
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('lowToHigh')}>
                      Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('highToLow')}>
                      High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div 
                ref={containerRef}
                className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
              >
                {paginatedSortedCoupons().map(([key, coupon]) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-violet-200 dark:border-violet-800 bg-white/50 dark:bg-slate-800/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-violet-700 dark:text-violet-400">
                        Amount: {coupon.amount} SOL
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(coupon.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-violet-50 dark:bg-violet-950/50 p-2 rounded">
                        {coupon.value}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-colors duration-200 ${
                          copiedCode === coupon.value 
                            ? 'bg-green-900 text-green-50 dark:bg-green-900 dark:text-green-400' 
                            : 'hover:bg-violet-100 dark:hover:bg-violet-900'
                        }`}
                        onClick={() => copyToClipboard(coupon.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-colors duration-200 ${
                          linkedCode === coupon.value 
                            ? 'bg-blue-900 text-blue-50 dark:bg-blue-900 dark:text-blue-400' 
                            : 'hover:bg-violet-100 dark:hover:bg-violet-900'
                        }`}
                        onClick={() => handleLink(coupon.value)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-colors duration-200 ${
                          notifiedCode === coupon.value 
                            ? 'bg-yellow-900 text-yellow-50 dark:bg-yellow-900 dark:text-yellow-400' 
                            : 'hover:bg-violet-100 dark:hover:bg-violet-900'
                        }`}
                        onClick={() => handleNotify(coupon.value)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                    {coupon.is_used && (
                      <span className="text-xs text-red-500 mt-2 block">Used</span>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center py-4">
                    <Scroll className="h-6 w-6 text-violet-400 dark:text-violet-500 animate-spin" />
                  </div>
                )}
                {paginatedSortedCoupons().length === 0 && !isLoading && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
                    No coupons found in your vault.
                  </p>
                )}
                {paginatedSortedCoupons().length === getSortedCouponEntries().length && paginatedSortedCoupons().length > 0 && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
                    No more coupons to load
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            variant="outline"
            className="w-full border-violet-200 dark:border-violet-800 mt-4"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Return Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 