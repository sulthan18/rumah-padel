"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trophy, Handshake, Users, TicketPercent } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function QuickFilter() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"book" | "match">("book")
    const [slotsLeft, setSlotsLeft] = useState(3)

    // Simulate live ticker update
    useEffect(() => {
        const interval = setInterval(() => {
            setSlotsLeft(prev => Math.max(0, prev - 1))
        }, 30000) // Decrease every 30s for effect
        return () => clearInterval(interval)
    }, [])

    const handleSearch = () => {
        if (activeTab === "book") {
            router.push("/booking")
        } else {
            // Find match logic (e.g. redirect to community page)
            window.open("https://wa.me/6281234567890", "_blank")
        }
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return (
        <div className="container px-4 -mt-16 relative z-20">
            {/* Promo Banner (Outside) */}
            <div className="flex justify-center mb-4 relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white pl-4 pr-1 py-1 rounded-full shadow-lg flex items-center gap-3 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <TicketPercent className="h-4 w-4 animate-bounce" />
                        <span>Diskon 20% Main Pagi!</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider cursor-pointer hover:bg-white/30 transition-colors">
                        KODE: MORNINGSMASH
                    </div>
                </div>
            </div>

            <Card className="shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20 overflow-visible">
                {/* Tab Switcher */}
                <div className="flex border-b border-zinc-100">
                    <button
                        onClick={() => setActiveTab("book")}
                        className={cn(
                            "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-zinc-50",
                            activeTab === "book" ? "text-primary border-b-2 border-primary bg-blue-50/50" : "text-muted-foreground"
                        )}
                    >
                        <Trophy className="h-4 w-4" />
                        Book Court
                    </button>
                    <button
                        onClick={() => setActiveTab("match")}
                        className={cn(
                            "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-zinc-50",
                            activeTab === "match" ? "text-primary border-b-2 border-primary bg-blue-50/50" : "text-muted-foreground"
                        )}
                    >
                        <Handshake className="h-4 w-4" />
                        Find Match
                    </button>
                </div>

                <CardContent className="p-6">
                    {activeTab === "book" ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                {/* 1. Tanggal */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Tanggal</label>
                                    <Select defaultValue="today">
                                        <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200 focus:ring-primary/20">
                                            <SelectValue placeholder="Pilih Tanggal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="today">Hari Ini ({format(today, "d MMM", { locale: id })})</SelectItem>
                                            <SelectItem value="tomorrow">Besok ({format(tomorrow, "d MMM", { locale: id })})</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 2. Durasi */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Durasi</label>
                                    <Select defaultValue="60">
                                        <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200 focus:ring-primary/20">
                                            <SelectValue placeholder="Durasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="60">60 Menit</SelectItem>
                                            <SelectItem value="90">90 Menit</SelectItem>
                                            <SelectItem value="120">120 Menit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 3. Tipe Lapangan */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Tipe Lapangan</label>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="h-12 bg-zinc-50 border-zinc-200 focus:ring-primary/20">
                                            <SelectValue placeholder="Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tipe</SelectItem>
                                            <SelectItem value="indoor">Indoor Only</SelectItem>
                                            <SelectItem value="outdoor">Outdoor Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Switch Button Color for Search */}
                                <Button
                                    className="h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={handleSearch}
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Cari
                                </Button>
                            </div>

                            {/* Live Ticker */}
                            <div className="flex justify-end">
                                <span className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-full animate-pulse",
                                    slotsLeft > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                )}>
                                    {slotsLeft > 0
                                        ? `🔥 Cepat! Sisa ${slotsLeft} slot untuk malam ini!`
                                        : "✅ Slot malam ini masih banyak tersedia."}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Users className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Cari Lawan Sparring?</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Gabung komunitas kami di WhatsApp untuk cari teman main bareng!
                                </p>
                            </div>
                            <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                                Gabung Grup WhatsApp
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
