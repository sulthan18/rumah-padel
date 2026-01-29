"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function QuickFilter() {
    const router = useRouter()

    // Default values (mock logic for now)
    const handleSearch = () => {
        // Redirect to booking page with query params if needed
        router.push("/booking")
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return (
        <div className="container px-4 -mt-10 relative z-20">
            <Card className="shadow-xl bg-white/80 backdrop-blur-md border border-white/20">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                            <Select defaultValue="today">
                                <SelectTrigger className="h-12 bg-white/50 border-zinc-200">
                                    <SelectValue placeholder="Pilih Tanggal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hari Ini ({format(today, "d MTT", { locale: id })})</SelectItem>
                                    <SelectItem value="tomorrow">Besok ({format(tomorrow, "d MTT", { locale: id })})</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Waktu</label>
                            <Select defaultValue="morning">
                                <SelectTrigger className="h-12 bg-white/50 border-zinc-200">
                                    <SelectValue placeholder="Pilih Waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Pagi (07:00 - 12:00)</SelectItem>
                                    <SelectItem value="afternoon">Siang (12:00 - 17:00)</SelectItem>
                                    <SelectItem value="evening">Malam (17:00 - 23:00)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Durasi</label>
                            <Select defaultValue="60">
                                <SelectTrigger className="h-12 bg-white/50 border-zinc-200">
                                    <SelectValue placeholder="Durasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="60">1 Jam</SelectItem>
                                    <SelectItem value="90">1.5 Jam</SelectItem>
                                    <SelectItem value="120">2 Jam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                            onClick={handleSearch}
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Cari
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
