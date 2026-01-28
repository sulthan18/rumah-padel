/**
 * Application Constants
 * Centralized configuration values for Rumah Padel
 */

// Site Information
export const SITE_CONFIG = {
    name: "Rumah Padel",
    description: "Premier Padel Club in Indonesia",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const

// Navigation Links
export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Book Court", href: "/booking" },
    { label: "About", href: "/about" },
] as const

// Business Hours
export const BUSINESS_HOURS = {
    openTime: 6, // 6 AM
    closeTime: 23, // 11 PM
    slotDuration: 1, // 1 hour slots
} as const

// Pricing (in Rupiah)
export const PRICING = {
    indoorPremium: 150000,
    outdoor: 120000,
    minimumBooking: 1, // hours
    maximumBooking: 3, // hours
} as const

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

// Court Types
export const COURT_TYPES = {
    INDOOR_PREMIUM: "Indoor Premium",
    OUTDOOR: "Outdoor",
} as const

export const COURTS_DATA = [
    {
        id: "court-1",
        name: "Court 1",
        description: "Indoor Premium with Glass Walls",
        pricePerHour: 150000,
        features: ["Indoor", "AC", "Premium Turf"],
        type: COURT_TYPES.INDOOR_PREMIUM
    },
    {
        id: "court-2",
        name: "Court 2",
        description: "Indoor Premium with LED",
        pricePerHour: 150000,
        features: ["Indoor", "LED Lights", "Pro Surface"],
        type: COURT_TYPES.INDOOR_PREMIUM
    },
    {
        id: "court-3",
        name: "Court 3",
        description: "Outdoor Standard",
        pricePerHour: 120000,
        features: ["Outdoor", "Night Lighting", "Good Airflow"],
        type: COURT_TYPES.OUTDOOR
    }
] as const

// API Routes
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

// Time Slots (Operating Hours)
export function getTimeSlots(): string[] {
    const slots: string[] = []
    for (let hour = BUSINESS_HOURS.openTime; hour < BUSINESS_HOURS.closeTime; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
}
