"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"

export function Location() {
    return (
        <section className="py-20 bg-zinc-900 text-white overflow-hidden">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Info */}
                    <FadeIn direction="right" className="space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                                Lokasi Kami
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                Strategis di jantung Jakarta Selatan. Mudah diakses dari SCBD dan Kemang.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Alamat</h4>
                                    <p className="text-zinc-400">Jl. Pangeran Antasari No. 88, Cipete Selatan, Cilandak, Jakarta Selatan 12410</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Jam Operasional</h4>
                                    <p className="text-zinc-400">Senin - Minggu: 06:00 - 24:00 WIB</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-zinc-800 flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Kontak</h4>
                                    <p className="text-zinc-400">0812-3456-7890 (WhatsApp)</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Map Embed */}
                    <FadeIn direction="left" className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                        {/* Placeholder Map - Ganti SRC dengan Real Embed Google Maps */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0592882895964!2d106.81125807499066!3d-6.255919693732624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f17070014023%3A0xe5529f7f5255476d!2sKemang%20Village!5e0!3m2!1sen!2sid!4v1706692735164!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
