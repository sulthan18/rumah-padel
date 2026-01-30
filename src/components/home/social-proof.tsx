import { Users, Star, Trophy, MessageCircle } from "lucide-react"

const stats = [
    {
        label: "Happy Players",
        value: "2000+",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        label: "Google Rating",
        value: "4.9/5",
        icon: Star,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        label: "WPT Standard Courts",
        value: "5",
        icon: Trophy,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        label: "Komunitas Solid",
        value: "#1",
        icon: MessageCircle,
        color: "text-green-500",
        bg: "bg-green-500/10"
    }
]

export function SocialProof() {
    return (
        <section className="py-12 border-b border-zinc-100 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-2 group cursor-default" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-2 transition-transform group-hover:scale-110 duration-300`}>
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <span className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900">{stat.value}</span>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
