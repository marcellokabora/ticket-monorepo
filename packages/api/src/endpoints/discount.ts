/**
 * Discount API Endpoints (Mock Implementation)
 * Returns demo discount data for development and showcase purposes
 * 
 * Valid demo codes: WELCOME10, SUMMER20, SAVE5, FAMILY25, EARLYBIRD, VIP50, DEMO
 */

import { applyMockDiscount, removeMockDiscount } from '../mocks';

/**
 * Request payload for applying a discount/promo code
 */
export interface ApplyDiscountRequest {
    code: string;
}

/**
 * Response from applying a discount/promo code
 */
export interface ApplyDiscountResponse {
    code: string;
    discount_amount: number;
    discount_percentage?: number;
    valid: boolean;
    message?: string;
}

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Applies a promo code/discount to a trip.
 * Valid demo codes: WELCOME10, SUMMER20, SAVE5, FAMILY25, EARLYBIRD, VIP50, DEMO
 */
export async function applyDiscount(
    tripUuid: string,
    request: ApplyDiscountRequest
): Promise<ApplyDiscountResponse> {
    await delay();
    return applyMockDiscount(tripUuid, request.code);
}

/**
 * Removes a discount/promo code from a trip.
 */
export async function removeDiscount(tripUuid: string): Promise<void> {
    await delay();
    removeMockDiscount(tripUuid);
}
