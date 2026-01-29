import Image from "next/image"
import { Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const posts = [
    "/images/hero-bg.jpg",
    "/images/signup-bg.jpg",
    "/images/hero-bg.jpg",
    "/images/signup-bg.jpg",
    "/images/hero-bg.jpg",
    "/images/signup-bg.jpg",
]

export function InstagramFeed() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-2">
                            #PadelVibes
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Intip keseruan teman-teman kita di lapangan.
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2 rounded-full h-12 px-6" asChild>
                        <Link href="https://instagram.com" target="_blank">
                            <Instagram className="h-5 w-5" />
                            Follow @rumahpadel
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                    {posts.map((src, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 group cursor-pointer">
                            <Image
                                src={src}
                                alt={`Instagram post ${i}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Instagram className="text-white h-8 w-8 drop-shadow-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
