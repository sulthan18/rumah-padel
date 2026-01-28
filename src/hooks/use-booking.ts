import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { format } from "date-fns"
import { PRICING } from "@/lib/constants"
import { useRouter } from "next/navigation"

export function useBooking() {
    const { data: session } = useSession()
    const router = useRouter()

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedCourt, setSelectedCourt] = useState<string | undefined>(undefined)
    const [selectedSlots, setSelectedSlots] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleSlot = (time: string) => {
        if (selectedSlots.includes(time)) {
            setSelectedSlots(selectedSlots.filter((t) => t !== time))
        } else {
            // Logic for contiguous slots can be added here
            // For now, simple selection
            if (selectedSlots.length >= PRICING.maximumBooking) {
                toast.error(`Maximum booking is ${PRICING.maximumBooking} hours`)
                return
            }
            setSelectedSlots([...selectedSlots, time].sort())
        }
    }

    const resetSelection = () => {
        setSelectedSlots([])
    }

    const submitBooking = async () => {
        if (!session) {
            toast.error("Please login to book a court")
            router.push("/auth/signin")
            return
        }

        if (!selectedCourt || !selectedDate || selectedSlots.length === 0) {
            toast.error("Please complete your selection")
            return
        }

        setIsSubmitting(true)

        try {
            // Assumes contiguous slots for now. 
            // In a real app, we'd need to validate they are contiguous and take the range.
            const sortedSlots = selectedSlots.sort()
            const startTimeStr = sortedSlots[0]
            const endTimeSlot = sortedSlots[sortedSlots.length - 1]

            // Calculate end time (start time + 1 hour)
            const [endHour, endMinute] = endTimeSlot.split(":").map(Number)
            const endTimeStr = `${(endHour + 1).toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

            const startTime = new Date(selectedDate)
            const [startH, startM] = startTimeStr.split(":").map(Number)
            startTime.setHours(startH, startM, 0, 0)

            const endTime = new Date(selectedDate)
            const [endH, endM] = endTimeStr.split(":").map(Number)
            endTime.setHours(endH, endM, 0, 0)

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courtId: selectedCourt,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Booking failed")
            }

            toast.success("Booking created successfully!")
            router.push("/dashboard") // Redirect to dashboard
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calculate total price based on selected court type (assuming price is passed or fetched)
    // This logic normally needs the court price. For simplicty, we will calculate in the component 
    // or fetch court details here too.

    return {
        selectedDate,
        setSelectedDate,
        selectedCourt,
        setSelectedCourt,
        selectedSlots,
        toggleSlot,
        resetSelection,
        submitBooking,
        isSubmitting,
        isAuthenticated: !!session,
    }
}
