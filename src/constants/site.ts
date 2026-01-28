/**
 * Site Configuration
 * General application settings and metadata
 */
export const SITE_CONFIG = {
    name: "PadelFlow",
    description: "Premier Padel Club in Indonesia",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const
