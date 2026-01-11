import { booking } from '$lib/state/booking.svelte';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
    // Only run validation on client side where sessionStorage is available
    if (!browser) {
        return {
            tripId: url.searchParams.get('tripId'),
            sessionId: url.searchParams.get('session_id'),
        };
    }

    const tripId = url.searchParams.get('tripId');
    const sessionId = url.searchParams.get('session_id');

    // Wait a tick to ensure sessionStorage has been restored
    await new Promise(resolve => setTimeout(resolve, 0));

    // Store tripId if provided (for reference/display purposes)
    if (tripId) {
        console.log('📥 Trip ID received:', tripId);
        booking.tripUuid = tripId;
    }

    // If we have a Stripe session_id, set it as transactionId
    if (sessionId) {
        console.log('💳 Session ID detected:', sessionId);
        booking.transactionId = sessionId;
        booking.bookedAt = new Date();

        // Determine payment method from URL or default to stripe
        const paymentMethod = url.searchParams.get('payment_method') as any || 'credit_card';
        booking.paymentMethod = paymentMethod;
    }

    // Validate required data from booking store
    // The booking store should already have all the data from the booking flow
    if (!booking.departureAirport) {
        console.error('❌ Missing departure airport in booking state');
        throw error(400, {
            message: 'Booking information is incomplete. Please start a new booking.',
        });
    }

    if (!booking.transactionId && !sessionId) {
        console.error('❌ Missing transaction ID');
        throw error(400, {
            message: 'No payment information found.',
        });
    }

    console.log('✅ Confirmation page loaded with store data');
    console.log('   Departure:', booking.departureAirport?.name);
    console.log('   Return:', booking.returnAirport?.name || 'None');
    console.log('   Passengers:', booking.passengerCount);
    console.log('   Total Price:', booking.departurePrice * booking.passengerCount + (booking.addReturnFlight ? booking.returnPrice * booking.passengerCount : 0));

    return {
        tripId,
        sessionId,
    };
};
