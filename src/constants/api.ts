/**
 * API Routes Configuration
 * Centralized endpoints for the application
 */
export const API_ROUTES = {
    bookings: {
        create: "/api/bookings",
        available: "/api/bookings/available",
        user: "/api/bookings/user",
    },
    payments: {
        simulate: "/api/payments/simulate",
        webhook: "/api/payments/webhook",
    },
} as const
