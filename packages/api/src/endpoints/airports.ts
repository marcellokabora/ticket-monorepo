/**
 * Airport API Endpoints (Mock Implementation)
 * Returns demo data for development and showcase purposes
 */

import type { Airport } from '../types';
import {
    MOCK_POPULAR_AIRPORTS,
    searchMockAirports,
    getMockAirportByIata,
    getMockNearestAirports,
} from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches a single airport by its IATA code.
 *
 * @param iataCode - The 3-letter IATA code (e.g., 'BCN', 'MAD')
 * @returns Promise resolving to an Airport object or null if not found
 *
 * @example
 * ```typescript
 * import { getAirportByIata } from '@ticketapp/api';
 *
 * const airport = await getAirportByIata('BCN');
 * // { name: 'Barcelona-El Prat', iata: 'BCN', ... }
 * ```
 */
export async function getAirportByIata(iataCode: string): Promise<Airport | null> {
    await delay();
    return getMockAirportByIata(iataCode);
}

/**
 * Searches for airports matching the given query.
 *
 * @param query - The search query (airport name, city, IATA code, etc.)
 * @param length - Optional limit for number of results
 * @returns Promise resolving to an array of Airport objects
 *
 * @example
 * ```typescript
 * import { searchAirports } from '@ticketapp/api';
 *
 * const airports = await searchAirports('London', 10);
 * // [{ name: 'London Heathrow', iata: 'LHR', ... }, ...]
 * ```
 */
export async function searchAirports(query: string, length?: number): Promise<Airport[]> {
    await delay(200);
    return searchMockAirports(query, length);
}

/**
 * Fetches popular airports.
 *
 * @returns Promise resolving to an array of popular Airport objects
 *
 * @example
 * ```typescript
 * import { getPopularAirports } from '@ticketapp/api';
 *
 * const airports = await getPopularAirports();
 * // [{ name: 'Amsterdam Schiphol', iata: 'AMS', ... }, ...]
 * ```
 */
export async function getPopularAirports(): Promise<Airport[]> {
    await delay();
    return MOCK_POPULAR_AIRPORTS;
}

/**
 * Fetches the nearest airports based on geolocation coordinates.
 *
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param limit - Optional limit for number of results (default: 5)
 * @returns Promise resolving to an array of nearest Airport objects
 *
 * @example
 * ```typescript
 * import { getNearestAirports } from '@ticketapp/api';
 *
 * const airports = await getNearestAirports(51.5074, -0.1278, 5);
 * // [{ name: 'London Heathrow', iata: 'LHR', ... }, ...]
 * ```
 */
export async function getNearestAirports(
    latitude: number,
    longitude: number,
    limit?: number
): Promise<Airport[]> {
    await delay();
    return getMockNearestAirports(latitude, longitude, limit);
}
