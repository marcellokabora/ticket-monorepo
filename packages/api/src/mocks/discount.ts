/**
 * Mock Discount Data
 * Used for development and demo purposes without real API
 */

import type { ApplyDiscountResponse } from '../endpoints/discount';

/**
 * Valid discount codes for demo
 */
const VALID_CODES: Record<
    string,
    { percentage?: number; amount?: number; message: string }
> = {
    WELCOME10: { percentage: 10, message: '10% off your first booking!' },
    SUMMER20: { percentage: 20, message: '20% summer discount applied!' },
    SAVE5: { amount: 5, message: '€5 discount applied!' },
    FAMILY25: { percentage: 25, message: '25% family discount applied!' },
    EARLYBIRD: { percentage: 15, message: '15% early bird discount applied!' },
    VIP50: { percentage: 50, message: '50% VIP discount applied!' },
    DEMO: { percentage: 100, message: 'Free booking for demo!' },
};

/**
 * In-memory applied discounts
 */
const appliedDiscounts = new Map<string, string>();

/**
 * Apply a discount code (mock)
 */
export function applyMockDiscount(
    tripUuid: string,
    code: string
): ApplyDiscountResponse {
    const upperCode = code.toUpperCase().trim();
    const discount = VALID_CODES[upperCode];

    if (!discount) {
        return {
            code: code,
            discount_amount: 0,
            valid: false,
            message: 'Invalid promo code. Please try another code.',
        };
    }

    // Check if already applied
    if (appliedDiscounts.has(tripUuid)) {
        return {
            code: code,
            discount_amount: 0,
            valid: false,
            message: 'A discount code has already been applied to this booking.',
        };
    }

    // Store applied discount
    appliedDiscounts.set(tripUuid, upperCode);

    return {
        code: upperCode,
        discount_amount: discount.amount || 0,
        discount_percentage: discount.percentage,
        valid: true,
        message: discount.message,
    };
}

/**
 * Remove a discount (mock)
 */
export function removeMockDiscount(tripUuid: string): void {
    appliedDiscounts.delete(tripUuid);
}

/**
 * Get applied discount for a trip
 */
export function getAppliedDiscount(
    tripUuid: string
): { code: string; percentage?: number; amount?: number } | null {
    const code = appliedDiscounts.get(tripUuid);
    if (!code) return null;

    const discount = VALID_CODES[code];
    return discount
        ? { code, percentage: discount.percentage, amount: discount.amount }
        : null;
}
