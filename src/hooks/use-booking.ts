import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { format } from "date-fns"
import { PRICING, COURTS_DATA } from "@/lib/constants"
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
        if (!selectedCourt || !selectedDate || selectedSlots.length === 0) {
            toast.error("Mohon lengkapi semua pilihan (lapangan, tanggal, dan jam)")
            return
        }

        // Get court details
        const courtDetails = COURTS_DATA.find(c => c.id === selectedCourt)
        if (!courtDetails) {
            toast.error("Lapangan tidak ditemukan")
            return
        }

        // Save booking data to sessionStorage
        const bookingData = {
            courtId: selectedCourt,
            courtName: courtDetails.name,
            date: format(selectedDate, "yyyy-MM-dd"),
            slots: selectedSlots,
            pricePerHour: courtDetails.pricePerHour,
        }

        sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData))

        // Redirect to checkout
        toast.success("Lanjut ke pembayaran...")
        router.push("/booking/checkout")
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
