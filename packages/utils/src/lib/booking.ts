/**
 * Booking Store - localStorage Persistence
 * 
 * Stores booking data locally until the user commits to payment.
 * Trip is only created via API when payment is processed.
 * 
 * Flow:
 * 1. User selects airport/airline → Stored in localStorage
 * 2. User verifies contact (SMS/Email) → Stored in localStorage  
 * 3. User pays via Stripe → Trip created via API, then payment processed
 * 4. Payment success → Navigate to ticket with trip UUID
 */

import type { Airport, ContactInfo, Currency, PaymentMethod, RestrictedAirline } from '@ticketapp/api';
import { PersistentStore } from './store';

const BOOKING_STORAGE_KEY = 'ticketapp_booking';

/**
 * Booking state stored in localStorage
 */
export interface BookingStateData {
    // Selection data
    selectedCurrency: Currency;
    departureAirport: Airport | null;
    departureAirline: RestrictedAirline | null;
    returnAirport: Airport | null;
    returnAirline: RestrictedAirline | null;
    addReturnFlight: boolean;
    passengerCount: number;

    // Pricing data (from availability API)
    departurePrice: number;
    returnPrice: number;
    departureTicketappUuid: string | null;
    returnTicketappUuid: string | null;

    // Discount data
    appliedPromoCode: string | null;
    discountAmount: number;
    discountPercentage: number | null;

    // Verification data
    verifiedContact: ContactInfo | null;
    verificationSessionId: string | null;

    // Payment data (set after successful payment)
    transactionId: string | null;
    paymentMethod: PaymentMethod | null;
    pendingPaymentMethod: string | null;
    bookedAt: string | null; // ISO date string for serialization

    // Trip data (only set after trip is created during payment)
    tripUuid: string | null;
    departureRequestId: string | null;
    returnRequestId: string | null;
}

/**
 * Default booking state
 */
export const defaultBookingState: BookingStateData = {
    selectedCurrency: { code: 'EUR', symbol: '€' },
    departureAirport: null,
    departureAirline: null,
    returnAirport: null,
    returnAirline: null,
    addReturnFlight: false,
    passengerCount: 1,
    departurePrice: 0,
    returnPrice: 0,
    departureTicketappUuid: null,
    returnTicketappUuid: null,
    appliedPromoCode: null,
    discountAmount: 0,
    discountPercentage: null,
    verifiedContact: null,
    verificationSessionId: null,
    transactionId: null,
    paymentMethod: null,
    pendingPaymentMethod: null,
    bookedAt: null,
    tripUuid: null,
    departureRequestId: null,
    returnRequestId: null,
};

/**
 * Booking store instance using PersistentStore
 * Provides reactive state management with localStorage persistence
 */
export const bookingStore = new PersistentStore<BookingStateData>(
    BOOKING_STORAGE_KEY,
    defaultBookingState
);

/**
 * Helper to reset booking to initial state
 * Call after successful payment or when user wants to start fresh
 */
export function resetBookingState(): void {
    bookingStore.set({ ...defaultBookingState });
    bookingStore.clear();
}

/**
 * Helper to update specific fields in booking state
 */
export function updateBookingFields(updates: Partial<BookingStateData>): void {
    bookingStore.update(current => ({
        ...current,
        ...updates,
    }));
}

/**
 * Check if booking state has required data for payment
 */
export function isBookingReadyForPayment(state: BookingStateData): boolean {
    if (!state.departureAirport) return false;
    if (!state.departurePrice) return false;
    if (state.addReturnFlight && (!state.returnAirport || !state.returnPrice)) return false;
    return true;
}

/**
 * Calculate total price from booking state
 */
export function calculateTotalPrice(state: BookingStateData): number {
    const outboundTotal = state.departurePrice * state.passengerCount;
    const returnTotal = state.addReturnFlight
        ? state.returnPrice * state.passengerCount
        : 0;
    let total = outboundTotal + returnTotal;

    // Apply discount
    if (state.discountAmount > 0) {
        total = total - state.discountAmount;
    } else if (state.discountPercentage) {
        total = total * (1 - state.discountPercentage / 100);
    }

    return Math.round(total * 100) / 100; // Round to 2 decimal places
}

/**
 * Get price before any discounts
 */
export function calculatePriceBeforeDiscount(state: BookingStateData): number {
    const outboundTotal = state.departurePrice * state.passengerCount;
    const returnTotal = state.addReturnFlight
        ? state.returnPrice * state.passengerCount
        : 0;
    return outboundTotal + returnTotal;
}
