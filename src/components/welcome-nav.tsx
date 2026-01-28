"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const CAPTIONS = [
    "Mau main jam berapa hari ini?",
    "Siap untuk pertandingan seru?",
    "Lapangan terbaik menantimu!",
    "Jangan lupa ajak teman mabar!",
    "Waktunya bakar kalori di lapangan!",
]

function useGreeting() {
    const [greeting, setGreeting] = useState("")
    const [caption, setCaption] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // 1. Determine Greeting based on Time
        const hours = new Date().getHours()
        let g = "Selamat Pagi"
        if (hours >= 11) g = "Selamat Siang"
        if (hours >= 15) g = "Selamat Sore"
        if (hours >= 19) g = "Selamat Malam"
        setGreeting(g)

        // 2. Random Caption
        setCaption(CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)])
    }, [])

    return { greeting, caption, mounted }
}

export function WelcomeNav() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const { greeting, caption, mounted } = useGreeting()

    // Requirements check: Authenticated AND Homepage
    if (status !== "authenticated" || pathname !== "/") {
        return null
    }

    // Client-side rendering only check
    if (!mounted) {
        return null
    }

    const firstName = session.user?.name?.split(" ")[0] || "Player"

    return (
        <div className="hidden lg:flex flex-col items-end mr-2 animate-in fade-in slide-in-from-right-4 duration-700">
            <span className="text-sm font-bold text-foreground">
                {greeting}, {firstName}! 👋
            </span>
            <span className="text-xs text-muted-foreground/80 italic">
                {caption}
            </span>
        </div>
    )
}
