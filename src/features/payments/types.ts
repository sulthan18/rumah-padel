/**
 * Payment Feature Types
 */

export interface Payment {
    id: string
    bookingId: string
    amount: number
    provider: string
    externalId: string | null
    status: string // Consider using PaymentStatus enum in future refactor
}

export interface CreatePaymentInput {
    bookingId: string
    amount: number
    provider: string
}
