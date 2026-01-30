import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingCalendarProps {
    selectedDate: Date | undefined
    onSelect: (date: Date | undefined) => void
}

export function BookingCalendar({ selectedDate, onSelect }: BookingCalendarProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">1. Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border shadow"
                />
            </CardContent>
        </Card>
    )
}
