
import { BookingEngine } from "../src/lib/booking-engine"
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("Starting Booking Engine Tests...")

    // 1. Setup Data
    const court = await prisma.court.findFirst()
    if (!court) throw new Error("No courts found")

    // Mock User (Guest)
    const guestUser: any = { id: "guest", membershipTier: "GUEST" }
    // Mock User (Pro)
    const proUser: any = { id: "pro", membershipTier: "PRO" }

    // 2. Test Pricing (Guest)
    console.log("\nTest 1: Guest Pricing")
    const slots = ["10:00", "11:00"]
    const guestPrice = await BookingEngine.calculatePrice(court, slots, guestUser)
    console.log("Guest Price:", guestPrice.totalPrice, "(Expected Base + Admin)")

    // 3. Test Pricing (Pro)
    console.log("\nTest 2: Pro Pricing (-10%)")
    const proPrice = await BookingEngine.calculatePrice(court, slots, proUser)
    console.log("Pro Price:", proPrice.totalPrice, `(Expected < ${guestPrice.totalPrice})`)
    if (proPrice.totalPrice >= guestPrice.totalPrice) console.error("FAILED: Pro price not lower")
    else console.log("PASSED: Pro discount applied")

    // 4. Test Booking Window
    console.log("\nTest 3: Booking Window")
    const farDate = new Date()
    farDate.setDate(farDate.getDate() + 5) // +5 days

    try {
        BookingEngine.validateBookingRules(guestUser, farDate, slots)
        console.error("FAILED: Guest should not book >3 days ahead")
    } catch (e) {
        console.log("PASSED: Guest blocked from booking 5 days ahead")
    }

    try {
        BookingEngine.validateBookingRules(proUser, farDate, slots)
        console.log("PASSED: Pro allowed to book 5 days ahead")
    } catch (e) {
        console.error("FAILED: Pro should be allowed")
    }

    // 5. Test Live Availability
    console.log("\nTest 4: Live Availability")
    const availability = await BookingEngine.getAvailability(court.id, new Date())
    console.log(`Status: ${availability.status}`)
    console.log(`Slots: ${availability.slots.length} total, ${availability.slots.filter(s => s.isAvailable).length} available`)

    if (availability.slots.length > 0) console.log("PASSED: Availability fetched")
    else console.error("FAILED: No slots returned")

    console.log("\nTests Completed.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
