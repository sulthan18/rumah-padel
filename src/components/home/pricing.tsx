import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const plans = [
    {
        name: "Guest",
        price: "Pay-as-you-go",
        description: "Main santai tanpa komitmen bulanan.",
        features: [
            "Akses Booking H-3",
            "Harga Normal",
            "Akses Fasilitas Standar",
            "Public Locker"
        ],
        cta: "Booking Sekarang",
        href: "/booking",
        popular: false
    },
    {
        name: "Pro Member",
        price: "Rp 500rb / bulan",
        description: "Buat kamu yang rutin main tiap minggu.",
        features: [
            "Akses Booking H-7 (Prioritas)",
            "Diskon 10% Setiap Booking",
            "Private Locker",
            "Free Towel Rental"
        ],
        cta: "Join Member",
        href: "/membership",
        popular: true
    }
]

export function Pricing() {
    return (
        <section className="py-24 bg-zinc-50 border-y border-zinc-200">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Pricing & Membership
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Pilih paket yang pas buat gaya mainmu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`relative flex flex-col border-2 ${plan.popular ? "border-primary shadow-2xl scale-105 z-10" : "border-zinc-200 hover:border-zinc-300 shadow-md"}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                                    <Crown className="h-4 w-4 fill-current" /> Most Popular
                                </div>
                            )}
                            <CardHeader className="text-center pb-8 pt-10">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                                <div className="mt-6">
                                    <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="h-3 w-3 text-green-600" />
                                            </div>
                                            <span className="text-zinc-700 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="pt-8 pb-8">
                                <Button className={`w-full h-12 text-lg font-bold ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-zinc-900 hover:bg-zinc-800"}`} asChild>
                                    <Link href={plan.href}>
                                        {plan.cta}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
