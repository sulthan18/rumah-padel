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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Selection Flow */}
            <div className="lg:col-span-8 space-y-8">

                {/* Step 1: Calendar */}
                <section>
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
                            // Clear slots when changing court
                            // Note: Logic could be moved to hook but fine here for composition
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
            <div className="lg:col-span-4">
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
