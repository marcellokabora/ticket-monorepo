/**
 * Mock Airport Data
 * Used for development and demo purposes without real API
 */

import type { Airport } from '../types';

/**
 * Popular airports for demo
 */
export const MOCK_POPULAR_AIRPORTS: Airport[] = [
    {
        iata: 'AMS',
        name: 'Amsterdam Schiphol Airport',
        city: 'Amsterdam',
        country: 'Netherlands',
        country_code: 'NL',
        timezone: 'Europe/Amsterdam',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'BCN',
        name: 'Barcelona-El Prat Airport',
        city: 'Barcelona',
        country: 'Spain',
        country_code: 'ES',
        timezone: 'Europe/Madrid',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'LHR',
        name: 'London Heathrow Airport',
        city: 'London',
        country: 'United Kingdom',
        country_code: 'GB',
        timezone: 'Europe/London',
        terminals: [
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
            { name: 'Terminal 4', code: 'T4' },
            { name: 'Terminal 5', code: 'T5' },
        ],
    },
    {
        iata: 'CDG',
        name: 'Paris Charles de Gaulle Airport',
        city: 'Paris',
        country: 'France',
        country_code: 'FR',
        timezone: 'Europe/Paris',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2A', code: 'T2A' },
            { name: 'Terminal 2E', code: 'T2E' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'FRA',
        name: 'Frankfurt Airport',
        city: 'Frankfurt',
        country: 'Germany',
        country_code: 'DE',
        timezone: 'Europe/Berlin',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'MAD',
        name: 'Adolfo Suárez Madrid-Barajas Airport',
        city: 'Madrid',
        country: 'Spain',
        country_code: 'ES',
        timezone: 'Europe/Madrid',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 4', code: 'T4' },
            { name: 'Terminal 4S', code: 'T4S' },
        ],
    },
    {
        iata: 'JFK',
        name: 'John F. Kennedy International Airport',
        city: 'New York',
        country: 'United States',
        country_code: 'US',
        timezone: 'America/New_York',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 4', code: 'T4' },
            { name: 'Terminal 5', code: 'T5' },
            { name: 'Terminal 7', code: 'T7' },
            { name: 'Terminal 8', code: 'T8' },
        ],
    },
    {
        iata: 'DXB',
        name: 'Dubai International Airport',
        city: 'Dubai',
        country: 'United Arab Emirates',
        country_code: 'AE',
        timezone: 'Asia/Dubai',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
];

/**
 * Extended airport database for search
 */
export const MOCK_ALL_AIRPORTS: Airport[] = [
    ...MOCK_POPULAR_AIRPORTS,
    {
        iata: 'LAX',
        name: 'Los Angeles International Airport',
        city: 'Los Angeles',
        country: 'United States',
        country_code: 'US',
        timezone: 'America/Los_Angeles',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
            { name: 'Tom Bradley International', code: 'TBIT' },
        ],
    },
    {
        iata: 'ORD',
        name: "Chicago O'Hare International Airport",
        city: 'Chicago',
        country: 'United States',
        country_code: 'US',
        timezone: 'America/Chicago',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
            { name: 'Terminal 5', code: 'T5' },
        ],
    },
    {
        iata: 'SIN',
        name: 'Singapore Changi Airport',
        city: 'Singapore',
        country: 'Singapore',
        country_code: 'SG',
        timezone: 'Asia/Singapore',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
            { name: 'Terminal 4', code: 'T4' },
        ],
    },
    {
        iata: 'HKG',
        name: 'Hong Kong International Airport',
        city: 'Hong Kong',
        country: 'Hong Kong',
        country_code: 'HK',
        timezone: 'Asia/Hong_Kong',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'NRT',
        name: 'Narita International Airport',
        city: 'Tokyo',
        country: 'Japan',
        country_code: 'JP',
        timezone: 'Asia/Tokyo',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'SYD',
        name: 'Sydney Kingsford Smith Airport',
        city: 'Sydney',
        country: 'Australia',
        country_code: 'AU',
        timezone: 'Australia/Sydney',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'MUC',
        name: 'Munich Airport',
        city: 'Munich',
        country: 'Germany',
        country_code: 'DE',
        timezone: 'Europe/Berlin',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'ZRH',
        name: 'Zurich Airport',
        city: 'Zurich',
        country: 'Switzerland',
        country_code: 'CH',
        timezone: 'Europe/Zurich',
        terminals: [
            { name: 'Terminal A', code: 'A' },
            { name: 'Terminal B', code: 'B' },
            { name: 'Terminal E', code: 'E' },
        ],
    },
    {
        iata: 'VIE',
        name: 'Vienna International Airport',
        city: 'Vienna',
        country: 'Austria',
        country_code: 'AT',
        timezone: 'Europe/Vienna',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'LIS',
        name: 'Lisbon Humberto Delgado Airport',
        city: 'Lisbon',
        country: 'Portugal',
        country_code: 'PT',
        timezone: 'Europe/Lisbon',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'FCO',
        name: 'Leonardo da Vinci-Fiumicino Airport',
        city: 'Rome',
        country: 'Italy',
        country_code: 'IT',
        timezone: 'Europe/Rome',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'MXP',
        name: 'Milan Malpensa Airport',
        city: 'Milan',
        country: 'Italy',
        country_code: 'IT',
        timezone: 'Europe/Rome',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'BRU',
        name: 'Brussels Airport',
        city: 'Brussels',
        country: 'Belgium',
        country_code: 'BE',
        timezone: 'Europe/Brussels',
        terminals: [
            { name: 'Terminal A', code: 'A' },
            { name: 'Terminal B', code: 'B' },
        ],
    },
    {
        iata: 'CPH',
        name: 'Copenhagen Airport',
        city: 'Copenhagen',
        country: 'Denmark',
        country_code: 'DK',
        timezone: 'Europe/Copenhagen',
        terminals: [
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 3', code: 'T3' },
        ],
    },
    {
        iata: 'OSL',
        name: 'Oslo Gardermoen Airport',
        city: 'Oslo',
        country: 'Norway',
        country_code: 'NO',
        timezone: 'Europe/Oslo',
        terminals: [{ name: 'Main Terminal', code: 'T1' }],
    },
    {
        iata: 'ARN',
        name: 'Stockholm Arlanda Airport',
        city: 'Stockholm',
        country: 'Sweden',
        country_code: 'SE',
        timezone: 'Europe/Stockholm',
        terminals: [
            { name: 'Terminal 2', code: 'T2' },
            { name: 'Terminal 5', code: 'T5' },
        ],
    },
    {
        iata: 'HEL',
        name: 'Helsinki-Vantaa Airport',
        city: 'Helsinki',
        country: 'Finland',
        country_code: 'FI',
        timezone: 'Europe/Helsinki',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
    {
        iata: 'ATH',
        name: 'Athens International Airport',
        city: 'Athens',
        country: 'Greece',
        country_code: 'GR',
        timezone: 'Europe/Athens',
        terminals: [{ name: 'Main Terminal', code: 'MT' }],
    },
    {
        iata: 'IST',
        name: 'Istanbul Airport',
        city: 'Istanbul',
        country: 'Turkey',
        country_code: 'TR',
        timezone: 'Europe/Istanbul',
        terminals: [{ name: 'Main Terminal', code: 'T1' }],
    },
    {
        iata: 'DUB',
        name: 'Dublin Airport',
        city: 'Dublin',
        country: 'Ireland',
        country_code: 'IE',
        timezone: 'Europe/Dublin',
        terminals: [
            { name: 'Terminal 1', code: 'T1' },
            { name: 'Terminal 2', code: 'T2' },
        ],
    },
];

/**
 * Search airports by query (case-insensitive)
 */
export function searchMockAirports(query: string, limit?: number): Airport[] {
    const q = query.toLowerCase();
    const results = MOCK_ALL_AIRPORTS.filter(
        (airport) =>
            airport.iata.toLowerCase().includes(q) ||
            airport.name.toLowerCase().includes(q) ||
            airport.city.toLowerCase().includes(q) ||
            airport.country.toLowerCase().includes(q)
    );

    return limit ? results.slice(0, limit) : results;
}

/**
 * Get airport by IATA code
 */
export function getMockAirportByIata(iataCode: string): Airport | null {
    return (
        MOCK_ALL_AIRPORTS.find(
            (airport) => airport.iata.toUpperCase() === iataCode.toUpperCase()
        ) || null
    );
}

/**
 * Get nearest airports (mock - returns popular airports sorted randomly)
 */
export function getMockNearestAirports(
    _latitude: number,
    _longitude: number,
    limit: number = 5
): Airport[] {
    // In a real implementation, this would calculate distances
    // For mock, just return a shuffled subset of popular airports
    const shuffled = [...MOCK_POPULAR_AIRPORTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
}
