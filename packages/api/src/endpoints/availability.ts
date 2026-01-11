/**
 * Availability API Endpoints (Mock Implementation)
 * Returns demo pricing data for development and showcase purposes
 */

import type { AvailabilityResponse, AvailabilityQuery } from '../types';
import { getMockAvailability, getMockAvailabilityByAirline } from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches service availability and pricing for a specific airport.
 */
export async function getAvailability(
    airportCode: string,
    query?: AvailabilityQuery
): Promise<AvailabilityResponse> {
    await delay();
    return getMockAvailability(airportCode, query?.currency_code);
}

/**
 * Fetches service availability and pricing for a specific airport and airline.
 */
export async function getAvailabilityByAirline(
    airportCode: string,
    airlineCode: string,
    query?: AvailabilityQuery
): Promise<AvailabilityResponse> {
    await delay();
    return getMockAvailabilityByAirline(airportCode, airlineCode, query?.currency_code);
}
