import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { formatRupiah, calculateDuration } from "@/lib/utils"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface BookingSummaryProps {
    selectedDate: Date
    selectedCourtName: string | undefined
    selectedSlots: string[]
    pricePerHour: number
    onConfirm: () => void
    isSubmitting: boolean
    isAuthenticated: boolean
    lookingForPlayers: boolean
    onLookingForPlayersChange: (value: boolean) => void
    isRecurring: boolean
    onIsRecurringChange: (value: boolean) => void
    recurringRule: 'weekly' | 'bi-weekly'
    onRecurringRuleChange: (value: 'weekly' | 'bi-weekly') => void
    recurringEndDate: Date | undefined
    onRecurringEndDateChange: (date: Date | undefined) => void
}

export function BookingSummary({
    selectedDate,
    selectedCourtName,
    selectedSlots,
    pricePerHour,
    onConfirm,
    isSubmitting,
    isAuthenticated,
    lookingForPlayers,
    onLookingForPlayersChange,
    isRecurring,
    onIsRecurringChange,
    recurringRule,
    onRecurringRuleChange,
    recurringEndDate,
    onRecurringEndDateChange
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
        <Card className="border-primary/20 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary pt-4">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
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

                <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="lookingForPlayers" checked={lookingForPlayers} onCheckedChange={onLookingForPlayersChange} />
                    <Label htmlFor="lookingForPlayers">Looking for players?</Label>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="isRecurring" checked={isRecurring} onCheckedChange={onIsRecurringChange} />
                    <Label htmlFor="isRecurring">Make this a recurring booking</Label>
                </div>

                {isRecurring && (
                    <div className="space-y-4 pt-2">
                        <Select onValueChange={onRecurringRuleChange} defaultValue={recurringRule}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select recurrence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {recurringEndDate ? format(recurringEndDate, "PPP") : <span>Pick an end date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={recurringEndDate}
                                    onSelect={onRecurringEndDateChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
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
