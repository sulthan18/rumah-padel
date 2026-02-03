import Link from "next/link"
import { Home, History, User, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-zinc-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="font-black text-xl tracking-tighter flex items-center gap-2">
                        Rumah Padel
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors">
                        <Home className="w-4 h-4" />
                        Overview
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary/5 text-primary rounded-lg transition-colors">
                        <History className="w-4 h-4" />
                        Riwayat Booking
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        Profil
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-200">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Overlay could go here */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
