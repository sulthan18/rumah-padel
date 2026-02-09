/**
 * Common Regex Patterns
 * 
 * Centralized regular expressions for validation.
 */

export const REGEX_PATTERNS = {
    /** Indonesian phone number: +62 or 08xx format */
    PHONE: /^\+?[1-9]\d{9,14}$/,

    /** Standard email validation */
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    /** Time slot format (HH:MM) */
    TIME_SLOT: /^\d{2}:\d{2}$/,

    /** UUID v4 */
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,

    /** Promo code (alphanumeric, 4-20 chars) */
    PROMO_CODE: /^[A-Z0-9]{4,20}$/
} as const
