/**
 * Membership Tier Enum
 * 
 * Defines the different membership levels available in the system.
 * Used for access control, pricing calculations, and feature gating.
 */

export enum MembershipTier {
    GUEST = 'GUEST',
    PRO = 'PRO',
    EXCLUSIVE = 'EXCLUSIVE'
}

/**
 * Type guard to check if a string is a valid MembershipTier
 */
export function isMembershipTier(value: string): value is MembershipTier {
    return Object.values(MembershipTier).includes(value as MembershipTier)
}
