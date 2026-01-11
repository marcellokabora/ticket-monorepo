/**
 * Booking State Module (Svelte 5 Runes)
 *
 * Shared reactive state for the booking flow.
 * Import this module anywhere to access/modify booking state.
 * No context needed - module state is shared across all imports.
 */

import type {
    Currency,
    Airport,
    ContactInfo,
    PaymentMethod,
    RestrictedAirline,
} from "@ticketapp/api";

// Types
export interface BookingState {
    selectedCurrency: Currency;
    departureAirport: Airport | null;
    departureAirline: RestrictedAirline | null;
    returnAirport: Airport | null;
    returnAirline: RestrictedAirline | null;
    addReturnFlight: boolean;
    passengerCount: number;
    appliedPromoCode: string | null;
    discountAmount: number;
    discountPercentage: number | null;
    departurePrice: number;
    returnPrice: number;
    departureTicketappUuid: string | null;
    returnTicketappUuid: string | null;
    verifiedContact: ContactInfo | null;
    verificationSessionId: string | null;
    transactionId: string | null;
    paymentMethod: PaymentMethod | null;
    pendingPaymentMethod: string | null;
    bookedAt: Date | null;
    tripUuid: string | null;
    departureRequestId: string | null;
    returnRequestId: string | null;
    loadErrors: {
        currency?: string;
        departure?: string;
        return?: string;
    };
}

// Default state
const defaultState: BookingState = {
    selectedCurrency: {
        code: "EUR",
        name: "Euro",
        symbol: "€",
    },
    departureAirport: null,
    departureAirline: null,
    returnAirport: null,
    returnAirline: null,
    addReturnFlight: false,
    passengerCount: 1,
    appliedPromoCode: null,
    discountAmount: 0,
    discountPercentage: null,
    departurePrice: 0,
    returnPrice: 0,
    departureTicketappUuid: null,
    returnTicketappUuid: null,
    verifiedContact: null,
    verificationSessionId: null,
    transactionId: null,
    paymentMethod: null,
    pendingPaymentMethod: null,
    bookedAt: null,
    tripUuid: null,
    departureRequestId: null,
    returnRequestId: null,
    loadErrors: {},
};

// Global reactive state (shared across all imports)
export const booking = $state<BookingState>({ ...defaultState });

// Load entire booking state from sessionStorage on init (cleared when browser closes)
if (typeof window !== 'undefined') {
    const storedBooking = sessionStorage.getItem('bookingState');
    if (storedBooking) {
        try {
            const parsed = JSON.parse(storedBooking);
            // Restore dates as Date objects
            if (parsed.bookedAt) {
                parsed.bookedAt = new Date(parsed.bookedAt);
            }
            Object.assign(booking, parsed);
            console.log('✅ Booking state restored from sessionStorage');
            console.log('   Departure:', parsed.departureAirport?.name);
            console.log('   Passengers:', parsed.passengerCount);
        } catch (err) {
            console.error('Failed to parse booking state from sessionStorage:', err);
        }
    } else {
        console.log('ℹ️ No booking state found in sessionStorage');
    }
}

// Set verified contact and persist to sessionStorage (not localStorage)
// This allows users to navigate back and make changes without re-verifying
// But clears when browser closes for security
export function saveVerifiedContact(contact: ContactInfo | null): void {
    booking.verifiedContact = contact;
    saveBookingState();
}

// Save entire booking state to sessionStorage
export function saveBookingState(): void {
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem('bookingState', JSON.stringify(booking));
            console.log('💾 Booking state saved to sessionStorage');
            console.log('   Departure:', booking.departureAirport?.name);
            console.log('   Transaction:', booking.transactionId);
        } catch (err) {
            console.error('Failed to save booking state to sessionStorage:', err);
        }
    }
}

// Reset booking to default state
export function resetBooking(): void {
    Object.assign(booking, { ...defaultState, loadErrors: {} });
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bookingState');
    }
}

// Computed values
export function getTotalPrice(): number {
    const baseTotal =
        (booking.departurePrice +
            (booking.addReturnFlight ? booking.returnPrice : 0)) *
        booking.passengerCount;

    // Apply percentage discount if set (e.g., fake promo code "1234")
    if (booking.discountPercentage !== null) {
        const discountAmount = (baseTotal * booking.discountPercentage) / 100;
        return Math.max(0, baseTotal - discountAmount);
    }

    // Apply fixed discount amount
    return Math.max(0, baseTotal - booking.discountAmount);
}

export function hasValidDeparture(): boolean {
    return booking.departureAirport !== null && booking.departurePrice > 0;
}

export function hasValidReturn(): boolean {
    return (
        !booking.addReturnFlight ||
        (booking.returnAirport !== null && booking.returnPrice > 0)
    );
}

export function isReadyForPayment(): boolean {
    return hasValidDeparture() && hasValidReturn();
}
