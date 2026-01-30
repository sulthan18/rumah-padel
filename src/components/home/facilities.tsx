import { Coffee, ShowerHead, Store, Eye, Wifi, Car } from "lucide-react"
import Image from "next/image"

const features = [
    {
        title: "Super Panorama Court",
        description: "Kaca tebal tempered glass 12mm dengan pandangan luas tanpa halangan. Main serasa di WPT.",
        icon: Eye,
        className: "md:col-span-2 md:row-span-2",
        image: "/images/hero-bg.jpg" // Use placeholder or generic
    },
    {
        title: "Pro Shop",
        description: "Jual bola, raket, grip, dan apparel lengkap.",
        icon: Store,
        className: "md:col-span-1 md:row-span-1",
        image: "/images/signup-bg.jpg"
    },
    {
        title: "Luxury Shower",
        description: "Air panas stabil, sabun premium, handuk bersih.",
        icon: ShowerHead,
        className: "md:col-span-1 md:row-span-1",
        image: "/images/hero-bg.jpg"
    },
    {
        title: "Coffee Bar",
        description: "Espresso based coffee buat nongkrong.",
        icon: Coffee,
        className: "md:col-span-1 md:row-span-1",
        image: "/images/signup-bg.jpg"
    },
    {
        title: "Free WiFi",
        description: "Internet kencang buat update status.",
        icon: Wifi,
        className: "md:col-span-1 md:row-span-1",
        image: "/images/hero-bg.jpg"
    }
]

export function Facilities() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4">
                        Premium Amenities
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Lebih dari sekadar lapangan. Kami punya fasilitas lengkap buat manjain kamu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px]">
                    {features.map((feature, i) => (
                        <div key={i} className={`relative group overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 ${feature.className} animate-in fade-in zoom-in duration-700`} style={{ animationDelay: `${i * 100}ms` }}>
                            {/* Background Image */}
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                                <div className="mb-3 inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-lg">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-zinc-200 text-sm md:text-base leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
