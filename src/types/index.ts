/**
 * Application Type Definitions
 */

// User Types
export type Role = "USER" | "ADMIN"

export interface User {
    id: string
    name: string | null
    email: string
    image: string | null
    role: Role
}

// Court Types
export interface Court {
    id: string
    name: string
    description: string | null
    pricePerHour: number
    isActive: boolean
}

// Booking Types
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface Booking {
    id: string
    userId: string
    courtId: string
    startTime: Date | string
    endTime: Date | string
    totalPrice: number
    status: BookingStatus
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

// Payment Types
export interface Payment {
    id: string
    bookingId: string
    amount: number
    provider: string
    externalId: string | null
    status: string
}

export interface CreatePaymentInput {
    bookingId: string
    amount: number
    provider: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
    total: number
    page: number
    pageSize: number
}

// Time Slot Types
export interface TimeSlot {
    time: string
    available: boolean
    bookingId?: string
}

export interface AvailableSlotsQuery {
    courtId: string
    date: string
}

// Error Types
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational = true
    ) {
        super(message)
        Object.setPrototypeOf(this, AppError.prototype)
    }
}
