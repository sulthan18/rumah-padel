import { Bath, Car, Coffee, Swords } from "lucide-react"

const FEATURES = [
    {
        icon: <Bath className="h-8 w-8 text-blue-500" />,
        title: "Shower Air Hangat",
        description: "Bilas keringat dengan nyaman setelah pertandingan seru."
    },
    {
        icon: <Car className="h-8 w-8 text-emerald-500" />,
        title: "Parkir Luas & Aman",
        description: "Area parkir dedicated yang luas dan terpantau CCTV 24 jam."
    },
    {
        icon: <Coffee className="h-8 w-8 text-amber-700" />,
        title: "Coffee Shop",
        description: "Relax sejenak sambil menikmati kopi dan snack di lounge area kami."
    },
    {
        icon: <Swords className="h-8 w-8 text-indigo-500" />,
        title: "Rental Raket Premium",
        description: "Belum punya raket? Sewa raket pro-grade dari koleksi kami."
    }
]

export function Facilities() {
    return (
        <section className="py-24 bg-white dark:bg-zinc-950">
            <div className="container px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
                    {FEATURES.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-4 space-y-4 group hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
