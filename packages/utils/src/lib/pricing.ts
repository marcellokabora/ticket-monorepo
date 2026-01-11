/**
 * Pricing utilities for ticketapp services
 * Fetches real pricing from the ticketapp availability API
 * Shared across all apps that need pricing calculations
 */

import { getAvailability, getAvailabilityByAirline, type AvailabilityResponse, type RestrictedAirline } from '@ticketapp/api';

/**
 * Result from checking airport availability and pricing
 */
export interface AvailabilityResult {
    available: boolean;
    price: number;
    restrictedToAirlines: RestrictedAirline[];
    ticketappUuid: string | null;
}

/**
 * Fetch availability and pricing for an airport from the API
 * Returns availability status, price, and any airline restrictions
 * 
 * @param airportCode - The IATA airport code (e.g., 'BCN', 'LHR')
 * @param currencyCode - The currency code for pricing (e.g., 'EUR', 'USD')
 * @returns Promise resolving to AvailabilityResult with pricing and restrictions
 */
export async function fetchAirportAvailability(
    airportCode: string,
    currencyCode: string
): Promise<AvailabilityResult> {
    try {
        const response: AvailabilityResponse = await getAvailability(airportCode, {
            currency_code: currencyCode,
        });

        // Extract price from response - prefer local price, fallback to default
        const pricing = response.servicepass?.pricing;
        let price = 0;

        if (pricing) {
            price = pricing.local?.price ?? pricing.default?.price ?? 0;
        }

        return {
            available: response.available,
            price,
            restrictedToAirlines: response.restricted_to_airlines ?? [],
            ticketappUuid: response.servicepass?.uuid ?? null,
        };
    } catch (error) {
        console.error(`Failed to fetch availability for ${airportCode}:`, error);
        throw error;
    }
}

/**
 * Fetch availability and pricing for a specific airport + airline combination
 * Use this after user selects an airline from the restricted list
 * 
 * @param airportCode - The IATA airport code (e.g., 'BCN', 'LHR')
 * @param airlineCode - The IATA airline code (e.g., 'BA', 'KL')
 * @param currencyCode - The currency code for pricing (e.g., 'EUR', 'USD')
 * @returns Promise resolving to AvailabilityResult with airline-specific pricing
 */
export async function fetchAirportAirlineAvailability(
    airportCode: string,
    airlineCode: string,
    currencyCode: string
): Promise<AvailabilityResult> {
    try {
        const response: AvailabilityResponse = await getAvailabilityByAirline(
            airportCode,
            airlineCode,
            { currency_code: currencyCode }
        );

        // Extract price from response - prefer local price, fallback to default
        const pricing = response.servicepass?.pricing;
        let price = 0;

        if (pricing) {
            price = pricing.local?.price ?? pricing.default?.price ?? 0;
        }

        return {
            available: response.available,
            price,
            restrictedToAirlines: [], // No restrictions when querying specific airline
            ticketappUuid: response.servicepass?.uuid ?? null,
        };
    } catch (error) {
        console.error(`Failed to fetch availability for ${airportCode}/${airlineCode}:`, error);
        throw error;
    }
}

/**
 * Fetch just the pricing for an airport (backwards compatible)
 * This is a simplified version that only returns the price
 * 
 * @param airportCode - The IATA airport code
 * @param currencyCode - The currency code for pricing
 * @returns Promise resolving to the price as a number
 */
export async function fetchAirportPricing(
    airportCode: string,
    currencyCode: string
): Promise<number> {
    const result = await fetchAirportAvailability(airportCode, currencyCode);
    return result.price;
}

/**
 * Fetch pricing for a specific airport + airline combination
 * 
 * @param airportCode - The IATA airport code
 * @param airlineCode - The IATA airline code
 * @param currencyCode - The currency code for pricing
 * @returns Promise resolving to the price as a number
 */
export async function fetchAirportAirlinePricing(
    airportCode: string,
    airlineCode: string,
    currencyCode: string
): Promise<number> {
    const result = await fetchAirportAirlineAvailability(airportCode, airlineCode, currencyCode);
    return result.price;
}
