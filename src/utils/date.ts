/**
 * Date & Time Utilities
 */

/**
 * Formats date to Indonesian locale
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('id-ID', options).format(dateObj)
}

/**
 * Formats time to HH:mm format
 */
export function formatTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

/**
 * Calculates duration in hours between two dates
 */
export function calculateDuration(
    startTime: Date | string,
    endTime: Date | string
): number {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime
    const diffMs = end.getTime() - start.getTime()
    return diffMs / (1000 * 60 * 60) // Convert to hours
}

/**
 * Validates if a time slot is available (no overlap)
 */
export function isTimeSlotOverlapping(
    newStart: Date,
    newEnd: Date,
    existingStart: Date,
    existingEnd: Date
): boolean {
    return newStart < existingEnd && newEnd > existingStart
}
