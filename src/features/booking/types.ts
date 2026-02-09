/**
 * Booking Feature Types
 */

import { Court } from '../courts/types'
import { User } from '../auth/types'
import { BookingStatus } from '@/shared/enums'

// Re-export BookingStatus from shared enums to maintain compatibility if needed, 
// or prefer using the enum directly. for now, using the enum as type.

export interface Booking {
    id: string
    userId: string
    courtId: string
    startTime: Date | string
    endTime: Date | string
    totalPrice: number
    status: BookingStatus | string // Allow string for compatibility with existing code that might not use enum strictly yet
    createdAt: Date | string
    court?: Court
    user?: User
}

export interface CreateBookingInput {
    courtId: string
    startTime: Date | string
    endTime: Date | string
}

export interface BookingWithDetails extends Booking {
    court: Court
    user: User
}

export interface TimeSlot {
    time: string
    available: boolean
    bookingId?: string
}

export interface AvailableSlotsQuery {
    courtId: string
    date: string
}
