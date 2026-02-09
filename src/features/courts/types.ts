/**
 * Court Feature Types
 */

export interface Court {
    id: string
    name: string
    description: string | null
    pricePerHour: number
    isActive: boolean
}
