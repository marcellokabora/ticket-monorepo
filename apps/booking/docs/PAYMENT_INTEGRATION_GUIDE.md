# Stripe Payment Integration Guide

This guide explains the payment integration setup in the Priority Pass booking application, including the two different Stripe integration patterns and how to configure them.

## Overview

The booking application supports multiple payment methods through two different Stripe integration approaches:

1. **Stripe Checkout** (Hosted Payment Page)
2. **Stripe Elements** (Embedded Payment Form)

### Supported Payment Methods

- **Credit/Debit Cards** (Visa, Mastercard, Amex, etc.)
- **PayPal**
- **Apple Pay** (automatically enabled with card payments)
- **Google Pay** (automatically enabled with card payments)

## Two Payment Integration Patterns

### 1. Stripe Checkout (Hosted Payment Page)

**Endpoint:** `/api/checkout/+server.ts`

**Purpose:** Redirects users to Stripe's hosted checkout page where Stripe handles the entire payment UI.

**Best For:**

- Quick integration with minimal frontend work
- When you want Stripe to handle payment security and UI
- Supporting multiple payment methods easily (PayPal, Apple Pay, Google Pay)

**How It Works:**

1. User clicks payment button (PayPal, Apple Pay, etc.)
2. Backend creates a Checkout Session with `stripe.checkout.sessions.create()`
3. Returns a `sessionId` and redirect `url`
4. User is redirected to Stripe's hosted payment page
5. After payment, user is redirected back to your success/cancel URL

**Response:**

```typescript
{
  sessionId: "cs_test_...",
  url: "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Supported Payment Methods:**

- PayPal: `['paypal', 'card']`
- Apple Pay: `['card']` (auto-enabled)
- Google Pay: `['card']` (auto-enabled)
- Cards only: `['card']`

### 2. Stripe Payment Intent (Embedded Payment Form)

**Endpoint:** `/api/create-payment-intent/+server.ts`

**Purpose:** Creates a Payment Intent for embedded payment forms using Stripe Elements on your own site.

**Best For:**

- Custom payment UI that matches your brand
- Full control over the payment experience
- Keeping users on your site throughout the payment process

**How It Works:**

1. Frontend requests a Payment Intent from your backend
2. Backend creates Payment Intent with `stripe.paymentIntents.create()`
3. Returns a `clientSecret`
4. Frontend uses Stripe Elements (Stripe.js) to collect payment details
5. Frontend confirms payment using the `clientSecret`
6. Payment happens without leaving your site

**Response:**

```typescript
{
  paymentIntentId: "pi_test_...",
  clientSecret: "pi_test_..._secret_..."
}
```

**Features:**

- `automatic_payment_methods: { enabled: true }` - Automatically supports all enabled payment methods
- Payment form stays embedded in your site
- More flexibility for custom UX

## User Flow Comparison

### Stripe Checkout Flow

1. User fills out booking details (airport, passengers, etc.)
2. User clicks the **PayPal** button (or Apple Pay/Google Pay)
3. Application creates a Stripe Checkout session via `/booking/api/checkout`
4. User is **redirected to Stripe's hosted checkout page**
5. User selects PayPal (or other payment method)
6. User completes payment through Stripe's UI
7. User is redirected back to `/booking/ticket` with session ID

### Stripe Elements Flow

1. User fills out booking details
2. User sees **embedded payment form** on your site
3. Application creates a Payment Intent via `/booking/api/create-payment-intent`
4. Stripe Elements loads payment form
5. User enters payment details **without leaving your site**
6. Frontend confirms payment using Payment Intent
7. User sees success message on the same page

## Technical Implementation

### Stripe Checkout Implementation

**Component: `AlternativePaymentButtons.svelte`**

```typescript
import { createCheckoutSession, redirectToCheckout } from "$lib/stripe/client";

// Create checkout session with PayPal enabled
const session = await createCheckoutSession({
  amount: amount, // Already in cents
  currency: booking.selectedCurrency.code.toLowerCase(),
  paymentMethod: "paypal", // or "apple_pay", "google_pay", "card"
  metadata: {
    departureAirport: booking.departureAirport.iata,
    returnAirport: booking.returnAirport?.iata,
    passengerCount: booking.passengerCount,
    promoCode: booking.promoCode || undefined,
  },
  successUrl: `${window.location.origin}/booking/ticket?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${window.location.origin}/booking`,
});

// Redirect to Stripe Checkout
await redirectToCheckout(session.url);
```

**Server Endpoint: `/booking/api/checkout/+server.ts`**

```typescript
import Stripe from "stripe";

// Map payment method to Stripe's payment_method_types
const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
  body.paymentMethod === "paypal"
    ? ["paypal", "card"]
    : body.paymentMethod === "apple_pay"
    ? ["card"] // Apple Pay enabled automatically
    : body.paymentMethod === "google_pay"
    ? ["card"] // Google Pay enabled automatically
    : ["card"];

// Create Stripe Checkout Session
const session = await stripe.checkout.sessions.create({
  payment_method_types: paymentMethodTypes,
  line_items: [
    {
      price_data: {
        currency: body.currency,
        product_data: {
          name: "Priority Pass Airport Service",
          description: `Priority Pass service for ${body.metadata?.departureAirport}`,
        },
        unit_amount: body.amount, // Amount in cents
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: body.successUrl,
  cancel_url: body.cancelUrl,
  metadata: body.metadata || {},
});

return json({
  sessionId: session.id,
  url: session.url,
});
```

### Stripe Elements Implementation

**Frontend Component:**

```typescript
// 1. Create Payment Intent
const response = await fetch("/booking/api/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: Math.round(totalPrice * 100), // Convert to cents
    currency: booking.selectedCurrency.code.toLowerCase(),
    metadata: {
      departureAirport: booking.departureAirport.iata,
      returnAirport: booking.returnAirport?.iata,
      passengerCount: booking.passengerCount,
    },
  }),
});

const { clientSecret } = await response.json();

// 2. Mount Stripe Elements
const stripe = await loadStripe(VITE_STRIPE_PUBLIC_KEY);
const elements = stripe.elements({ clientSecret });
const paymentElement = elements.create("payment");
paymentElement.mount("#payment-element");

// 3. Handle form submission
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/booking/ticket`,
  },
});
```

**Server Endpoint: `/booking/api/create-payment-intent/+server.ts`**

```typescript
import Stripe from "stripe";

// Create Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: body.amount, // Amount in cents
  currency: body.currency,
  automatic_payment_methods: {
    enabled: true, // Auto-enables all payment methods
  },
  metadata: body.metadata || {},
  description: `Priority Pass service for ${body.metadata?.departureAirport}`,
});

return json({
  paymentIntentId: paymentIntent.id,
  clientSecret: paymentIntent.client_secret,
});
```

## Required Setup in Stripe Dashboard

### Step 1: Enable Payment Methods

1. **Log in to Stripe Dashboard**

   - Go to https://dashboard.stripe.com/

2. **Navigate to Payment Methods**

   - Click **Settings** in the left sidebar
   - Select **Payment methods** under "Payments"

3. **Enable Payment Methods**

   - **Cards** (already enabled by default)
   - **PayPal** - Click to enable
   - **Apple Pay** - Automatically enabled with cards
   - **Google Pay** - Automatically enabled with cards

4. **Configure PayPal Settings**

   - Choose supported currencies (EUR, USD, GBP, etc.)
   - Set up business information
   - Configure statement descriptor (optional)

5. **Save Changes**

### Step 2: Verify Currency Support

Ensure your currencies are supported:

- EUR (Euro) ✅
- USD (US Dollar) ✅
- GBP (British Pound) ✅

### Step 3: Test Mode Configuration

**For Development/Testing:**

1. Enable payment methods in **Test Mode**
2. Use Stripe test cards:
   - Card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
3. Test PayPal with Stripe's sandbox

**For Production:**

1. Enable payment methods in **Live Mode**
2. Complete Stripe account verification
3. Test with real payment methods (small amounts)

## Environment Variables

### Client-Side (Frontend)

**.env.local**

```bash
# Stripe Public Key (client-side)
VITE_STRIPE_PUBLIC_KEY=pk_test_... # Test mode
# or
VITE_STRIPE_PUBLIC_KEY=pk_live_... # Live mode
```

### Server-Side (Backend)

**Environment Variables** (not committed to Git)

```bash
# Stripe Secret Key (server-side only)
STRIPE_SECRET_KEY=sk_test_... # Test mode
# or
STRIPE_SECRET_KEY=sk_live_... # Live mode
```

⚠️ **Never commit secret keys to version control!**

## Mock Mode for Development

Both endpoints support mock mode when `STRIPE_SECRET_KEY` is not configured:

**Checkout Session Mock:**

```typescript
const mockSessionId = `cs_mock_${crypto.randomUUID()}`;
return { sessionId: mockSessionId, url: successUrl };
```

**Payment Intent Mock:**

```typescript
const mockPaymentIntentId = `pi_mock_${crypto.randomUUID()}`;
const mockClientSecret = `${mockPaymentIntentId}_secret_mock`;
return { paymentIntentId: mockPaymentIntentId, clientSecret: mockClientSecret };
```

## Choosing the Right Integration

### Use Stripe Checkout When:

✅ You want a quick integration  
✅ You don't need custom payment UI  
✅ You want Stripe to handle PCI compliance  
✅ You need PayPal, Apple Pay, Google Pay out of the box  
✅ You're okay with redirecting users off your site

### Use Stripe Elements When:

✅ You need custom branded payment UI  
✅ You want full control over the payment experience  
✅ You want users to stay on your site  
✅ You need advanced payment flows  
✅ You want to customize the payment form layout

## Pricing Calculation

Amount must be converted to cents before sending to Stripe:

```typescript
// Convert to cents (multiply by 100)
const amountInCents = Math.round(totalPrice * 100);

// Send to Stripe
const session = await createCheckoutSession({
  amount: amountInCents, // Already in cents
  currency: "eur",
});
```

**Important:** Only convert to cents ONCE in your code to avoid double conversion errors.

## Troubleshooting

### Issue: PayPal not shown in Stripe Checkout

**Cause:** PayPal not enabled in Stripe account.

**Solution:**

1. Enable PayPal in Stripe Dashboard
2. Wait a few minutes for propagation
3. Test again

### Issue: "Payment method not available" error

**Cause:**

- Currency not supported by payment method
- Account region restrictions
- Business type restrictions

**Solution:**

1. Verify currency support for payment method
2. Check Stripe account country settings
3. Contact Stripe support

### Issue: Amount shows incorrect value (e.g., €625 instead of €6.25)

**Cause:** Double conversion to cents.

**Solution:** Convert to cents only once before sending to Stripe.

### Issue: Elements not loading

**Cause:**

- Missing `VITE_STRIPE_PUBLIC_KEY`
- Invalid `clientSecret`
- Network error

**Solution:**

1. Verify environment variables
2. Check Payment Intent creation
3. Check browser console for errors

## Testing Checklist

Before production deployment:

### Stripe Checkout

- [ ] Payment methods enabled in Stripe test mode
- [ ] Test PayPal payment flow
- [ ] Correct amount displayed (in cents)
- [ ] Currency matches booking
- [ ] Success redirect works
- [ ] Cancel redirect works
- [ ] Metadata saved correctly

### Stripe Elements

- [ ] Payment Intent created successfully
- [ ] Elements mount correctly
- [ ] Payment confirmation works
- [ ] Error handling works
- [ ] Success redirect works

### Production

- [ ] Payment methods enabled in live mode
- [ ] Test with real payment methods
- [ ] Monitor first transactions
- [ ] Webhooks configured

## Related Documentation

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements](https://stripe.com/docs/payments/elements)
- [PayPal with Stripe](https://stripe.com/docs/payments/paypal)
- [Testing](https://stripe.com/docs/testing)

## Support

If you encounter issues:

1. Check Stripe Dashboard logs
2. Review browser console for errors
3. Check server logs for API errors
4. Contact Stripe support for account issues
5. Review this documentation

---

**Last Updated:** January 5, 2026  
**Related Files:**

- [apps/booking/src/routes/api/checkout/+server.ts](../src/routes/api/checkout/+server.ts) - Stripe Checkout endpoint
- [apps/booking/src/routes/api/create-payment-intent/+server.ts](../src/routes/api/create-payment-intent/+server.ts) - Payment Intent endpoint
- [apps/booking/src/lib/components/AlternativePaymentButtons.svelte](../src/lib/components/AlternativePaymentButtons.svelte) - Payment buttons component
- [apps/booking/src/lib/stripe/client.ts](../src/lib/stripe/client.ts) - Stripe client utilities
