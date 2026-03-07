import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateBookingInput } from '../booking.service';
import { PRICING, BUSINESS_HOURS } from '../../lib/constants';

describe('validateBookingInput', () => {
    test('returns false if start time is in the past', () => {
        const start = new Date(Date.now() - 3600000); // 1 hour ago
        const end = new Date(Date.now() + 3600000); // 1 hour from now

        // Ensure start time is within business hours to avoid business hour error if it happens to be triggered
        // But since "past" check is first, it should return "Cannot book in the past"
        const result = validateBookingInput(start, end);
        assert.strictEqual(result.valid, false);
        assert.strictEqual(result.error, 'Cannot book in the past');
    });

    test('returns false if end time is before or equal to start time', () => {
        // Use a future date to bypass the "past" check
        const start = new Date(Date.now() + 86400000); // tomorrow
        start.setHours(10, 0, 0, 0);

        const endBefore = new Date(start.getTime() - 3600000); // 1 hour before start
        const resultBefore = validateBookingInput(start, endBefore);
        assert.strictEqual(resultBefore.valid, false);
        assert.strictEqual(resultBefore.error, 'End time must be after start time');

        const endEqual = new Date(start.getTime()); // same as start
        const resultEqual = validateBookingInput(start, endEqual);
        assert.strictEqual(resultEqual.valid, false);
        assert.strictEqual(resultEqual.error, 'End time must be after start time');
    });

    test('returns false if booking duration is less than minimum', () => {
        const start = new Date(Date.now() + 86400000); // tomorrow
        start.setHours(10, 0, 0, 0);

        // Minimum is usually 1 hour, so let's test with 30 minutes
        const end = new Date(start.getTime() + 30 * 60000); // 30 minutes later

        const result = validateBookingInput(start, end);
        assert.strictEqual(result.valid, false);
        assert.strictEqual(result.error, `Minimum booking duration is ${PRICING.minimumBooking} hour(s)`);
    });

    test('returns false if booking duration is more than maximum', () => {
        const start = new Date(Date.now() + 86400000); // tomorrow
        start.setHours(10, 0, 0, 0);

        // Maximum is usually 3 hours, so let's test with 4 hours
        const end = new Date(start.getTime() + (PRICING.maximumBooking + 1) * 3600000);

        const result = validateBookingInput(start, end);
        assert.strictEqual(result.valid, false);
        assert.strictEqual(result.error, `Maximum booking duration is ${PRICING.maximumBooking} hour(s)`);
    });

    test('returns false if booking is outside business hours', () => {
        const start = new Date(Date.now() + 86400000); // tomorrow

        // Test before opening time
        start.setHours(BUSINESS_HOURS.openTime - 2, 0, 0, 0);
        const end = new Date(start.getTime() + 3600000); // 1 hour duration

        const resultEarly = validateBookingInput(start, end);
        assert.strictEqual(resultEarly.valid, false);
        assert.strictEqual(resultEarly.error, `Booking must be within business hours (${BUSINESS_HOURS.openTime}:00 - ${BUSINESS_HOURS.closeTime}:00)`);

        // Test after closing time
        const startLate = new Date(Date.now() + 86400000); // tomorrow
        startLate.setHours(BUSINESS_HOURS.closeTime, 0, 0, 0); // start at close time
        const endLate = new Date(startLate.getTime() + 3600000); // 1 hour duration (ends after close time)

        const resultLate = validateBookingInput(startLate, endLate);
        assert.strictEqual(resultLate.valid, false);
        assert.strictEqual(resultLate.error, `Booking must be within business hours (${BUSINESS_HOURS.openTime}:00 - ${BUSINESS_HOURS.closeTime}:00)`);
    });

    test('returns true for valid booking inputs', () => {
        const start = new Date(Date.now() + 86400000); // tomorrow

        // Set to a valid business hour (e.g., 10 AM)
        let validHour = 10;
        if (validHour < BUSINESS_HOURS.openTime || validHour >= BUSINESS_HOURS.closeTime) {
            validHour = BUSINESS_HOURS.openTime + 1; // Fallback to 1 hour after opening
        }

        start.setHours(validHour, 0, 0, 0);

        // Duration within limits (e.g., 2 hours)
        const durationHours = Math.min(2, PRICING.maximumBooking);
        const end = new Date(start.getTime() + durationHours * 3600000);

        const result = validateBookingInput(start, end);
        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.error, undefined);
    });
});
