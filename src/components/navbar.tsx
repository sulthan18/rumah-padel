"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user-menu"
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants"
import { Swords } from "lucide-react"
import dynamic from "next/dynamic"

const MobileNav = dynamic(() => import("@/components/mobile-nav").then(mod => mod.MobileNav), {
    ssr: false,
})

export function Navbar() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">

                {/* 1. Zona Kiri: Brand Identity */}
                <Link href="/" className="mr-6 flex items-center space-x-2 hover:opacity-90 transition-opacity">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        {/* Pake Swords karena mirip raket silang :) */}
                        <Swords className="h-5 w-5 text-primary-foreground -rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {SITE_CONFIG.name}
                    </span>
                </Link>

                {/* 2. Zona Tengah: Main Navigation (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2">
                    <nav className="flex items-center px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 3. Zona Kanan: Auth Switch & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <UserMenu />
                    </div>

                    {/* Mobile Menu (Hamburger) */}
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
