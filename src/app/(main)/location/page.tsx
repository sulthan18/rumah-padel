"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Car, Train, Navigation, Copy, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"
import { BlurIn, SlideIn3D, ScaleIn, TextReveal } from "@/components/animations/variants"
import { toast } from "sonner"

export default function LocationPage() {
    const [copied, setCopied] = useState(false)

    const handleCopyAddress = () => {
        navigator.clipboard.writeText("Jl. Pangeran Antasari No. 88, Cipete Selatan, Cilandak, Jakarta Selatan 12410")
        setCopied(true)
        toast.success("Address copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0592882895964!2d106.81125807499066!3d-6.255919693732624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f17070014023%3A0xe5529f7f5255476d!2sKemang%20Village!5e0!3m2!1sen!2sid!4v1706692735164!5m2!1sen!2sid"

    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-zinc-900 text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent z-10" />
                    {/* Abstract Map Pattern Background if available, else standard gradient is fine */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-zinc-900/0 to-zinc-900" />
                </div>

                <div className="container relative z-20 mx-auto px-4">
                    <div className="max-w-3xl">
                        <BlurIn>
                            <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/30 bg-primary/10 text-primary uppercase tracking-widest text-xs font-bold">
                                Visit Us
                            </Badge>
                        </BlurIn>

                        <TextReveal
                            text="Find Your Way to The Court"
                            className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white leading-tight"
                        />

                        <FadeIn delay={0.4}>
                            <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                                Located strategically in South Jakarta. Easy access from SCBD, Kemang, and Antasari.
                                Valet parking available.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 -mt-20 relative z-30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Address Card */}
                            <FadeIn delay={0.1}>
                                <Card className="border-zinc-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-zinc-600 leading-relaxed">
                                            Jl. Pangeran Antasari No. 88, Cipete Selatan, Cilandak, Jakarta Selatan 12410
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-2 border-dashed"
                                            onClick={handleCopyAddress}
                                        >
                                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                            {copied ? "Copied!" : "Copy Address"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </FadeIn>

                            {/* Hours Card */}
                            <FadeIn delay={0.2}>
                                <Card className="border-zinc-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" />
                                            Opening Hours
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                                            <span className="text-zinc-600">Mon - Fri</span>
                                            <span className="font-semibold text-zinc-900">06:00 - 24:00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-600">Sat - Sun</span>
                                            <span className="font-semibold text-zinc-900">06:00 - 24:00</span>
                                        </div>
                                        <div className="bg-amber-50 text-amber-800 text-xs px-3 py-2 rounded-md flex gap-2 items-start mt-2">
                                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                            Last booking at 23:00 WIB
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>

                            {/* Contact Card */}
                            <FadeIn delay={0.3}>
                                <Card className="border-zinc-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-primary" />
                                            Contact
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 text-zinc-600 hover:text-primary">
                                            <Phone className="h-4 w-4" />
                                            +62 812-3456-7890
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 text-zinc-600 hover:text-primary">
                                            <Mail className="h-4 w-4" />
                                            hello@rumahpadel.com
                                        </Button>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>

                        {/* Right Column: Map & Transport Guide */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Map Container */}
                            <SlideIn3D direction="up" delay={0.2}>
                                <div className="bg-white p-2 rounded-3xl shadow-2xl border border-zinc-200">
                                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-zinc-100">
                                        <iframe
                                            src={mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute bottom-4 right-4">
                                            <Button className="shadow-lg gap-2" asChild>
                                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                                    <Navigation className="h-4 w-4" />
                                                    Get Directions
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn3D>

                            {/* Transport Guide */}
                            <FadeIn delay={0.4}>
                                <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6 md:p-8">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        How to Reach Us
                                    </h3>

                                    <Tabs defaultValue="car" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3 mb-8">
                                            <TabsTrigger value="car" className="gap-2">
                                                <Car className="h-4 w-4" /> Private Car
                                            </TabsTrigger>
                                            <TabsTrigger value="taxi" className="gap-2">
                                                <Navigation className="h-4 w-4" /> Online Taxi
                                            </TabsTrigger>
                                            <TabsTrigger value="train" className="gap-2">
                                                <Train className="h-4 w-4" /> MRT / Train
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="car" className="space-y-4">
                                            <h4 className="font-semibold text-lg">Via Antasari Flyover</h4>
                                            <p className="text-zinc-600 leading-relaxed">
                                                Exit the flyover at Cipete/Cilandak. Take a U-turn near Citos if coming from the south.
                                                We are located 200m after the Shell station on the left side.
                                            </p>
                                            <div className="bg-zinc-50 p-4 rounded-lg flex gap-3">
                                                <div className="bg-primary/10 p-2 rounded-md h-fit">
                                                    <Car className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-sm">Parking Info</h5>
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        Secure parking available for 50 cars. Valet service is available free of charge for Members.
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="taxi" className="space-y-4">
                                            <h4 className="font-semibold text-lg">Drop-off Point</h4>
                                            <p className="text-zinc-600 leading-relaxed">
                                                Set your destination to <strong>"Rumah Padel Cipete"</strong>.
                                                Drivers can drop you off directly at the main lobby entrance.
                                            </p>
                                        </TabsContent>

                                        <TabsContent value="train" className="space-y-4">
                                            <h4 className="font-semibold text-lg">Nearest MRT Station: Cipete Raya</h4>
                                            <p className="text-zinc-600 leading-relaxed">
                                                We are about 1.5km from MRT Cipete Raya station.
                                                From there, you can take a quick 5-minute Gojek/Grab ride or a 15-minute walk.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </FadeIn>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
