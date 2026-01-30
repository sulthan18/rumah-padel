"use client"

import Image from "next/image"
import { Swords } from "lucide-react"
import { usePathname } from "next/navigation"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isSignUp = pathname === "/auth/signup"
    const bgImage = isSignUp ? "/images/signup-bg.jpg" : "/images/auth-bg.png"

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Hero Image (Desktop) */}
            <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={bgImage}
                        alt="Padel Court"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mr-2 shadow-lg shadow-primary/20">
                        <Swords className="h-4 w-4 text-primary-foreground -rotate-45" />
                    </div>
                    Rumah Padel
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-xl font-medium leading-relaxed">
                            {isSignUp
                                ? "\"Join the fastest growing padel community in town. Competitive matches, professional coaching, and premium facilities await.\""
                                : "\"Elevate your game on Indonesia's premier padel courts. Join our community of passionate players today.\""
                            }
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-8 relative min-h-screen">
                {/* Mobile Background (for small screens) */}
                <div className="absolute inset-0 lg:hidden">
                    <Image
                        src={bgImage}
                        alt="Background"
                        fill
                        className="object-cover brightness-[0.4]"
                    />
                </div>

                <div className="relative z-10 w-full max-w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    )
}
