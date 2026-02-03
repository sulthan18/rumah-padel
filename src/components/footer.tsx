import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react" // Removed Youtube (not exported?)
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Bio */}
                    <div className="space-y-6">
                        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="text-primary">PADEL</span>FLOW
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            Ciptakan momen seru di lapangan padel terbaik. Fasilitas standar internasional, komunitas solid, dan pengalaman main yang tak terlupakan.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Menu</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/booking" className="hover:text-white transition-colors">Booking Lapangan</Link></li>
                            <li><Link href="/membership" className="hover:text-white transition-colors">Membership</Link></li>
                            <li><Link href="/tournaments" className="hover:text-white transition-colors">Turnamen</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Kontak</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Jl. Padel Juara No. 1, Jakarta Selatan, 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>hi@rumahpadel.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Jam Buka</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                    <div className="text-white font-medium">Senin - Jumat</div>
                                    <div className="text-sm">06:00 - 23:00</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                    <div className="text-white font-medium">Sabtu - Minggu</div>
                                    <div className="text-sm">06:00 - 24:00</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
                    <div>
                        &copy; 2024 Rumah Padel Indonesia. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
