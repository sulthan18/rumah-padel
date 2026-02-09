/**
 * Payment Status Enum
 * 
 * States for payment processing via Midtrans.
 */

export enum PaymentStatus {
    PENDING = 'PENDING',     // Awaiting payment
    SUCCESS = 'SUCCESS',     // Payment confirmed
    FAILED = 'FAILED',       // Payment failed/declined
    EXPIRED = 'EXPIRED',     // Payment link expired
    REFUNDED = 'REFUNDED'    // Amount refunded
}

export function isPaymentStatus(value: string): value is PaymentStatus {
    return Object.values(PaymentStatus).includes(value as PaymentStatus)
}
