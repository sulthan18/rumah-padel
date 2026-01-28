import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

/**
 * Formats date to Indonesian locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
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
 * @param date - Date to extract time from
 * @returns Time string (e.g., "14:00")
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
 * @param startTime - Start time
 * @param endTime - End time
 * @returns Duration in hours
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
 * @param newStart - New booking start time
 * @param newEnd - New booking end time
 * @param existingStart - Existing booking start time
 * @param existingEnd - Existing booking end time
 * @returns True if slots overlap
 */
export function isTimeSlotOverlapping(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart
}
