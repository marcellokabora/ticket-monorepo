/**
 * Trip management utilities for creating and updating trips
 * Provides reusable trip operations across all apps
 */

import type {
    Airport,
    Currency,
    Trip,
    CreateTripRequest,
    TripRequestItem,
} from '@ticketapp/api';
import {
    createTrip,
    addRequestsToTrip,
    getTrip,
    getAvailability,
} from '@ticketapp/api';

/**
 * Fetch ticketapp availability for an airport
 * Note: The API response structure may not include all UUIDs, we need to construct them
 */
async function fetchTicketappInfo(airportCode: string, currencyCode: string): Promise<{ uuid: string; providerUuid: string; pricing: any } | null> {
    try {
        const availability = await getAvailability(airportCode, { currency_code: currencyCode });

        if (!availability.servicepass) {
            return null;
        }

        // Extract pricing
        const pricing = availability.servicepass.pricing;

        // The API doesn't return UUIDs in the availability endpoint
        // We need to use the airport IATA code as both the ticketapp and provider UUID
        // This matches the fulfillment_via_airport processing method
        return {
            uuid: airportCode,
            providerUuid: airportCode,
            pricing,
        };
    } catch (error) {
        console.warn(`Failed to fetch ticketapp info for ${airportCode}:`, error);
        return null;
    }
}

/**
 * Build a trip request item from booking parameters
 * Note: API v1.2 requires: itinerary, customer (with brand), booking, source
 */
function buildTripRequestItem(
    departureAirport: Airport,
    arrivalAirport: Airport | null,
    passengerCount: number,
    currency: Currency,
    price: number,
    _departureDate: string, // Not sent in trip request
    _ticketappUuid: string, // Not sent in trip request
    _providerUuid: string, // Not sent in trip request
    flightNumber?: string,
    airlineIata?: string,
    customerEmail?: string,
    customerPhone?: { prefix: string; number: string },
    brand: string = 'ticketapp'
): TripRequestItem {
    // API v1.2 requires: itinerary, customer (with brand), booking, source
    const item: TripRequestItem = {
        itinerary: {
            departure_airport: { iata: departureAirport.iata },
            arrival_airport: arrivalAirport ? { iata: arrivalAirport.iata } : undefined,
        },
        customer: {
            brand,
            email: customerEmail,
            phone: customerPhone,
        },
        booking: {
            // API v1.2 requires booking to be present but empty
        },
        source: 'ticketapp-application-web',
    };

    if (flightNumber) {
        (item.itinerary as any).flight_number = flightNumber;
    }

    if (airlineIata) {
        (item.itinerary as any).airline = { iata: airlineIata };
    }

    return item;
}

export interface CreateTripParams {
    departureAirport: Airport;
    arrivalAirport: Airport | null; // Optional for one-way bookings
    passengerCount: number;
    currency: Currency;
    price: number;
    departureDate: string;
    flightNumber?: string;
    airlineIata?: string;
    memberUuid?: string;
    customerEmail?: string;
    customerPhone?: { prefix: string; number: string };
    brand?: string; // Brand identifier, defaults to 'ticketapp'
}

/**
 * Create a new trip via API
 * Fetches ticketapp availability first to get required UUIDs
 * 
 * @param params - Trip creation parameters
 * @returns The created trip with UUID and request IDs
 * 
 * @example
 * ```typescript
 * const trip = await createTripFromBooking({
 *   departureAirport: myAirport,
 *   arrivalAirport: myAirport,
 *   passengerCount: 2,
 *   currency: { code: 'EUR', symbol: '€' },
 *   price: 29.99,
 *   departureDate: new Date().toISOString(),
 * });
 * console.log('Trip UUID:', trip.uuid);
 * ```
 */
export async function createTripFromBooking(params: CreateTripParams): Promise<Trip> {
    const ticketappInfo = await fetchTicketappInfo(params.departureAirport.iata, params.currency.code);

    if (!ticketappInfo) {
        throw new Error(`ticketapp not available for ${params.departureAirport.iata}`);
    }

    if (!ticketappInfo.uuid || !ticketappInfo.providerUuid) {
        console.error('❌ ticketapp info missing UUIDs:', ticketappInfo);
        throw new Error(`ticketapp UUIDs missing for ${params.departureAirport.iata}`);
    }

    const request: CreateTripRequest = {
        requests: [
            buildTripRequestItem(
                params.departureAirport,
                params.arrivalAirport,
                params.passengerCount,
                params.currency,
                params.price,
                params.departureDate,
                ticketappInfo.uuid,
                ticketappInfo.providerUuid,
                params.flightNumber,
                params.airlineIata,
                params.customerEmail,
                params.customerPhone,
                params.brand
            ),
        ],
        member: params.memberUuid ? { uuid: params.memberUuid } : undefined,
    };

    try {
        return await createTrip(request);
    } catch (error: any) {
        const errorBody = typeof error.body === 'string' ? JSON.parse(error.body) : error.body;
        console.error('❌ Trip creation failed:', error.message);
        console.error('Status Code:', error.statusCode);
        console.error('Error Details:', JSON.stringify(errorBody, null, 2));
        throw error;
    }
}

export interface AddReturnFlightParams {
    tripUuid: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    passengerCount: number;
    currency: Currency;
    price: number;
    departureDate: string;
    flightNumber?: string;
    airlineIata?: string;
    customerEmail?: string;
    customerPhone?: { prefix: string; number: string };
    brand?: string;
}

/**
 * Add a return flight to an existing trip
 * Fetches ticketapp availability first to get required UUIDs
 * 
 * @param params - Return flight parameters
 * @returns Updated trip with both departure and return flights
 * 
 * @example
 * ```typescript
 * const updatedTrip = await addReturnFlightToTrip({
 *   tripUuid: existingTripUuid,
 *   departureAirport: returnAirport,
 *   arrivalAirport: originalDepartureAirport,
 *   passengerCount: 2,
 *   currency: { code: 'EUR', symbol: '€' },
 *   price: 29.99,
 *   departureDate: new Date().toISOString(),
 * });
 * ```
 */
export async function addReturnFlightToTrip(params: AddReturnFlightParams): Promise<Trip> {
    const ticketappInfo = await fetchTicketappInfo(params.departureAirport.iata, params.currency.code);

    if (!ticketappInfo) {
        throw new Error(`ticketapp not available for ${params.departureAirport.iata}`);
    }

    const request = {
        requests: [
            buildTripRequestItem(
                params.departureAirport,
                params.arrivalAirport,
                params.passengerCount,
                params.currency,
                params.price,
                params.departureDate,
                ticketappInfo.uuid,
                ticketappInfo.providerUuid,
                params.flightNumber,
                params.airlineIata,
                params.customerEmail,
                params.customerPhone,
                params.brand
            ),
        ],
    };

    return addRequestsToTrip(params.tripUuid, request);
}

export interface SaveTripParams {
    departureAirport: Airport;
    returnAirport: Airport | null;
    addReturnFlight: boolean;
    passengerCount: number;
    currency: Currency;
    departurePrice: number;
    returnPrice: number;
    departureDate?: string;
    flightNumber?: string;
    airlineIata?: string;
    existingTripUuid?: string;
    customerEmail?: string;
    customerPhone?: { prefix: string; number: string };
}

export interface SaveTripResult {
    tripUuid: string;
    departureRequestId: string;
    returnRequestId: string | null;
}

/**
 * Save booking data to Trip API
 * Creates a new trip or updates an existing one with return flight
 * 
 * @param params - Booking parameters to save
 * @returns Trip UUID and request IDs for URL persistence
 * 
 * @example
 * ```typescript
 * const result = await saveBookingToTrip({
 *   departureAirport: myAirport,
 *   returnAirport: null,
 *   addReturnFlight: false,
 *   passengerCount: 1,
 *   currency: { code: 'USD', symbol: '$' },
 *   departurePrice: 24.99,
 *   returnPrice: 0,
 * });
 * console.log('Trip ID:', result.tripUuid);
 * ```
 */
export async function saveBookingToTrip(params: SaveTripParams): Promise<SaveTripResult> {
    const departureDate = params.departureDate || new Date().toISOString();

    // If we already have a trip, add return flight to it
    if (params.existingTripUuid && params.addReturnFlight && params.returnAirport) {
        const updatedTrip = await addReturnFlightToTrip({
            tripUuid: params.existingTripUuid,
            departureAirport: params.returnAirport,
            arrivalAirport: params.departureAirport,
            passengerCount: params.passengerCount,
            currency: params.currency,
            price: params.returnPrice,
            departureDate,
            flightNumber: params.flightNumber,
            airlineIata: params.airlineIata,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone,
        });

        return {
            tripUuid: updatedTrip.uuid,
            departureRequestId: updatedTrip.requests[0]?.uuid || '',
            returnRequestId: updatedTrip.requests[1]?.uuid || null,
        };
    }

    // Create new trip with departure only or with return
    // For one-way bookings (no return airport), arrival_airport is omitted
    const trip = await createTripFromBooking({
        departureAirport: params.departureAirport,
        arrivalAirport: params.returnAirport,
        passengerCount: params.passengerCount,
        currency: params.currency,
        price: params.departurePrice,
        departureDate,
        flightNumber: params.flightNumber,
        airlineIata: params.airlineIata,
        customerEmail: params.customerEmail,
        customerPhone: params.customerPhone,
    });

    let returnRequestId: string | null = null;

    // If we have a return flight, add it to the trip
    if (params.addReturnFlight && params.returnAirport) {
        const updatedTrip = await addReturnFlightToTrip({
            tripUuid: trip.uuid,
            departureAirport: params.returnAirport,
            arrivalAirport: params.departureAirport,
            passengerCount: params.passengerCount,
            currency: params.currency,
            price: params.returnPrice,
            departureDate,
            flightNumber: params.flightNumber,
            airlineIata: params.airlineIata,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone,
        });
        returnRequestId = updatedTrip.requests[1]?.uuid || null;
    }

    return {
        tripUuid: trip.uuid,
        departureRequestId: trip.requests[0]?.uuid || '',
        returnRequestId,
    };
}

/**
 * Load trip data from API by UUID
 * 
 * @param tripUuid - The trip UUID from URL parameter
 * @returns Trip data or null if not found
 * 
 * @example
 * ```typescript
 * const trip = await loadTripByUuid('abc-123-def');
 * if (trip) {
 *   console.log('Trip loaded:', trip.uuid);
 * }
 * ```
 */
export async function loadTripByUuid(tripUuid: string): Promise<Trip | null> {
    try {
        return await getTrip(tripUuid);
    } catch (error) {
        console.error('Failed to load trip from API:', error);
        return null;
    }
}
