import { MembershipTier } from '@/shared/enums'

export interface PricingPlan {
    id: string
    tier: MembershipTier
    name: string
    price: string
    description: string
    features: string[]
    cta: string
    href: string
    popular: boolean
}
