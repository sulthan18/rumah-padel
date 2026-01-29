"use client"

import { useState } from "react"
import { X, ArrowRight } from "lucide-react"

export function TopBanner() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 relative z-50">
            <div className="container mx-auto flex items-center justify-between text-xs md:text-sm font-medium">
                <div className="flex-1 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">Promo</span>
                    <span>
                        🎉 Grand Opening Promo: Diskon 20% khusus member baru!
                        <span className="hidden md:inline"> Gunakan kode <span className="font-bold underline decoration-wavy decoration-white/50">MORNINGSMASH</span></span>
                    </span>
                    <a href="/auth/signup" className="inline-flex items-center gap-1 underline font-bold ml-2 hover:text-white/80 transition-colors">
                        Klaim Disini <ArrowRight className="h-3 w-3" />
                    </a>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="hidden md:block hover:bg-white/20 p-1 rounded-full transition-colors absolute right-4 md:static"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
