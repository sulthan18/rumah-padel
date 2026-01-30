import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const reviews = [
    {
        name: "Budi Santoso",
        role: "Pro Player",
        content: "Lapangannya karpetnya enak banget, lutut gak sakit. Lighting juga standar turnamen.",
        rating: 5,
        avatar: "BS"
    },
    {
        name: "Siska Wijaya",
        role: "Marketing Manager",
        content: "Parkiran luas, kopinya enak. Tempat paling pas buat main sehabis pulang kantor.",
        rating: 5,
        avatar: "SW"
    },
    {
        name: "Andi Pratama",
        role: "Padel Enthusiast",
        content: "Komunitasnya asik-asik. Gak susah cari lawan tanding di sini.",
        rating: 5,
        avatar: "AP"
    }
]

export function Testimonials() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Kata Mereka
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    {reviews.map((review, i) => (
                        <Card key={i} className="md:w-1/3 bg-zinc-50 border-zinc-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${i * 100}ms` }}>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="h-10 w-10 text-zinc-200" />
                                <p className="text-lg text-zinc-700 font-medium italic">
                                    "{review.content}"
                                </p>
                                <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{review.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-zinc-900">{review.name}</div>
                                        <div className="text-sm text-muted-foreground">{review.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
