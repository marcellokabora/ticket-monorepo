/**
 * URL Synchronization Utilities
 * 
 * Handles syncing booking state with URL parameters for shareable and bookmarkable booking links.
 */

import { goto } from '$app/navigation';
import type { BookingState } from './booking.svelte';

export interface BookingURLParams {
    departure?: string;
    return?: string;
    passengers?: string;
    promo?: string;
    addReturn?: string;
    departureAirline?: string;
    returnAirline?: string;
}

/**
 * Build URL search parameters from current booking state
 */
export function buildBookingURL(booking: BookingState): URLSearchParams {
    const params = new URLSearchParams();

    // Add departure airport
    if (booking.departureAirport) {
        params.set('departure', booking.departureAirport.iata);
    }

    // Add departure airline (if selected)
    if (booking.departureAirline) {
        params.set('departureAirline', booking.departureAirline.iata);
    }

    // Add return flight info
    if (booking.addReturnFlight) {
        params.set('addReturn', 'true');

        if (booking.returnAirport) {
            params.set('return', booking.returnAirport.iata);
        }

        // Add return airline (if selected)
        if (booking.returnAirline) {
            params.set('returnAirline', booking.returnAirline.iata);
        }
    }

    // Add passenger count (only if not default)
    if (booking.passengerCount !== 1) {
        params.set('passengers', booking.passengerCount.toString());
    }

    // Add promo code (if applied)
    if (booking.appliedPromoCode) {
        params.set('promo', booking.appliedPromoCode);
    }

    return params;
}

/**
 * Update browser URL without navigation
 * Uses replaceState to avoid creating history entries for every state change
 */
export function syncURLWithBooking(booking: BookingState, basePath = '/booking') {
    const params = buildBookingURL(booking);
    const url = params.toString() ? `${basePath}?${params.toString()}` : basePath;

    // Use replaceState to avoid polluting browser history
    if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', url);
    }
}

/**
 * Navigate to booking page with current state in URL
 * Use this for sharing links or bookmarking
 */
export function navigateWithBooking(booking: BookingState, basePath = '/booking') {
    const params = buildBookingURL(booking);
    const url = params.toString() ? `${basePath}?${params.toString()}` : basePath;
    goto(url);
}

/**
 * Parse URL parameters into a format suitable for loading airports
 */
export function parseBookingURL(searchParams: URLSearchParams): BookingURLParams {
    return {
        departure: searchParams.get('departure') || undefined,
        return: searchParams.get('return') || undefined,
        passengers: searchParams.get('passengers') || undefined,
        promo: searchParams.get('promo') || undefined,
        addReturn: searchParams.get('addReturn') || undefined,
        departureAirline: searchParams.get('departureAirline') || undefined,
        returnAirline: searchParams.get('returnAirline') || undefined,
    };
}
