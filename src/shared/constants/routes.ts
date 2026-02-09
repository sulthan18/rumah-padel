/**
 * Application Routes
 * 
 * Centralized route definitions for type-safe navigation.
 */

export const ROUTES = {
    // Public routes
    HOME: '/',
    BOOKING: '/booking',
    COURTS: '/courts',
    TOURNAMENTS: '/tournaments',
    PRICING: '/pricing',
    LOCATION: '/location',

    // Auth routes
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',

    // Dashboard routes
    DASHBOARD: '/dashboard',
    PROFILE: '/dashboard/profile',
    MY_BOOKINGS: '/dashboard/bookings',
    MY_TOURNAMENTS: '/dashboard/tournaments',

    // API routes
    API: {
        BOOKING: '/api/booking',
        PAYMENT_WEBHOOK: '/api/payment/webhook',
        EMAIL: '/api/email/send'
    }
} as const

/**
 * Helper to build tournament detail route
 */
export function getTournamentRoute(id: string): string {
    return `/tournaments/${id}`
}

/**
 * Helper to build court detail route
 */
export function getCourtRoute(id: string): string {
    return `/courts/${id}`
}
