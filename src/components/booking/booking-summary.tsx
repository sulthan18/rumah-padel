import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatRupiah, calculateDuration } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface BookingSummaryProps {
    selectedDate: Date
    selectedCourtName: string | undefined
    selectedSlots: string[]
    pricePerHour: number
    onConfirm: () => void
    isSubmitting: boolean
    isAuthenticated: boolean
}

export function BookingSummary({
    selectedDate,
    selectedCourtName,
    selectedSlots,
    pricePerHour,
    onConfirm,
    isSubmitting,
    isAuthenticated
}: BookingSummaryProps) {
    const sortedSlots = [...selectedSlots].sort()
    const startTime = sortedSlots[0]
    const slotCount = sortedSlots.length

    // Simple calculation: slotCount * pricePerHour
    const totalPrice = slotCount * pricePerHour

    if (slotCount === 0 || !selectedCourtName) {
        return null
    }

    return (
        <Card className="sticky top-20 border-primary/20 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg text-primary pt-4">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Court</span>
                    <span className="font-medium">{selectedCourtName}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">
                        {startTime} ({slotCount} hours)
                    </span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per hour</span>
                    <span>{formatRupiah(pricePerHour)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">{formatRupiah(totalPrice)}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full text-lg h-12"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                        </>
                    ) : (
                        "Lanjut ke Pembayaran"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
