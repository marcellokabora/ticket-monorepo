/**
 * Trip API Endpoints (Mock Implementation)
 * Returns demo trip data for development and showcase purposes
 */

import type {
    CreateTripRequest,
    AddRequestsToTripRequest,
    Trip,
    BookingStatusResponse,
} from '../types/trip';
import {
    createMockTrip,
    addMockRequestsToTrip,
    getMockTrip,
    getMockTripBookingStatus,
} from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a new trip with departure and/or return flight requests.
 */
export async function createTrip(request: CreateTripRequest): Promise<Trip> {
    await delay();
    return createMockTrip(request.requests);
}

/**
 * Adds additional requests (typically return flight) to an existing trip.
 */
export async function addRequestsToTrip(
    tripUuid: string,
    request: AddRequestsToTripRequest
): Promise<Trip> {
    await delay();
    return addMockRequestsToTrip(tripUuid, request.requests);
}

/**
 * Retrieves complete trip information including all requests, booking status, and transactions.
 */
export async function getTrip(tripUuid: string): Promise<Trip> {
    await delay();
    const trip = getMockTrip(tripUuid);

    if (!trip) {
        return {
            uuid: tripUuid,
            requests: [],
            completed: false,
        };
    }

    return trip;
}

/**
 * Retrieves booking status, transactions, and disclaimer for a trip.
 */
export async function getTripBookingStatus(
    tripUuid: string
): Promise<BookingStatusResponse['data']> {
    await delay();
    return getMockTripBookingStatus(tripUuid);
}
