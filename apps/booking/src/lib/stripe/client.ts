import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js';

// Re-export types for use in components
export type { Stripe, StripeElements, StripeCardElement };

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance (lazy-loaded singleton)
 * Returns null if VITE_STRIPE_PUBLIC_KEY  is not set
 */
export function getStripe(): Promise<Stripe | null> {
    if (!stripePromise) {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (!publishableKey) {
            console.warn('Stripe: VITE_STRIPE_PUBLIC_KEY  not set, using mock mode');
            stripePromise = Promise.resolve(null);
        } else {
            stripePromise = loadStripe(publishableKey);
        }
    }
    return stripePromise;
}

/**
 * Payment method types supported by our checkout
 */
export type CheckoutPaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal';

/**
 * Checkout session request data
 */
export interface CheckoutSessionRequest {
    /** Amount in smallest currency unit (e.g., cents for USD) */
    amount: number;
    /** ISO 4217 currency code (lowercase) */
    currency: string;
    /** Payment method to use */
    paymentMethod: CheckoutPaymentMethod;
    /** Booking metadata */
    metadata: {
        tripUuid?: string;
        departureAirport: string;
        returnAirport?: string;
        passengerCount: number;
        promoCode?: string;
    };
    /** Success redirect URL */
    successUrl: string;
    /** Cancel redirect URL */
    cancelUrl: string;
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
}

/**
 * Create a checkout session (calls server endpoint)
 * In mock mode, returns a fake session that simulates success
 */
export async function createCheckoutSession(
    request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
    const response = await fetch('/booking/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
}

/**
 * Redirect to Stripe Checkout
 * In v8+, we redirect directly to the checkout URL
 */
export async function redirectToCheckout(sessionUrl: string): Promise<void> {
    // In Stripe v8+, redirectToCheckout is removed
    // We redirect directly to the session URL provided by the server
    window.location.href = sessionUrl;
}

/**
 * Payment Intent request data
 */
export interface PaymentIntentRequest {
    /** Amount in smallest currency unit (e.g., cents for USD) */
    amount: number;
    /** ISO 4217 currency code (lowercase) */
    currency: string;
    /** Booking metadata */
    metadata?: {
        tripUuid?: string;
        departureAirport?: string;
        returnAirport?: string;
        passengerCount?: number;
        promoCode?: string;
    };
}

/**
 * Payment Intent response
 */
export interface PaymentIntentResponse {
    paymentIntentId: string;
    clientSecret: string;
}

/**
 * Create a Payment Intent for embedded checkout (Payment Element)
 * Used for PayPal, Apple Pay, Google Pay, and card payments
 */
export async function createPaymentIntent(
    request: PaymentIntentRequest
): Promise<PaymentIntentResponse> {
    const response = await fetch('/booking/api/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
}
