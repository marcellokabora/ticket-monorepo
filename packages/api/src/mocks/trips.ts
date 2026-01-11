/**
 * Mock Trip Data
 * Used for development and demo purposes without real API
 */

import type { Trip, ServiceRequest, BookingStatusItem, TripServiceInfo } from '../types/trip';

/**
 * In-memory trip storage for demo
 */
const mockTrips = new Map<string, Trip>();

/**
 * Generate a mock UUID
 */
function generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Create a mock trip
 */
export function createMockTrip(requests: any[]): Trip {
    const tripUuid = generateUuid();

    const mockRequests: ServiceRequest[] = requests.map((req) => ({
        uuid: generateUuid(),
        itinerary: req.itinerary,
        booking: {
            uuid: generateUuid(),
            number_of_passengers: req.booking?.pax_adults || 1,
            currency: { code: req.booking?.currency_code || 'EUR' },
            local_price: req.booking?.price || 29.0,
            status: 'pending',
        },
        servicepass: {
            uuid: req.servicepass?.uuid || generateUuid(),
            provider: { uuid: req.servicepass?.provider?.uuid || generateUuid() },
        },
        departure_date: req.departure_date || new Date().toISOString(),
        flight_number: req.flight_number,
        airline: req.airline,
        source: req.source || 'ticketapp-application-web',
    }));

    const trip: Trip = {
        uuid: tripUuid,
        requests: mockRequests,
        completed: false,
        member: undefined,
    };

    // Store in memory
    mockTrips.set(tripUuid, trip);

    return trip;
}

/**
 * Add requests to existing trip
 */
export function addMockRequestsToTrip(tripUuid: string, requests: any[]): Trip {
    const trip = mockTrips.get(tripUuid);

    if (!trip) {
        // Create a new trip if not found
        return createMockTrip(requests);
    }

    const newRequests: ServiceRequest[] = requests.map((req) => ({
        uuid: generateUuid(),
        itinerary: req.itinerary,
        booking: {
            uuid: generateUuid(),
            number_of_passengers: req.booking?.pax_adults || 1,
            currency: { code: req.booking?.currency_code || 'EUR' },
            local_price: req.booking?.price || 29.0,
            status: 'pending',
        },
        servicepass: {
            uuid: req.servicepass?.uuid || generateUuid(),
            provider: { uuid: req.servicepass?.provider?.uuid || generateUuid() },
        },
        departure_date: req.departure_date || new Date().toISOString(),
        flight_number: req.flight_number,
        airline: req.airline,
        source: req.source || 'ticketapp-application-web',
    }));

    trip.requests.push(...newRequests);
    mockTrips.set(tripUuid, trip);

    return trip;
}

/**
 * Get a mock trip
 */
export function getMockTrip(tripUuid: string): Trip | null {
    return mockTrips.get(tripUuid) || null;
}

/**
 * Get mock booking status
 */
export function getMockTripBookingStatus(tripUuid: string): BookingStatusItem[] {
    const trip = mockTrips.get(tripUuid);

    if (!trip) {
        return [];
    }

    return trip.requests.map((request) => ({
        request,
        booking: {
            uuid: request.booking.uuid,
            status: 'confirmed',
            total_amount: request.booking.local_price,
            currency: request.booking.currency,
        },
        transactions: [
            {
                uuid: generateUuid(),
                amount: request.booking.local_price,
                currency: request.booking.currency,
                status: 'completed',
                payment_method: 'card',
                created_at: new Date().toISOString(),
            },
        ],
        disclaimer:
            'This is a demo booking. In production, real bookings would be processed through the payment system.',
    }));
}
