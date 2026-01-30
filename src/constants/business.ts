/**
 * Business Configuration
 * Operating hours, pricing, and court data
 */

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

// Court Types
export const COURT_TYPES = {
    INDOOR_PREMIUM: "Indoor Premium",
    OUTDOOR: "Outdoor",
} as const

// Court Data
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

// Time Slots Generator
export function getTimeSlots(): string[] {
    const slots: string[] = []
    for (let hour = BUSINESS_HOURS.openTime; hour < BUSINESS_HOURS.closeTime; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
}
