/**
 * Booking Status Enum
 * 
 * Lifecycle states for a booking.
 */

export enum BookingStatus {
    PENDING = 'PENDING',       // Awaiting payment
    CONFIRMED = 'CONFIRMED',   // Payment received
    CANCELLED = 'CANCELLED',   // Cancelled by user/admin
    COMPLETED = 'COMPLETED',   // Booking time has passed
    NO_SHOW = 'NO_SHOW'        // User didn't show up
}

export function isBookingStatus(value: string): value is BookingStatus {
    return Object.values(BookingStatus).includes(value as BookingStatus)
}
