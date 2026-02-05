import { prisma } from "@/lib/prisma"
import { Booking, Court, User, MembershipTier } from "@prisma/client"

export class BookingEngine {

    // Config constants
    static readonly GUEST_BOOKING_WINDOW_DAYS = 3
    static readonly PRO_BOOKING_WINDOW_DAYS = 7
    static readonly PRO_DISCOUNT_PERCENTAGE = 10
    static readonly ADMIN_FEE = 5000

    /**
     * Validate if the user is allowed to book the selected slots based on their membership
     */
    static validateBookingRules(user: User | null, date: Date, slots: string[]) {
        const bookingDate = new Date(date)
        const today = new Date()
        const diffTime = Math.abs(bookingDate.getTime() - today.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // Rule 1: Booking Window
        if (!user || user.membershipTier === MembershipTier.GUEST) {
            if (diffDays > this.GUEST_BOOKING_WINDOW_DAYS) {
                throw new Error(`Guests can only book up to ${this.GUEST_BOOKING_WINDOW_DAYS} days in advance. Upgrade to Pro for ${this.PRO_BOOKING_WINDOW_DAYS} days access.`)
            }
        } else if (user.membershipTier === MembershipTier.PRO) {
            if (diffDays > this.PRO_BOOKING_WINDOW_DAYS) {
                throw new Error(`Booking is only open ${this.PRO_BOOKING_WINDOW_DAYS} days in advance.`)
            }
        }
    }

    /**
     * Calculate the final price including discounts, fees, and promo codes
     */
    static async calculatePrice(
        court: Court,
        slots: string[],
        user: User | null,
        promoCodeStr?: string
    ) {
        let basePrice = court.pricePerHour * slots.length
        let discount = 0
        let discountSource = null
        let promoCodeId = null

        // Membership Discount
        if (user?.membershipTier === MembershipTier.PRO) {
            const membershipDiscount = Math.round(basePrice * (this.PRO_DISCOUNT_PERCENTAGE / 100))
            discount += membershipDiscount
            discountSource = "Pro Membership"
        }

        // Promo Code Discount (Stackable? Let's say NO for now, take the higher one, or stack if distinct)
        // For simplicity: If promo code is applied, it applies ON TOP of membership for now, or we can restricting it.
        // Let's implement Promo Code check
        if (promoCodeStr) {
            const promo = await prisma.promoCode.findUnique({
                where: { code: promoCodeStr, isActive: true }
            })

            if (promo) {
                // Check expiry and usage limits
                if (promo.expiresAt && promo.expiresAt < new Date()) {
                    throw new Error("Promo code expired")
                }
                if (promo.maxUses && promo.usedCount >= promo.maxUses) {
                    throw new Error("Promo code usage limit reached")
                }

                let promoDiscount = 0
                if (promo.type === "PERCENTAGE") {
                    promoDiscount = Math.round(basePrice * (promo.value / 100))
                } else {
                    promoDiscount = promo.value
                }

                discount += promoDiscount
                promoCodeId = promo.id
                discountSource = discountSource ? `${discountSource} + Promo` : "Promo Code"
            } else {
                // Invalid promo code - silent fail or throw? usually throw
                throw new Error("Invalid promo code")
            }
        }

        const totalPrice = Math.max(0, basePrice - discount) + this.ADMIN_FEE

        return {
            basePrice,
            totalPrice,
            discount,
            discountSource,
            adminFee: this.ADMIN_FEE,
            promoCodeId,
            originalPrice: basePrice + this.ADMIN_FEE
        }
    }

    /**
     * Check for strict conflicting bookings
     */
    static async checkConflicts(courtId: string, startTime: Date, endTime: Date) {
        const conflict = await prisma.booking.findFirst({
            where: {
                courtId,
                status: { in: ["PENDING", "CONFIRMED"] },
                OR: [
                    {
                        AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
                    },
                    {
                        AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
                    },
                    {
                        AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
                    },
                ],
            },
        })
        return conflict
    }

    /**
     * Get live availability for a court on a specific date
     */
    static async getAvailability(courtId: string, date: Date) {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const bookings = await prisma.booking.findMany({
            where: {
                courtId,
                status: { in: ["PENDING", "CONFIRMED"] },
                startTime: { gte: startOfDay },
                endTime: { lte: endOfDay }
            },
            select: { startTime: true, endTime: true }
        })

        // Standard operating hours: 06:00 to 23:00
        const totalSlots = []
        for (let i = 6; i < 23; i++) {
            totalSlots.push(i)
        }

        const bookedHours = new Set<number>()
        bookings.forEach(b => {
            const start = b.startTime.getHours()
            const end = b.endTime.getHours()
            for (let h = start; h < end; h++) {
                bookedHours.add(h)
            }
        })

        const availability = totalSlots.map(hour => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            isAvailable: !bookedHours.has(hour)
        }))

        // Summary status
        const availableCount = availability.filter(a => a.isAvailable).length
        let status = "Available"
        if (availableCount === 0) status = "Fully Booked"
        else if (availableCount < 5) status = "Limited Slots"

        return {
            date: startOfDay,
            status,
            slots: availability
        }
    }
}
