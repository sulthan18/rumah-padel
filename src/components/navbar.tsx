"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user-menu"
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants"
import { Menu, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

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
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col h-full mt-6">
                                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                        <Swords className="h-4 w-4 text-primary-foreground -rotate-45" />
                                    </div>
                                    <span className="font-bold text-lg">{SITE_CONFIG.name}</span>
                                </Link>

                                <div className="flex flex-col space-y-2 flex-1">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2 px-2">Menu</h4>
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                                                pathname === link.href
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="pt-6 border-t mt-auto mb-6">
                                    <UserMenu />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
