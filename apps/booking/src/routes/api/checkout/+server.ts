import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { CheckoutSessionRequest, CheckoutSessionResponse } from '$lib/stripe/client';
import Stripe from 'stripe';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session
 * 
 * Supports multiple payment methods: card, PayPal, Apple Pay, Google Pay
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body: CheckoutSessionRequest = await request.json();

        // Validate required fields
        if (!body.amount || !body.currency || !body.paymentMethod) {
            return json(
                { message: 'Missing required fields: amount, currency, paymentMethod' },
                { status: 400 }
            );
        }

        // Get Stripe secret key from environment (server-side only)
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
            // Fallback to mock mode if no valid secret key
            const mockSessionId = `cs_mock_${crypto.randomUUID()}`;
            const successUrl = new URL(body.successUrl);
            successUrl.searchParams.set('session_id', mockSessionId);

            console.log('⚠️ Mock Mode: No valid STRIPE_SECRET_KEY found');
            return json({
                sessionId: mockSessionId,
                url: successUrl.toString(),
            });
        }

        // Initialize Stripe with secret key
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-12-15.clover',
        });

        // Map payment method to Stripe's payment_method_types
        const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
            body.paymentMethod === 'paypal'
                ? ['paypal', 'card']
                : body.paymentMethod === 'apple_pay'
                    ? ['card'] // Apple Pay is enabled automatically when card is included
                    : body.paymentMethod === 'google_pay'
                        ? ['card'] // Google Pay is enabled automatically when card is included
                        : ['card'];

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: paymentMethodTypes,
            line_items: [
                {
                    price_data: {
                        currency: body.currency,
                        product_data: {
                            name: 'Priority Pass Airport Service',
                            description: body.metadata?.departureAirport
                                ? `Priority Pass service for ${body.metadata.departureAirport}${body.metadata.returnAirport ? ' and ' + body.metadata.returnAirport : ''}`
                                : 'Priority Pass airport service booking',
                        },
                        unit_amount: body.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: body.successUrl,
            cancel_url: body.cancelUrl,
            metadata: body.metadata || {},
        });

        // Log successful session creation
        console.log('✅ Stripe Checkout Session Created:', {
            sessionId: session.id,
            amount: body.amount,
            currency: body.currency,
            paymentMethod: body.paymentMethod,
            paymentMethodTypes,
            url: session.url,
        });

        const response: CheckoutSessionResponse = {
            sessionId: session.id,
            url: session.url || body.successUrl,
        };

        return json(response);
    } catch (error) {
        console.error('❌ Stripe Checkout error:', error);
        return json(
            { message: error instanceof Error ? error.message : 'Failed to create checkout session' },
            { status: 500 }
        );
    }
};
