/**
 * Application Enums & Statuses
 */

// Booking Status
export const BOOKING_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
} as const

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
} as const

// Payment Providers
export const PAYMENT_PROVIDERS = {
    SIMULATION: "simulation",
    MIDTRANS: "midtrans",
} as const

// User Roles
export const USER_ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const
