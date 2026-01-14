/**
 * Mock Availability Data
 * Used for development and demo purposes without real API
 */

import type { AvailabilityResponse } from '../types';
import { convertPrice } from './currencies';

/**
 * Base prices in EUR for different airports
 * Pricing varies by airport popularity/demand
 */
const AIRPORT_BASE_PRICES: Record<string, { adult: number; child: number }> = {
    // Premium airports (higher demand)
    AMS: { adult: 35.0, child: 17.5 },
    LHR: { adult: 45.0, child: 22.5 },
    CDG: { adult: 38.0, child: 19.0 },
    FRA: { adult: 32.0, child: 16.0 },
    JFK: { adult: 55.0, child: 27.5 },
    DXB: { adult: 42.0, child: 21.0 },
    SIN: { adult: 40.0, child: 20.0 },
    HKG: { adult: 38.0, child: 19.0 },

    // Standard airports
    BCN: { adult: 28.0, child: 14.0 },
    MAD: { adult: 30.0, child: 15.0 },
    MUC: { adult: 30.0, child: 15.0 },
    ZRH: { adult: 35.0, child: 17.5 },
    VIE: { adult: 28.0, child: 14.0 },
    FCO: { adult: 32.0, child: 16.0 },
    MXP: { adult: 30.0, child: 15.0 },
    BRU: { adult: 28.0, child: 14.0 },
    CPH: { adult: 32.0, child: 16.0 },
    OSL: { adult: 35.0, child: 17.5 },
    ARN: { adult: 32.0, child: 16.0 },
    HEL: { adult: 30.0, child: 15.0 },
    ATH: { adult: 25.0, child: 12.5 },
    IST: { adult: 28.0, child: 14.0 },
    DUB: { adult: 30.0, child: 15.0 },
    LIS: { adult: 26.0, child: 13.0 },
    LAX: { adult: 48.0, child: 24.0 },
    ORD: { adult: 42.0, child: 21.0 },
    SYD: { adult: 45.0, child: 22.5 },
    NRT: { adult: 38.0, child: 19.0 },
};

/**
 * Default pricing for airports not in the list
 */
const DEFAULT_PRICING = { adult: 29.0, child: 14.5 };

/**
 * Common airlines available at most airports
 */
const COMMON_AIRLINES = [
    { iata: 'AA', name: 'American Airlines' },
    { iata: 'BA', name: 'British Airways' },
    { iata: 'DL', name: 'Delta Air Lines' },
    { iata: 'UA', name: 'United Airlines' },
    { iata: 'LH', name: 'Lufthansa' },
    { iata: 'AF', name: 'Air France' },
    { iata: 'KL', name: 'KLM Royal Dutch Airlines' },
    { iata: 'IB', name: 'Iberia' },
    { iata: 'VY', name: 'Vueling' },
    { iata: 'FR', name: 'Ryanair' },
    { iata: 'U2', name: 'easyJet' },
    { iata: 'EK', name: 'Emirates' },
    { iata: 'QR', name: 'Qatar Airways' },
    { iata: 'TK', name: 'Turkish Airlines' },
];

/**
 * Some airports have airline restrictions (require specific airlines)
 */
const AIRLINE_RESTRICTED_AIRPORTS: Record<
    string,
    { iata: string; name: string }[]
> = {
    LHR: [
        { iata: 'BA', name: 'British Airways' },
        { iata: 'VS', name: 'Virgin Atlantic' },
        { iata: 'AA', name: 'American Airlines' },
    ],
    JFK: [
        { iata: 'DL', name: 'Delta Air Lines' },
        { iata: 'AA', name: 'American Airlines' },
        { iata: 'UA', name: 'United Airlines' },
        { iata: 'B6', name: 'JetBlue Airways' },
    ],
};

/**
 * Airports where service is not available
 */
const UNAVAILABLE_AIRPORTS = ['XXX', 'TST', 'NA1'];

/**
 * Generate a consistent UUID for an airport (for demo purposes)
 */
function generateServiceUuid(airportCode: string): string {
    // Create a deterministic UUID based on airport code
    const hash = airportCode
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `svc-${airportCode.toLowerCase()}-${hash.toString(16).padStart(8, '0')}-demo`;
}

/**
 * Get mock availability for an airport
 */
export function getMockAvailability(
    airportCode: string,
    currencyCode: string = 'EUR'
): AvailabilityResponse {
    const code = airportCode.toUpperCase();

    // Check if service unavailable at this airport
    if (UNAVAILABLE_AIRPORTS.includes(code)) {
        return {
            available: false,
            servicepass: null,
        };
    }

    // Get base pricing
    const basePricing = AIRPORT_BASE_PRICES[code] || DEFAULT_PRICING;

    // Convert to requested currency
    const localAdultPrice = convertPrice(basePricing.adult, currencyCode);
    const localChildPrice = convertPrice(basePricing.child, currencyCode);

    // Check for airline restrictions - if restricted, use only those airlines
    // Otherwise, return all common airlines (always require airline selection)
    const restrictedAirlines = AIRLINE_RESTRICTED_AIRPORTS[code];
    const availableAirlines = restrictedAirlines || COMMON_AIRLINES;

    return {
        available: true,
        servicepass: {
            uuid: generateServiceUuid(code),
            pricing: {
                children_age_limit: 12,
                infant_age_limit: 2,
                default: {
                    price: basePricing.adult,
                    children_price: basePricing.child,
                    currency: { code: 'EUR', symbol: '€' },
                },
                local:
                    currencyCode === 'EUR'
                        ? {
                            price: null,
                            children_price: null,
                            currency: { code: null, symbol: null },
                        }
                        : {
                            price: localAdultPrice,
                            children_price: localChildPrice,
                            currency: {
                                code: currencyCode,
                                symbol: getCurrencySymbol(currencyCode),
                            },
                        },
                vat_number: 'EU123456789',
            },
        },
        // Always indicate airlines are required (user must select one)
        available_only_via_airlines: true,
        restricted_to_airlines: availableAirlines.map((a) => ({
            iata: a.iata,
            name: a.name,
        })),
    };
}

/**
 * Get mock availability for a specific airline at an airport
 */
export function getMockAvailabilityByAirline(
    airportCode: string,
    _airlineCode: string,
    currencyCode: string = 'EUR'
): AvailabilityResponse {
    // For demo, airline-specific availability is the same as general
    // but we remove the airline restrictions since one was selected
    const availability = getMockAvailability(airportCode, currencyCode);

    if (availability.available) {
        delete availability.available_only_via_airlines;
        delete availability.restricted_to_airlines;
    }

    return availability;
}

/**
 * Get currency symbol
 */
function getCurrencySymbol(code: string): string {
    const symbols: Record<string, string> = {
        EUR: '€',
        USD: '$',
        GBP: '£',
        CHF: 'CHF',
        JPY: '¥',
        CNY: '¥',
        INR: '₹',
        AED: 'د.إ',
        CAD: 'C$',
        AUD: 'A$',
        SGD: 'S$',
        HKD: 'HK$',
        NZD: 'NZ$',
        SEK: 'kr',
        NOK: 'kr',
        DKK: 'kr',
        PLN: 'zł',
        CZK: 'Kč',
        HUF: 'Ft',
        TRY: '₺',
    };
    return symbols[code] || code;
}
