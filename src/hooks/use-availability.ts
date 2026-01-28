import useSWR from "swr"
import { format } from "date-fns"
import { AvailableSlotsQuery } from "@/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAvailability(courtId: string | undefined, date: Date | undefined) {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined

    const shouldFetch = courtId && formattedDate

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `/api/bookings/available?courtId=${courtId}&date=${formattedDate}` : null,
        fetcher
    )

    return {
        slots: data?.data?.slots || [],
        isLoading,
        isError: error,
        mutate,
    }
}
