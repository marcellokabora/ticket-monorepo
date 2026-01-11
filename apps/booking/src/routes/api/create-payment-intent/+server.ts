import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';

interface PaymentIntentRequest {
    amount: number;
    currency: string;
    metadata?: {
        departureAirport?: string;
        returnAirport?: string;
        passengerCount?: number;
        promoCode?: string;
    };
}

interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

/**
 * POST /api/create-payment-intent
 * Creates a Stripe Payment Intent for embedded checkout (Stripe Elements)
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body: PaymentIntentRequest = await request.json();

        // Validate required fields
        if (!body.amount || !body.currency) {
            return json(
                { message: 'Missing required fields: amount, currency' },
                { status: 400 }
            );
        }

        // Get Stripe secret key from environment (server-side only)
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
            // Mock mode - return fake payment intent
            const mockPaymentIntentId = `pi_mock_${crypto.randomUUID()}`;
            const mockClientSecret = `${mockPaymentIntentId}_secret_mock`;

            console.log('⚠️ Mock Mode: No valid STRIPE_SECRET_KEY found');
            return json({
                paymentIntentId: mockPaymentIntentId,
                clientSecret: mockClientSecret,
            });
        }

        // Initialize Stripe with secret key
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-12-15.clover',
        });

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: body.amount,
            currency: body.currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: body.metadata || {},
            description: body.metadata?.departureAirport
                ? `Priority Pass service for ${body.metadata.departureAirport}${body.metadata.returnAirport ? ' and ' + body.metadata.returnAirport : ''}`
                : 'Priority Pass airport service booking',
        });

        console.log('✅ Payment Intent Created:', {
            paymentIntentId: paymentIntent.id,
            amount: body.amount,
            currency: body.currency,
            status: paymentIntent.status,
        });

        const response: PaymentIntentResponse = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret!,
        };

        return json(response);
    } catch (error) {
        console.error('❌ Payment Intent error:', error);
        return json(
            { message: error instanceof Error ? error.message : 'Failed to create payment intent' },
            { status: 500 }
        );
    }
};
