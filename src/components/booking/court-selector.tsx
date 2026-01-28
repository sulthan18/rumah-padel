import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatRupiah } from "@/lib/utils"
import { Check } from "lucide-react"
import { COURTS_DATA } from "@/lib/constants"

interface CourtSelectorProps {
    selectedCourt: string | undefined
    onSelect: (courtId: string) => void
}

export function CourtSelector({ selectedCourt, onSelect }: CourtSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">2. Select Court</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COURTS_DATA.map((court) => (
                    <Card
                        key={court.id}
                        className={cn(
                            "cursor-pointer transition-all hover:border-primary relative overflow-hidden",
                            selectedCourt === court.id ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:shadow-md"
                        )}
                        onClick={() => onSelect(court.id)}
                    >
                        {selectedCourt === court.id && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{court.name}</CardTitle>
                            <CardDescription className="text-xs">{court.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-primary mb-2">
                                {formatRupiah(court.pricePerHour)}
                                <span className="text-xs text-muted-foreground font-normal">/hour</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {court.features.map((feature) => (
                                    <span key={feature} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
