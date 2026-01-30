"use client"

import { useBooking } from "@/hooks/use-booking"
import { useAvailability } from "@/hooks/use-availability"
import { BookingCalendar } from "./booking-calendar"
import { CourtSelector } from "./court-selector"
import { TimeSlotGrid } from "./time-slot-grid"
import { BookingSummary } from "./booking-summary"
import { COURTS_DATA } from "@/lib/constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookingForm() {
    const {
        selectedDate,
        setSelectedDate,
        selectedCourt,
        setSelectedCourt,
        selectedSlots,
        toggleSlot,
        submitBooking,
        isSubmitting,
        isAuthenticated
    } = useBooking()

    // Fetch slots whenever court or date changes
    const { slots, isLoading, isError } = useAvailability(selectedCourt, selectedDate)

    // Get selected court details for summary
    const courtDetails = COURTS_DATA.find(c => c.id === selectedCourt)

    const showSummary = selectedSlots.length > 0

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 min-h-[600px] relative transition-all duration-500">
            {/* Left Column: Selection Flow */}
            <div className={cn(
                "space-y-8 transition-all duration-500 ease-in-out w-full",
                showSummary ? "lg:w-[60%]" : "max-w-3xl mx-auto"
            )}>

                {/* Step 1: Calendar */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
                    <BookingCalendar
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                    />
                </section>

                {/* Step 2: Courts */}
                <section>
                    <CourtSelector
                        selectedCourt={selectedCourt}
                        onSelect={(id) => {
                            setSelectedCourt(id)
                        }}
                    />
                </section>

                {/* Step 3: Slots */}
                <section>
                    {isError ? (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Failed to load available slots. Please try again.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <TimeSlotGrid
                            slots={slots}
                            selectedSlots={selectedSlots}
                            isLoading={isLoading}
                            onToggle={toggleSlot}
                        />
                    )}
                </section>
            </div>

            {/* Right Column: Summary Sticky */}
            <div className={cn(
                "w-full lg:w-[35%] sticky top-24 transition-all duration-500 ease-in-out",
                showSummary
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10 hidden lg:block h-0 lg:w-0"
            )}>
                {selectedDate && (
                    <BookingSummary
                        selectedDate={selectedDate}
                        selectedCourtName={courtDetails?.name}
                        selectedSlots={selectedSlots}
                        pricePerHour={courtDetails?.pricePerHour || 0}
                        onConfirm={submitBooking}
                        isSubmitting={isSubmitting}
                        isAuthenticated={isAuthenticated}
                    />
                )}
            </div>
        </div>
    )
}
