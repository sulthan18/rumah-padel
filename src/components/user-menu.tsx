"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { User, LogOut, Calendar, Zap, History } from "lucide-react"

export function UserMenu() {
    const { data: session } = useSession()

    // 🅰️ Guest View
    if (!session) {
        return (
            <div className="flex items-center gap-2">
                <Button onClick={() => signIn()} variant="default" className="font-bold px-6">
                    Masuk / Daftar
                </Button>
            </div>
        )
    }

    // Create initials from name
    const initials = session.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    const isAdmin = session.user?.email === "admin@padelflow.com" // Simple role check for now

    // 🅱️ Player & Admin View
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal mb-2">
                    <div className="flex flex-col space-y-1 p-2 bg-muted/50 rounded-lg">
                        <p className="text-sm font-bold leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {session.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                {/* 🅾️ Admin Menu */}
                {isAdmin && (
                    <>
                        <DropdownMenuItem asChild className="mb-2">
                            <Link href="/admin" className="cursor-pointer bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary font-semibold">
                                <Zap className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings" className="cursor-pointer py-2.5">
                        <History className="mr-2 h-4 w-4" />
                        <span>Riwayat Booking</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer py-2.5">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5 mt-1"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
