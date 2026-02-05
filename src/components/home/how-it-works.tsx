"use client"

import { Search, CreditCard, Ticket } from "lucide-react"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"

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
        <section className="py-24 bg-zinc-50 border-t border-zinc-200">
            <div className="container mx-auto px-4">
                <FadeIn direction="up" className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Gampang Banget Caranya
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Cuma butuh 3 langkah mudah buat mulai main padel di sini.
                    </p>
                </FadeIn>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 -z-10" />

                    <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <FadeIn key={index} className="flex flex-col items-center text-center space-y-6 relative group">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-zinc-100 z-10 relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                                    <div className="absolute -top-3 -right-3 bg-zinc-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                        {index + 1}
                                    </div>
                                    <step.icon className="h-10 w-10 text-primary transition-colors duration-300 group-hover:text-blue-600" />
                                </div>
                                <div className="space-y-3 px-4">
                                    <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                </div>
            </div>
        </section>
    )
}
