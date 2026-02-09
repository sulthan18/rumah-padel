"use client"

import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"
import { SlideIn3D } from "@/components/animations/variants"
import { PRICING_PLANS } from "@/features/home/config/pricing-plans"

export function Pricing() {
    return (
        <section className="py-24 bg-zinc-50 border-y border-zinc-200">
            <div className="container mx-auto px-4">
                <FadeIn direction="up" className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Pricing & Membership
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Pilih paket yang pas buat gaya mainmu.
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PRICING_PLANS.map((plan, index) => (
                        <SlideIn3D key={index} direction={index === 0 ? "right" : "left"} delay={index * 0.2}>
                            <Card className={`relative flex flex-col border-2 ${plan.popular ? "border-primary shadow-2xl scale-105 z-10" : "border-zinc-200 hover:border-zinc-300 shadow-md"} h-full`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
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
                        </SlideIn3D>
                    ))}
                </div>
            </div>
        </section>
    )
}
