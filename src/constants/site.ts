/**
 * Site Configuration
 * General application settings and metadata
 */
export const SITE_CONFIG = {
    name: "Rumah Padel",
    description: "Premier Padel Club in Indonesia",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const
