/**
 * Booking Store - Re-exports from @ticketapp/utils
 * 
 * This file re-exports the shared booking utilities for trip management.
 * Booking state is persisted via URL query parameters (not localStorage).
 * 
 * Flow:
 * 1. User selects airport/airline → Stored in URL params
 * 2. User verifies contact (SMS/Email) → Trip created, UUID added to URL
 * 3. User pays via Stripe → Payment processed with trip UUID
 * 4. Payment success → Navigate to ticket with trip UUID
 */

// Re-export Trip API utilities for use during payment
export {
    createTripFromBooking,
    addReturnFlightToTrip,
    saveBookingToTrip,
    loadTripByUuid,
    type CreateTripParams,
    type AddReturnFlightParams,
    type SaveTripParams,
    type SaveTripResult,
} from '@ticketapp/utils';

// Re-export Trip API types for booking status
export { getTrip, getTripBookingStatus, type Trip, type BookingStatusItem } from '@ticketapp/api';
