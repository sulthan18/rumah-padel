"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { Search } from "lucide-react"

export function CourtFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentType = searchParams.get("type") // INDOOR | OUTDOOR
    const currentSurface = searchParams.get("surface") // GRASS | CARPET

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        // Reset to page 1 on filter change
        params.delete("page")
        router.push(`/courts?${params.toString()}`)
    }

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) params.set("q", term)
        else params.delete("q")

        // Reset to page 1 on new search
        params.delete("page")

        router.push(`/courts?${params.toString()}`)
    }

    return (
        <FadeIn direction="right" className="h-full">
            <div className="space-y-8 p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-24 h-full">
                <div>
                    <h3 className="font-bold text-lg mb-6 text-zinc-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full" />
                        Filters & Search
                    </h3>

                    <div className="space-y-8">
                        {/* Search Bar */}
                        <div className="space-y-2">
                            <Label className="text-zinc-500 font-semibold uppercase text-xs tracking-wider">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Find your court..."
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-zinc-400"
                                    defaultValue={searchParams.get("q")?.toString()}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setTimeout(() => handleSearch(value), 500)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-full h-px bg-zinc-100" />

                        {/* Court Type */}
                        <div className="space-y-4">
                            <Label className="text-zinc-500 font-semibold uppercase text-xs tracking-wider">Court Type</Label>
                            <RadioGroup
                                defaultValue={currentType || "ALL"}
                                onValueChange={(val) => updateFilter("type", val !== "ALL" ? val : null)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ALL" id="type-all" />
                                    <Label htmlFor="type-all" className="font-medium cursor-pointer">All Types</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="INDOOR" id="type-indoor" />
                                    <Label htmlFor="type-indoor" className="font-medium cursor-pointer">Indoor</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="OUTDOOR" id="type-outdoor" />
                                    <Label htmlFor="type-outdoor" className="font-medium cursor-pointer">Outdoor</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-zinc-100" />

                        {/* Surface */}
                        <div className="space-y-4">
                            <Label className="text-zinc-500 font-semibold uppercase text-xs tracking-wider">Surface Material</Label>
                            <RadioGroup
                                defaultValue={currentSurface || "ALL"}
                                onValueChange={(val) => updateFilter("surface", val !== "ALL" ? val : null)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ALL" id="surf-all" />
                                    <Label htmlFor="surf-all" className="font-medium cursor-pointer">Any Surface</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="CARPET" id="surf-carpet" />
                                    <Label htmlFor="surf-carpet" className="font-medium cursor-pointer">Pro Carpet</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="GRASS" id="surf-grass" />
                                    <Label htmlFor="surf-grass" className="font-medium cursor-pointer">Artificial Grass</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => router.push("/courts")}
                >
                    Reset All Filters
                </Button>
            </div>
        </FadeIn>
    )
}
