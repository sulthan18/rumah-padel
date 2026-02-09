/**
 * Pricing Plans Configuration
 * 
 * Membership tier definitions and features.
 * Extracted from components/home/pricing.tsx for reusability.
 */

import { MembershipTier } from '@/shared/enums'
import { ROUTES } from '@/shared/constants'
import { PricingPlan } from '../types'

export const PRICING_PLANS: ReadonlyArray<PricingPlan> = [
    {
        id: 'guest',
        tier: MembershipTier.GUEST,
        name: 'Guest',
        price: 'Pay-as-you-go',
        description: 'Main santai tanpa komitmen bulanan.',
        features: [
            'Akses Booking H-3',
            'Harga Normal',
            'Akses Fasilitas Standar',
            'Public Locker'
        ],
        cta: 'Booking Sekarang',
        href: ROUTES.BOOKING,
        popular: false
    },
    {
        id: 'pro',
        tier: MembershipTier.PRO,
        name: 'Pro Member',
        price: 'Rp 800rb / bulan',
        description: 'Buat kamu yang rutin main tiap minggu.',
        features: [
            'Akses Booking H-7 (Prioritas)',
            'Diskon 10% Setiap Booking',
            'Private Locker',
            'Free Towel Rental'
        ],
        cta: 'Join Member',
        href: '/membership',
        popular: true
    },
    {
        id: 'exclusive',
        tier: MembershipTier.EXCLUSIVE,
        name: 'Exclusive',
        price: 'Rp 30jt / tahun',
        description: 'Status tertinggi dengan benefit tanpa batas.',
        features: [
            'Prioritas Pembelian Saham',
            'Akses Event & Tur Eksklusif',
            'Welcome Box (Jersey & Racket)',
            'Legacy Wall Inductee',
            'Personal Assistant Booking',
            'All Access Pass'
        ],
        cta: 'Apply for Exclusive',
        href: '/membership?tier=exclusive',
        popular: false
    }
] as const

/**
 * Helper to get plan by tier
 */
export function getPlanByTier(tier: MembershipTier): PricingPlan | undefined {
    return PRICING_PLANS.find(plan => plan.tier === tier)
}

/**
 * Helper to get plan by ID
 */
export function getPlanById(id: string): PricingPlan | undefined {
    return PRICING_PLANS.find(plan => plan.id === id)
}
