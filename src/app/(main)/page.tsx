import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy } from "lucide-react"

// Components
import { QuickFilter } from "@/components/home/quick-filter"
import { CourtGallery } from "@/components/home/court-gallery"
import { Facilities } from "@/components/home/facilities"
import { Location } from "@/components/home/location"

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Hero Section (The Hook) */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Padel Court Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/20" />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 animate-in fade-in slide-in-from-bottom-5 duration-700">
              Main Padel Gak Pake Ribet.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              Booking lapangan standar WPT, fasilitas lengkap, parkir luas.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all hover:scale-105" asChild>
              <Link href="#courts">
                <Calendar className="mr-2 h-5 w-5" />
                Cari Slot Kosong
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all hover:scale-105" onClick={() => window.open("https://wa.me/6281234567890", "_blank")}>
              <Users className="mr-2 h-5 w-5" />
              Cari Lawan Main
            </Button>

            <Button size="lg" variant="ghost" className="h-14 px-8 text-lg font-bold rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-all hover:scale-105" asChild>
              <Link href="/tournaments">
                <Trophy className="mr-2 h-5 w-5" />
                Lihat Turnamen
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Quick Filter (The Utility) - Stacking Context Adjusted */}
      <QuickFilter />

      {/* 3. Facilities (The Trust) - Moved up as per common flow or keep below filtering? 
         User req: "Facilities... Posisi: Di bawah list lapangan" - OK, stick to user req.
         My Plan: QuickFilter -> Courts -> Facilities -> Location. 
      */}

      {/* 4. Court Gallery (The Product) */}
      <CourtGallery />

      {/* 5. Why Choose Us / Facilities (The Trust) */}
      <Facilities />

      {/* 6. Location / Map (The Practicality) */}
      <Location />
    </div>
  )
}
