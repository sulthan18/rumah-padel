import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TimeSlot } from "@/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TimeSlotGridProps {
    slots: TimeSlot[]
    selectedSlots: string[]
    isLoading: boolean
    onToggle: (time: string) => void
    selectedCourt: string | undefined
    selectedDate: Date | undefined
}

export function TimeSlotGrid({ slots, selectedSlots, isLoading, onToggle, selectedCourt, selectedDate }: TimeSlotGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (slots.length === 0) {
        return (
            <Card className="bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <p>No slots available or select a court/date first.</p>
                </CardContent>
            </Card>
        )
    }

    const handleJoinWaitlist = async (time: string) => {
        if (!selectedCourt || !selectedDate) {
            toast.error("Please select a court and date first.");
            return;
        }

        const [hour, minute] = time.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hour, minute, 0, 0);

        const res = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courtId: selectedCourt, startTime }),
        });

        if (res.ok) {
            toast.success("You have been added to the waitlist.");
        } else {
            toast.error("Failed to join the waitlist.");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">3. Select Time Slots</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.time)
                    const isAvailable = slot.available

                    if (!isAvailable) {
                        return (
                            <Button
                                key={slot.time}
                                variant="outline"
                                className="h-14 flex flex-col items-center justify-center p-0 transition-all"
                                onClick={() => handleJoinWaitlist(slot.time)}
                            >
                                <span className="text-sm font-medium">{slot.time}</span>
                                <span className="text-xs uppercase text-blue-500">Join Waitlist</span>
                            </Button>
                        )
                    }

                    return (
                        <Button
                            key={slot.time}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                                "h-14 flex flex-col items-center justify-center p-0 transition-all",
                                !isAvailable && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground decoration-slate-400 decoration-wavy",
                                isSelected && "ring-2 ring-primary ring-offset-2"
                            )}
                            disabled={!isAvailable}
                            onClick={() => onToggle(slot.time)}
                        >
                            <span className="text-sm font-medium">{slot.time}</span>
                            <span className="text-[10px] uppercase">
                                {isAvailable ? (isSelected ? "Selected" : "Available") : "Booked"}
                            </span>
                        </Button>
                    )
                })}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border rounded bg-background" /> Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border rounded bg-primary" /> Selected
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border rounded bg-muted opacity-50" /> Booked
                </div>
            </div>
        </div>
    )
}
