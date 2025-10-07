import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Serif_JP, Zen_Maru_Gothic } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletConnectProvider } from "@/components/wallet-connect"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-jp",
})
const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen-maru-gothic",
})

export const metadata: Metadata = {
  title: "GhostTX - Anonymous Solana Transactions",
  description: "Send or redeem your SOL in silence — no identity, no trail.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifJP.variable} ${zenMaruGothic.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <WalletConnectProvider>
            {children}
          </WalletConnectProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
