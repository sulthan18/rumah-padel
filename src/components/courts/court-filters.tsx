"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"

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
        router.push(`/courts?${params.toString()}`)
    }

    return (
        <FadeIn direction="right" className="space-y-8 p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-24">
            <div>
                <h3 className="font-bold text-lg mb-4 text-zinc-900">Filters</h3>
                <div className="space-y-6">
                    {/* Court Type */}
                    <div className="space-y-4">
                        <Label className="text-zinc-500 font-semibold uppercase text-xs tracking-wider">Court Type</Label>
                        <RadioGroup
                            defaultValue={currentType || "ALL"}
                            onValueChange={(val) => updateFilter("type", val === "ALL" ? null : val)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ALL" id="type-all" />
                                <Label htmlFor="type-all" className="font-medium">All Types</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="INDOOR" id="type-indoor" />
                                <Label htmlFor="type-indoor" className="font-medium">Indoor</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="OUTDOOR" id="type-outdoor" />
                                <Label htmlFor="type-outdoor" className="font-medium">Outdoor</Label>
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
                            onValueChange={(val) => updateFilter("surface", val === "ALL" ? null : val)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ALL" id="surf-all" />
                                <Label htmlFor="surf-all" className="font-medium">Any Surface</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="CARPET" id="surf-carpet" />
                                <Label htmlFor="surf-carpet" className="font-medium">Pro Carpet</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="GRASS" id="surf-grass" />
                                <Label htmlFor="surf-grass" className="font-medium">Artificial Grass</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/courts")}
            >
                Reset Filters
            </Button>
        </FadeIn>
    )
}
