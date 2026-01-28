import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, User, Trophy, Zap, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Now Open in Jakarta Selatan
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 animate-in fade-in slide-in-from-bottom-5 duration-700">
              RUMAH PADEL
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Elevate your game on premium world-class courts.
            <br className="hidden md:block" />
            Book instantly. Play passionately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full w-full sm:w-auto shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.7)] transition-all hover:scale-105" asChild>
              <Link href="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Book Court Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-full w-full sm:w-auto bg-transparent border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:text-white transition-all hover:scale-105" asChild>
              <Link href="/about">
                <Zap className="mr-2 h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">Why Choose Us?</h2>
            <p className="text-lg text-muted-foreground">We provide the best padel experience in town.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-yellow-500" />}
              title="World Class Courts"
              description="Our courts are built to international standards with panoramic glass and premium turf."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-blue-500" />}
              title="Instant Booking"
              description="Real-time availability and instant confirmation via our secure payment system."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-emerald-500" />}
              title="Premium Amenities"
              description="Enjoy our lounge, pro shop, and locker rooms designed for your comfort."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
      <CardHeader>
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
