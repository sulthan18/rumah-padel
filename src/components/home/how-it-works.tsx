import { Search, CreditCard, Ticket } from "lucide-react"

const steps = [
    {
        title: "Cari Jadwal",
        description: "Cek ketersediaan lapangan secara real-time. Pilih tanggal dan jam main sesukamu.",
        icon: Search,
    },
    {
        title: "Booking & Bayar",
        description: "Pilih durasi main, isi data diri, dan bayar sat-set pakai QRIS atau Virtual Account.",
        icon: CreditCard,
    },
    {
        title: "Datang & Main",
        description: "Tunjukkan kode booking / QR Code ke resepsionis. Langsung gas main!",
        icon: Ticket,
    }
]

export function HowItWorks() {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Gampang Banget Caranya
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Cuma butuh 3 langkah mudah buat mulai main padel di sini.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-6 relative animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-zinc-100 z-10 relative group hover:scale-105 transition-transform duration-300">
                                <div className="absolute -top-3 -right-3 bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                    {index + 1}
                                </div>
                                <step.icon className="h-10 w-10 text-primary" />
                            </div>
                            <div className="space-y-3 px-4">
                                <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
