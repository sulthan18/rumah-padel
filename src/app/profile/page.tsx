import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, History, LogOut, Mail, Phone, Settings, User, Award } from "lucide-react"
import Link from "next/link"


export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/auth/login")
    }

    const user = session.user
    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    return (
        <div className="container py-10 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                        <Button size="sm" variant="outline" className="h-8">
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Profil
                        </Button>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Informasi Pribadi
                        </CardTitle>
                        <CardDescription>Detail akun anda saat ini.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                            <div className="font-medium">{user.name}</div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <div className="font-medium">{user.email}</div>
                        </div>
                        {/* Add phone if available in session extended type */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Aktivitas
                        </CardTitle>
                        <CardDescription>Menu cepat untuk aktivitas anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/bookings" className="block">
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="font-medium">Riwayat Booking</div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    →
                                </Button>
                            </div>
                        </Link>

                        <div className="pt-2">
                            {/* Using a form for signout to keep it server-component friendly if needed, 
                             but best to componentize the client side logic. 
                             For now, let's use a client component wrapper or simple link if handling in layout/navbar mainly. 
                             Let's assume there isn't a dedicated SignOutButton component globally yet, 
                             so I'll make a client component for it or just a link to auth signout.
                         */}
                            <form action="/api/auth/signout" method="POST">
                                <Button variant="destructive" className="w-full" type="submit">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Keluar Aplikasi
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Achievements
                    </CardTitle>
                    <CardDescription>Your collection of achievements.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(user as any).achievements?.map((userAchievement: any) => (
                        <div key={userAchievement.achievementId} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                                <img src={userAchievement.achievement.icon} alt={userAchievement.achievement.name} className="w-10 h-10" />
                            </div>
                            <p className="font-semibold">{userAchievement.achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{userAchievement.achievement.description}</p>
                        </div>
                    ))}
                    {(user as any).achievements?.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground">No achievements yet. Keep playing to earn them!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
