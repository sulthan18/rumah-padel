"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// Components
import { TopBanner } from "@/components/top-banner"
import { QuickFilter } from "@/components/home/quick-filter"
import { SocialProof } from "@/components/home/social-proof"
import { HowItWorks } from "@/components/home/how-it-works"
import { CourtGallery } from "@/components/home/court-gallery"
import { Facilities } from "@/components/home/facilities"
import { Pricing } from "@/components/home/pricing"
import { Testimonials } from "@/components/home/testimonials"
import { FAQ } from "@/components/home/faq"
import { InstagramFeed } from "@/components/home/instagram-feed"
import { Location } from "@/components/home/location"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Top Bar */}
      <TopBanner />

      {/* 2. Hero Section */}
      <section
        ref={containerRef}
        className="relative h-[85vh] flex items-end justify-center overflow-hidden bg-zinc-950 text-white pb-32"
      >
        {/* Background Image with Overlay */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/hero-bg.jpg"
            alt="Padel Court Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/20" />
        </motion.div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-8">
          {/* SEO-Optimized Heading */}
          <FadeInStagger>
            <FadeIn direction="up" className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter drop-shadow-2xl">
                Booking Padel Jakarta
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-bold drop-shadow-lg">
                Standar WPT • Booking Instan
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all hover:scale-105" asChild>
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Cari Slot Kosong
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all hover:scale-105" asChild>
                <Link href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  <Users className="mr-2 h-5 w-5" />
                  Cari Lawan Main
                </Link>
              </Button>

              <Button size="lg" variant="ghost" className="h-14 px-8 text-lg font-bold rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-all hover:scale-105" asChild>
                <Link href="/tournaments">
                  <Trophy className="mr-2 h-5 w-5" />
                  Lihat Turnamen
                </Link>
              </Button>
            </FadeIn>
          </FadeInStagger>
        </div>
      </section>

      {/* 3. Command Center (Quick Filter) */}
      <QuickFilter />

      {/* 4. Social Proof */}
      <SocialProof />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Featured Courts */}
      <CourtGallery />

      {/* 7. Premium Amenities (Bento) */}
      <Facilities />

      {/* 8. Pricing */}
      <Pricing />

      {/* 9. Reviews */}
      <Testimonials />

      {/* 10. FAQ */}
      <FAQ />

      {/* 11. Instagram Feed */}
      <InstagramFeed />

      {/* 12. Location & Footer */}
      <Location />
    </div>
  )
}
