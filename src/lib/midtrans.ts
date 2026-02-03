import Midtrans from "midtrans-client"

// Initialize Midtrans Snap client
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"
const serverKey = process.env.MIDTRANS_SERVER_KEY || ""
const clientKey = process.env.MIDTRANS_CLIENT_KEY || ""

// Midtrans initialized in ${isProduction ? 'production' : 'sandbox'} mode

const snap = new Midtrans.Snap({
    isProduction,
    serverKey,
    clientKey,
})

export interface MidtransCustomerDetails {
    first_name: string
    email: string
    phone: string
}

export interface MidtransTransactionDetails {
    order_id: string
    gross_amount: number
}

export interface CreateTransactionParams {
    orderId: string
    amount: number
    customerDetails: MidtransCustomerDetails
    itemDetails?: {
        id: string
        name: string
        price: number
        quantity: number
    }[]
}

/**
 * Create a Midtrans Snap transaction
 * Returns snap token for frontend
 */
export async function createTransaction(params: CreateTransactionParams) {
    const { orderId, amount, customerDetails, itemDetails } = params

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount,
        },
        customer_details: customerDetails,
        item_details: itemDetails || [
            {
                id: orderId,
                name: "Booking Lapangan Padel",
                price: amount,
                quantity: 1,
            },
        ],
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation/${orderId}`,
        },
    }

    try {
        const transaction = await snap.createTransaction(parameter)
        return {
            token: transaction.token,
            redirectUrl: transaction.redirect_url,
        }
    } catch (error: any) {
        console.error("Midtrans create transaction error:", error)
        // Throw the specific error message from Midtrans if available
        const errorMessage = error?.message || error?.ApiResponse?.status_message || "Failed to create payment transaction"
        throw new Error(errorMessage)
    }
}

/**
 * Get transaction status from Midtrans
 */
export async function getTransactionStatus(orderId: string) {
    try {
        const status = await snap.transaction.status(orderId)
        return status
    } catch (error) {
        console.error("Midtrans get status error:", error)
        throw new Error("Failed to get transaction status")
    }
}

/**
 * Cancel a pending transaction
 */
export async function cancelTransaction(orderId: string) {
    try {
        const result = await snap.transaction.cancel(orderId)
        return result
    } catch (error) {
        console.error("Midtrans cancel transaction error:", error)
        throw new Error("Failed to cancel transaction")
    }
}

/**
 * Verify notification signature from Midtrans webhook
 */
export function verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
): boolean {
    const crypto = require("crypto")
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ""

    const hash = crypto
        .createHash("sha512")
        .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
        .digest("hex")

    return hash === signatureKey
}

/**
 * Map Midtrans transaction status to our payment status
 */
export function mapTransactionStatus(transactionStatus: string): string {
    switch (transactionStatus) {
        case "capture":
        case "settlement":
            return "SUCCESS"
        case "pending":
            return "PENDING"
        case "deny":
        case "cancel":
        case "expire":
            return "FAILED"
        default:
            return "PENDING"
    }
}

export const midtrans = {
    createTransaction,
    getTransactionStatus,
    cancelTransaction,
    verifySignature,
    mapTransactionStatus,
}
