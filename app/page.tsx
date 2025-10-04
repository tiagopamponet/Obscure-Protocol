import HeroSection from "@/components/hero-section"
import WhatIsSection from "@/components/what-is-section"
import WhyPrivacySection from "@/components/why-privacy-section"
import BlockchainCouponSection from "@/components/blockchain-coupon-section"
import FeaturesSection from "@/components/features-section"
import UseCasesSection from "@/components/use-cases-section"
import CouponShowcaseSection from "@/components/coupon-showcase-section"
import BehindCloakSection from "@/components/behind-cloak-section"
import CommunitySection from "@/components/community-section"
import FinalCtaSection from "@/components/final-cta-section"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950 overflow-hidden">
      <div className="fixed inset-0 bg-[url('/images/ghost-pattern.png')] opacity-5 dark:opacity-10 pointer-events-none z-0"></div>
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 relative z-10">
        <WhatIsSection />
        <WhyPrivacySection />
        <BlockchainCouponSection />
        <FeaturesSection />
        <UseCasesSection />
        <CouponShowcaseSection />
        <BehindCloakSection />
        <CommunitySection />
        <FinalCtaSection />
      </div>
    </main>
  )
}
