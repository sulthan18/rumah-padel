/**
 * Booking Business Rules Configuration
 * 
 * Centralized configuration for booking-related business rules.
 * Extracted from booking-engine.ts to eliminate magic numbers.
 */

import { MembershipTier } from '@/shared/enums'

/**
 * Booking window rules (how many days in advance can book)
 */
export const BOOKING_WINDOW_DAYS = {
    [MembershipTier.GUEST]: 3,
    [MembershipTier.PRO]: 7,
    [MembershipTier.EXCLUSIVE]: 14
} as const

/**
 * Discount percentages by membership tier
 */
export const MEMBERSHIP_DISCOUNTS = {
    [MembershipTier.GUEST]: 0,
    [MembershipTier.PRO]: 10,      // 10% discount
    [MembershipTier.EXCLUSIVE]: 100 // Free non-peak usage
} as const

/**
 * Booking constraints
 */
export const BOOKING_CONSTRAINTS = {
    /** Admin fee added to all bookings (Rp) */
    ADMIN_FEE: 5000,

    /** Minimum hours before booking time can book */
    MIN_ADVANCE_HOURS: 2,

    /** Maximum months in advance for bookings */
    MAX_ADVANCE_MONTHS: 3,

    /** Maximum hours per single booking */
    MAX_HOURS_PER_BOOKING: 4,

    /** Maximum active bookings per user */
    MAX_ACTIVE_BOOKINGS_PER_USER: 5
} as const

/**
 * Time slot configuration
 */
export const TIME_SLOTS = {
    /** Operating hours start */
    OPENING_TIME: '08:00',

    /** Operating hours end */
    CLOSING_TIME: '22:00',

    /** Slot duration in minutes */
    SLOT_DURATION_MINUTES: 60,

    /** Peak hours (higher pricing) */
    PEAK_HOURS: ['17:00', '18:00', '19:00', '20:00', '21:00'] as const,

    /** Peak hour multiplier */
    PEAK_HOUR_MULTIPLIER: 1.2
} as const

/**
 * Helper function to get booking window for a tier
 */
export function getBookingWindowDays(tier: MembershipTier): number {
    return BOOKING_WINDOW_DAYS[tier] ?? BOOKING_WINDOW_DAYS[MembershipTier.GUEST]
}

/**
 * Helper function to get discount percentage for a tier
 */
export function getDiscountPercentage(tier: MembershipTier): number {
    return MEMBERSHIP_DISCOUNTS[tier] ?? 0
}
