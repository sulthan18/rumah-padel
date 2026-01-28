/**
 * Formatting Utilities
 */

/**
 * Formats amount in Rupiah to display string
 * @param amount - Amount in Rupiah (integer)
 * @returns Formatted string (e.g., "Rp 150.000")
 */
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}
