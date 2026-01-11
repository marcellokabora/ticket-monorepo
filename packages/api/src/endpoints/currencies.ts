/**
 * Currency API Endpoints (Mock Implementation)
 * Returns demo currency data for development and showcase purposes
 */

import type { Currency } from '../types';
import { MOCK_CURRENCIES, calculateMockFee } from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Response from the fee calculation endpoint
 */
export interface FeeResponse {
    currency_code: string;
    amount: number;
    fee: number;
    total_amount: number;
}

/**
 * Request payload for fee calculation
 */
export interface FeeRequest {
    currency_code: string;
    amount: number;
}

/**
 * Fetches all available currencies.
 */
export async function getCurrencies(): Promise<Currency[]> {
    await delay();
    return MOCK_CURRENCIES;
}

/**
 * Calculates the fee for a given amount in a specific currency.
 */
export async function getFeeForPrice(request: FeeRequest): Promise<FeeResponse> {
    await delay();
    return calculateMockFee(request.currency_code, request.amount);
}
