"use client"

import { Check, X, Minus, HelpCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { BlurIn, ScaleIn, SlideIn3D, TextReveal } from "@/components/animations/variants"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"

// Comparison Data
const features = [
    {
        category: "Booking & Access",
        items: [
            { name: "Booking Window", guest: "H-3", pro: "H-7 (Prioritas)" },
            { name: "Reschedule", guest: "1x per booking", pro: "Unlimited" },
            { name: "Court Choice", guest: "Standard Only", pro: "All Courts (Inc. Panorama)" },
            { name: "Waitlist Priority", guest: false, pro: true },
        ]
    },
    {
        category: "Amenities",
        items: [
            { name: "Locker", guest: "Public", pro: "Private + Laundry" },
            { name: "Towel Rental", guest: "Rp 25.000", pro: "Free" },
            { name: "Parking", guest: "Standard", pro: "VIP Slot" },
            { name: "WiFi", guest: "Standard Speed", pro: "High Speed" },
        ]
    },
    {
        category: "Benefits",
        items: [
            { name: "Booking Discount", guest: "-", pro: "10% Off" },
            { name: "F&B Discount", guest: "-", pro: "5% Off" },
            { name: "Pro Shop Discount", guest: "-", pro: "5% Off" },
            { name: "Event Access", guest: "General", pro: "VIP Invitation" },
        ]
    }
]

// Billing FAQs
const billingFaqs = [
    {
        q: "Apakah membership bisa dibatalkan kapan saja?",
        a: "Ya, membership Pro Member bersifat bulanan dan bisa dibatalkan kapan saja sebelum tanggal renewal berikutnya. Tidak ada kontrak jangka panjang yang mengikat."
    },
    {
        q: "Metode pembayaran apa yang tersedia?",
        a: "Kami menerima pembayaran melalui Transfer Bank (BCA, Mandiri), E-Wallet (GoPay, OVO, Dana), dan Kartu Kredit Visa/Mastercard."
    },
    {
        q: "Bagaimana jika saya ingin upgrade dari Guest ke Pro?",
        a: "Gampang banget! Cukup login ke akun kamu, masuk ke menu Membership, dan pilih paket Pro. Status kamu akan langsung berubah aktif setelah pembayaran."
    },
    {
        q: "Apakah ada biaya pendaftaran?",
        a: "Tidak ada biaya pendaftaran atau administrasi tambahan. Harga yang tertera adalah harga final yang kamu bayar."
    }
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-zinc-950 text-white">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-zinc-900/40 to-zinc-950" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <BlurIn>
                        <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-widest text-xs font-bold">
                            Membership Plans
                        </Badge>
                    </BlurIn>

                    <TextReveal
                        text="Simple Pricing For Everyone"
                        className="justify-center text-4xl md:text-6xl font-black tracking-tight mb-6 text-white"
                        delay={0.2}
                    />

                    <BlurIn delay={0.6}>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Tidak ada biaya tersembunyi. Pilih paket yang sesuai dengan frekuensi main kamu dan nikmati keuntungan eksklusif.
                        </p>
                    </BlurIn>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-5xl">
                    <FadeIn direction="up" className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900">Compare Plans</h2>
                        <p className="text-muted-foreground">Detail perbedaan fasilitas dan keuntungan antar paket.</p>
                    </FadeIn>

                    <div className="rounded-2xl border border-zinc-200 shadow-xl overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-zinc-50">
                                <TableRow className="hover:bg-zinc-50">
                                    <TableHead className="w-[40%] pl-8 py-6 text-base font-bold text-zinc-900">Feature</TableHead>
                                    <TableHead className="w-[30%] py-6 text-center text-base font-bold text-zinc-500">Guest</TableHead>
                                    <TableHead className="w-[30%] py-6 text-center text-base font-bold text-primary bg-primary/5">
                                        Pro Member
                                        <Badge className="ml-2 bg-primary hover:bg-primary/90 text-[10px]">RECOMMENDED</Badge>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {features.map((section, sIndex) => (
                                    <>
                                        {/* Category Header */}
                                        <TableRow key={`cat-${sIndex}`} className="bg-zinc-50/50 hover:bg-zinc-50/50">
                                            <TableCell colSpan={3} className="pl-8 py-3 font-semibold text-xs uppercase tracking-wider text-zinc-500">
                                                {section.category}
                                            </TableCell>
                                        </TableRow>

                                        {/* Items */}
                                        {section.items.map((item, iIndex) => (
                                            <TableRow key={`item-${sIndex}-${iIndex}`} className="hover:bg-zinc-50/30 transition-colors">
                                                <TableCell className="pl-8 py-4 font-medium text-zinc-700">
                                                    {item.name}
                                                    {item.name === "Reschedule" && (
                                                        <HelpCircle className="inline-block ml-2 h-4 w-4 text-zinc-300 cursor-help" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center py-4 text-zinc-600">
                                                    {typeof item.guest === 'boolean' ? (
                                                        item.guest ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <Minus className="h-5 w-5 text-zinc-300 mx-auto" />
                                                    ) : (
                                                        item.guest
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center py-4 font-medium text-zinc-900 bg-primary/[0.02]">
                                                    {typeof item.pro === 'boolean' ? (
                                                        item.pro ? <Check className="h-5 w-5 text-green-500 mx-auto stroke-[3]" /> : <Minus className="h-5 w-5 text-zinc-300 mx-auto" />
                                                    ) : (
                                                        item.pro
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-zinc-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <SlideIn3D direction="up">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900">Billing FAQs</h2>
                            <p className="text-muted-foreground">Pertanyaan seputar pembayaran dan membership.</p>
                        </div>
                    </SlideIn3D>

                    <FadeInStagger>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {billingFaqs.map((faq, i) => (
                                <FadeIn key={i}>
                                    <AccordionItem value={`item-${i}`} className="bg-white border text-zinc-900 border-zinc-200 rounded-xl px-6 shadow-sm">
                                        <AccordionTrigger className="text-left font-semibold py-6 hover:no-underline">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-zinc-600 pb-6 leading-relaxed">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                </FadeIn>
                            ))}
                        </Accordion>
                    </FadeInStagger>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-zinc-950 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <BlurIn duration={1}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
                            Ready to Upgrade Your Game?
                        </h2>
                    </BlurIn>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <ScaleIn delay={0.4}>
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25" asChild>
                                <Link href="/auth/signup?plan=pro">
                                    Get Pro Member
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </ScaleIn>
                        <ScaleIn delay={0.6}>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white" asChild>
                                <Link href="/booking">
                                    Book as Guest
                                </Link>
                            </Button>
                        </ScaleIn>
                    </div>
                </div>
            </section>
        </div>
    )
}
