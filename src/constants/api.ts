/**
 * API Routes Configuration
 * Centralized endpoints for the application
 */
export const API_ROUTES = {
    bookings: {
        create: "/api/booking",
        available: "/api/bookings/available",
        user: "/api/bookings/user",
    },
    payments: {
        webhook: "/api/payment/webhook",
    },
} as const
