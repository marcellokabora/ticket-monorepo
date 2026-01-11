/**
 * Country API Endpoints (Mock Implementation)
 * Returns demo country data for development and showcase purposes
 */

import { MOCK_COUNTRIES } from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Country data with normalized fields for client use
 */
export interface Country {
    code: string;
    prefix: string;
    name: string;
    continent?: string;
    nationality?: string;
}

/**
 * Fetches all available countries.
 */
export async function getCountries(): Promise<Country[]> {
    await delay();
    return MOCK_COUNTRIES;
}
