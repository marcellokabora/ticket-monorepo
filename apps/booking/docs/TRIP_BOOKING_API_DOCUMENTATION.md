# Trip & Booking API Documentation

This document outlines the complete API flow used in the ticketapp Priority Pass application, from user authentication through verification (SMS/Email) to payment processing via Stripe. This documentation is designed to help developers recreate this flow in other frameworks (Svelte, React, Angular, etc.).

---

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Authentication Flow](#authentication-flow)
3. [Verification Flow (SMS/Email)](#verification-flow-smsemail)
4. [Trip Management APIs](#trip-management-apis)
5. [Payment APIs](#payment-apis)
6. [URL Parameters Reference](#url-parameters-reference)
7. [Complete Flow Examples](#complete-flow-examples)
8. [Stripe Integration](#stripe-integration)

---

## Environment Configuration

### Base URLs by Environment

```typescript
const CONFIG = {
  development: {
    apiBaseUrl: "https://api.development.Priority Pass.flights/api/v1.2",
    apiAuthUrl: "https://authentication.development.ticketapp.com/1.0",
    paymentReturnUrl: "https://get.development.Priority Pass.flights",
    verifyUrl: "https://verify-api.development.Priority Pass.flights",
    dispatcherUrl: "https://server.development.Priority Pass.flights",
    appPriority PassHostname: "https://development.Priority Pass.flights/",
    apiPaymentUrl: "https://payment.development.ticketapp.com",
    apiPricingUrl: "https://pricing.development.ticketapp.com",
    apiBookingUrl: "https://booking.development.ticketapp.com",
    apiPaymentPay: "https://pay.development.Priority Pass.flights",
  },
  staging: {
    apiBaseUrl: "https://api.test.Priority Pass.flights/api/v1.2",
    apiAuthUrl: "https://authentication.test.ticketapp.com/1.0",
    verifyUrl: "https://verify-api.test.Priority Pass.flights",
    apiPaymentPay: "https://pay.test.Priority Pass.flights",
    // ... other endpoints
  },
  production: {
    apiBaseUrl: "https://api.Priority Pass.flights/api/v1.2",
    apiAuthUrl: "https://authentication.ticketapp.com/1.0",
    verifyUrl: "https://verify-api.Priority Pass.flights",
    apiPaymentPay: "https://pay.Priority Pass.flights",
    // ... other endpoints
  },
};
```

### API Endpoints Reference

```typescript
const API_ENDPOINTS = {
  API_BASE_URI: config.apiBaseUrl, // Core API (trips, requests, availability)
  API_AUTH_URI: config.apiAuthUrl, // Authentication tokens
  API_VERIFY_URI: config.verifyUrl, // SMS/Email verification
  APP_PAYMENT_PAY: config.apiPaymentPay, // Payment processing
  APP_BOOKING_URI: config.apiBookingUrl, // Booking management
  API_DISPATCHER_URI: config.dispatcherUrl, // Pass downloads
};
```

---

## Authentication Flow

### Overview

The application uses a token-based authentication system. Tokens are obtained via the `/authentication/token/` endpoint and must be included in subsequent API calls.

### 1. Get Authentication Token

**Endpoint:** `POST {API_AUTH_URI}/authentication/token/`

**Purpose:** Obtains an authentication token for subsequent API calls. This is the FIRST step before any other API interaction.

**Request Body:**

```typescript
interface TokenParams {
  url: string; // The full URL with query parameters including hmac, brand, request_uuid
}
```

**Example Request:**

```typescript
// For initial request access (from booking flow)
const tokenParams = `?request_uuid=${requestId}&brand=${brand}&hmac=${hmac}`;
const response = await fetch(`${API_AUTH_URI}/authentication/token/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: tokenParams }),
});

// For payment page access
const response = await fetch(`${API_AUTH_URI}/authentication/token/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: window.location.href }), // Full URL with all params
});
```

**Response:**

```typescript
interface TokenResponse {
  token: string; // JWT token for authentication
}
```

**Usage:** Store this token and include it in headers:

- As `Authorization: Bearer {token}` for `authToken` authenticated endpoints
- As `X-PNF-Token: {token}` for payment-related endpoints

---

## Verification Flow (SMS/Email)

### Overview

Before accessing payment, users must verify their identity via SMS or Email OTP (One-Time Password). The flow is:

1. User enters phone/email
2. System sends OTP code
3. User enters the 4-digit PIN
4. On successful verification, user receives `validation_params` containing payment URL parameters

### 2.1 Send SMS Verification Code

**Endpoint:** `POST {API_VERIFY_URI}/phone/verify-member-phone`

**Request Body:**

```typescript
interface VerifyMemberPhoneRequest {
  number: string; // Phone number without country code (e.g., "612345678")
  prefix: string; // Country code (e.g., "+34", "34")
}
```

**Response:**

```typescript
interface VerifyMemberPhoneResponse {
  message: string;
  status:
    | "OTP_SENT"
    | "OTP_RESENT"
    | "SUCCESSFULLY_VERIFIED"
    | "ALREADY_VERIFIED";
  verificationSessionId: string; // IMPORTANT: Save this for OTP verification
}
```

### 2.2 Send Email Verification Code

**Endpoint:** `POST {API_VERIFY_URI}/email/verify-member-email`

**Request Body:**

```typescript
interface VerifyMemberEmailRequest {
  email: string; // User's email address
}
```

**Response:**

```typescript
interface VerifyMemberEmailResponse {
  message: string;
  status:
    | "OTP_SENT"
    | "OTP_RESENT"
    | "SUCCESSFULLY_VERIFIED"
    | "ALREADY_VERIFIED";
  verificationSessionId: string; // IMPORTANT: Save this for OTP verification
}
```

### 2.3 Verify OTP (PIN Code)

**Endpoint:** `POST {API_VERIFY_URI}/{method}/verify-otp`

Where `{method}` is either `phone` or `email`

**Query Parameters:**

```typescript
interface VerifyOtpQueryParams {
  verification_session_id: string; // From step 2.1 or 2.2
  otp: string; // 4-digit PIN entered by user
  request_id: string; // The Priority Pass request UUID
}
```

**Response:**

```typescript
interface VerifyOtpResponse {
  message: string;
  status: "SUCCESSFULLY_VERIFIED" | "ALREADY_VERIFIED";
  data?: {
    validation_params?: Array<{
      key: string; // Parameter name (e.g., 'uuid_booking_group', 'hmac', 'currency')
      value: string; // Parameter value
    }>;
  };
}
```

**CRITICAL:** The `validation_params` array contains all the parameters needed to construct the payment URL:

```typescript
// Example validation_params:
[
  { key: "brand", value: "Priority Pass-app" },
  { key: "currency", value: "EUR" },
  { key: "locale", value: "en" },
  { key: "uuid_booking", value: "24623c33bdea6e13d5930e4959d7305e" },
  { key: "header", value: "on" },
  { key: "uuid_booking_group", value: "50fb30ea84434a53ae9a89453a4048e5" },
  {
    key: "hmac",
    value: "3ed423eb62adf9ad3c96cb1ebdc5f6c836967493eb390802e0e54979d9a0d158",
  },
];

// Convert to URL query string:
const query = Object.fromEntries(validationParams.map((p) => [p.key, p.value]));
// Navigate to: /payment/view?brand=Priority Pass-app&currency=EUR&locale=en&uuid_booking=...&hmac=...
```

### 2.4 Resend OTP

**Endpoint:** `PUT {API_VERIFY_URI}/{method}/resend-otp`

**Query Parameters:**

```typescript
interface ResendOtpQueryParams {
  verification_session_id: string;
}
```

**Response:**

```typescript
interface ResendOtpResponse {
  message: string;
  status: "OTP_RESENT";
}
```

---

## 1. Trip Management APIs

### 1.1 Create Trip

**Endpoint:** `POST /trip`

**Purpose:** Creates a new trip with departure and/or return flight requests.

**Request Body:**

```typescript
{
  requests: [
    {
      itinerary: {
        departure_airport: { iata: string },
        arrival_airport: { iata: string }
      },
      booking: {
        number_of_passengers: number,
        currency: { code: string },
        local_price: number
      },
      Priority Pass: {
        uuid: string,
        provider: { uuid: string }
      },
      departure_date: string,
      flight_number?: string,
      airline?: { iata: string },
      source: string  // Added automatically: "web", "ios", "android"
    }
  ],
  member?: { uuid: string }  // Optional: for logged-in users
}
```

**Response:**

```typescript
{
  data: {
    uuid: string,              // Trip UUID
    requests: Priority PassRequest[],
    completed: boolean,
    member?: { uuid: string }
  }
}
```

**Authentication:** Requires `authToken` header

**Implementation Reference:**

- API: [`api/domains/trip/trip.api.ts`](api/domains/trip/trip.api.ts)
- Composable: [`composables/useManageTrip.ts`](composables/useManageTrip.ts)

---

### 1.2 Add Requests to Trip (Return Flight)

**Endpoint:** `PATCH /trip/{tripUuid}/add-requests`

**Purpose:** Adds additional requests (typically return flight) to an existing trip.

**Request Body:**

```typescript
{
  requests: [
    {
      // Same structure as Create Trip request
      itinerary: { ... },
      booking: { ... },
      Priority Pass: { ... },
      source: string
    }
  ]
}
```

**Response:** Same structure as Create Trip

**Authentication:** Requires `authToken` header

**Use Case:** Called when user adds a return flight after creating initial departure trip

---

### 1.3 Get Trip Details

**Endpoint:** `GET /trip/{tripUuid}`

**Purpose:** Retrieves complete trip information including all requests, booking status, and transactions.

**Response:**

```typescript
{
  data: {
    uuid: string,
    requests: Priority PassRequest[],
    completed: boolean,
    member?: { uuid: string }
  }
}
```

**Authentication:** Requires `authToken` header

---

### 1.4 Get Booking Status

**Endpoint:** `GET /trip/{uuid}/booking-status`

**Purpose:** Retrieves booking status, transactions, and disclaimer for a trip.

**Response:**

```typescript
{
  data: [
    {
      request: Priority PassRequest,
      booking: Booking,
      transactions: Transaction[],
      disclaimer?: string
    }
  ]
}
```

**Authentication:** Requires `authToken` header

---

## 2. Payment APIs

### 2.1 Payment Validation

**Endpoint:** `POST /payment/validate`

**Purpose:** Validates payment and creates booking for a single request.

**Request Body:**

```typescript
{
  email?: string,
  name?: string,
  currency?: string,
  amount?: number,
  ext_uuid_stripe_payment_method?: string,
  ext_stripe_confirmation_token?: string,
  uuid_payment_method?: string,
  uuid_backoffice_brand?: string,
  uuid_booking?: string
}
```

**Authentication:** Requires `X-PNF-Token` header

---

### 2.2 Group Payment Validation

**Endpoint:** `POST /payment/group/validate`

**Purpose:** Validates payment for multiple requests (e.g., departure + return).

**Request Body:** Same as Payment Validation

**Response:**

```typescript
{
  booking_group: BookingGroup[],
  organization: Organization,
  brand: Brand,
  shortened_url: string,
  display_config: DisplayConfig,
  uuid_request?: string,
  payment_error: unknown
}
```

**Authentication:** Requires `X-PNF-Token` header

---

### 2.3 NOC Payment (No Credit Card)

**Endpoint:** `POST /1.0/noc/payment/`

**Purpose:** Processes payment for free or promotional Priority Pass passes (no credit card required).

**Request Body:**

```typescript
{
  email?: string,
  name?: string,
  uuid_booking?: string,
  uuid_booking_group?: string
}
```

**Authentication:** Requires `X-PNF-Token` header

---

### 2.4 Wallet Payment (Apple Pay / Google Pay)

#### Add Wallet Payment

**Endpoint:** `PATCH /request/{reqId}/add-wallet-pay`

**Purpose:** Initiates wallet payment (Apple Pay, Google Pay).

**Response:**

```typescript
{
  data: {
    amount: number,
    booking_uuid: string,
    currency_code: string,
    wallet_pay: {
      data: {
        client_secret: string,
        ext_uuid_payment_intent: string,
        requires_action: boolean
      },
      stripe_status: string
    }
  }
}
```

#### Confirm Wallet Payment

**Endpoint:** `PATCH /request/{reqId}/confirm-wallet-pay`

**Purpose:** Confirms the wallet payment after user authorization.

**Authentication:** Both require `authToken` header

---

### 2.5 PayPal Payment

#### Create PayPal Payment

**Endpoint:** `POST /1.0/paypal/payment`

**Purpose:** Initiates PayPal payment flow.

**Response:**

```typescript
{
  id: string; // PayPal payment ID
}
```

#### Confirm PayPal Payment

**Endpoint:** `POST /1.0/paypal/payment/confirm`

**Purpose:** Confirms PayPal payment after user authorization.

**Authentication:** Both require `X-PNF-Token` header

---

### 2.6 Coupon/Discount Management

#### Check Coupon

**Endpoint:** `POST /booking/{bookingUuid}/discount`

**Request Body:**

```typescript
{
  code: string; // Coupon code
}
```

**Authentication:** Requires `authToken` header

#### Delete Coupon

**Endpoint:** `DELETE /booking/{bookingUuid}/discount`

**Authentication:** Requires `X-PNF-Token` header

---

## 3. UTM Parameters

### Save UTM Parameters

**Endpoint:** `POST /utm_params`

**Purpose:** Saves marketing UTM parameters for analytics tracking.

**Request Body:**

```typescript
{
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,
  utm_term?: string,
  utm_content?: string
}
```

**Response:**

```typescript
{
  data: {
    id: number,
    utm_id: string,
    utm_source: string,
    utm_medium: string,
    id_request: number,
    created_timestamp: string
  }
}
```

**Authentication:** May vary based on configuration

---

## 4. Invoice Management

### 4.1 Create Invoice

**Endpoint:** `POST /trip/{uuid}/invoice`

**Purpose:** Creates an invoice for a trip (supports simple or detailed format).

**Request Body:**

```typescript
{
  // Simple format
  data?: string  // Raw text data

  // OR Detailed format
  company_name?: string,
  name_surname?: string,
  tax_id_number?: string,
  address_line_1?: string,
  address_line_2?: string,
  zip_code?: string,
  city?: string,
  country?: string,
  billing_email?: string
}
```

**Response:**

```typescript
{
  data: {
    success: boolean;
  }
}
```

---

### 4.2 Update Invoice

**Endpoint:** `PATCH /trip/{uuid}/invoice`

**Purpose:** Updates existing invoice information.

**Request Body:** Same as Create Invoice

---

### 4.3 Send Invoice Email

**Endpoint:** `POST /trip/{uuid}/invoice-email`

**Purpose:** Sends invoice to specified email address.

**Request Body:**

```typescript
{
  to_email: string,
  use_future: boolean
}
```

---

---

## URL Parameters Reference

### Payment Page URL Structure

After successful verification, the user is redirected to the payment page with the following URL structure:

```
https://{environment}.Priority Pass.flights/payment/view?{parameters}
```

**Example URL:**

```
https://development.Priority Pass.flights/payment/view?brand=Priority Pass-app&currency=EUR&locale=en&uuid_booking=24623c33bdea6e13d5930e4959d7305e&header=on&uuid_booking_group=50fb30ea84434a53ae9a89453a4048e5&hmac=3ed423eb62adf9ad3c96cb1ebdc5f6c836967493eb390802e0e54979d9a0d158
```

### Required URL Parameters

| Parameter            | Type   | Description                            | Example                            |
| -------------------- | ------ | -------------------------------------- | ---------------------------------- |
| `brand`              | string | Brand identifier for the application   | `Priority Pass-app`                    |
| `currency`           | string | ISO 4217 currency code                 | `EUR`, `USD`, `GBP`                |
| `locale`             | string | Language/locale code                   | `en`, `es`, `de`                   |
| `uuid_booking`       | string | Unique identifier for the booking      | `24623c33bdea6e13d5930e4959d7305e` |
| `uuid_booking_group` | string | Group identifier for multiple bookings | `50fb30ea84434a53ae9a89453a4048e5` |
| `hmac`               | string | HMAC signature for security validation | `3ed423eb62adf9ad...`              |

### Optional URL Parameters

| Parameter                 | Type   | Description                 | Example                 |
| ------------------------- | ------ | --------------------------- | ----------------------- |
| `header`                  | string | Show/hide header            | `on`, `off`             |
| `request_id`              | string | Priority Pass request UUID      | `abc123...`             |
| `source`                  | string | Traffic source              | `web`, `ios`, `android` |
| `utm_source`              | string | UTM tracking source         | `google`, `email`       |
| `utm_medium`              | string | UTM tracking medium         | `cpc`, `organic`        |
| `utm_affiliate_device_id` | string | Affiliate device identifier | `device-123`            |

### HMAC Signature

The `hmac` parameter is a SHA-256 HMAC signature used for security. It is generated server-side and validates that the URL parameters haven't been tampered with. **You cannot generate this client-side** - it comes from the `validation_params` returned by the verification API.

---

## Complete Flow Examples

### Flow 1: New User - SMS Verification to Payment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE BOOKING FLOW (SMS)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. USER SELECTS Priority Pass                                                  │
│     └── GET /availability/{airport_code}                                    │
│         Response: Available Priority Pass options with pricing                  │
│                                                                             │
│  2. CREATE TRIP                                                             │
│     └── POST /trip                                                          │
│         Body: { requests: [{ itinerary, booking, Priority Pass, ... }] }        │
│         Response: { uuid: "trip-uuid", requests: [{ uuid, hmac, ... }] }    │
│                                                                             │
│  3. GET AUTH TOKEN (for accessing request details)                          │
│     └── POST {AUTH_URL}/authentication/token/                               │
│         Body: { url: "?request_uuid={uuid}&brand=Priority Pass-app&hmac={hmac}" }│
│         Response: { token: "jwt-token" }                                    │
│                                                                             │
│  4. SEND SMS VERIFICATION                                                   │
│     └── POST {VERIFY_URL}/phone/verify-member-phone                         │
│         Body: { number: "612345678", prefix: "+34" }                        │
│         Response: { verificationSessionId: "session-123", status: "OTP_SENT" }│
│                                                                             │
│  5. USER ENTERS 4-DIGIT PIN                                                 │
│     └── POST {VERIFY_URL}/phone/verify-otp                                  │
│         Query: { verification_session_id, otp: "1234", request_id }         │
│         Response: {                                                         │
│           status: "SUCCESSFULLY_VERIFIED",                                  │
│           data: {                                                           │
│             validation_params: [                                            │
│               { key: "brand", value: "Priority Pass-app" },                     │
│               { key: "currency", value: "EUR" },                            │
│               { key: "locale", value: "en" },                               │
│               { key: "uuid_booking", value: "..." },                        │
│               { key: "uuid_booking_group", value: "..." },                  │
│               { key: "hmac", value: "..." }                                 │
│             ]                                                               │
│           }                                                                 │
│         }                                                                   │
│                                                                             │
│  6. REDIRECT TO PAYMENT PAGE                                                │
│     └── Navigate to: /payment/view?brand=...&currency=...&uuid_booking=... │
│                                                                             │
│  7. PAYMENT PAGE AUTHENTICATION                                             │
│     └── POST {AUTH_URL}/authentication/token/                               │
│         Body: { url: window.location.href }  // Full URL with all params    │
│         Response: { token: "payment-jwt-token" }                            │
│                                                                             │
│  8. VALIDATE PAYMENT DATA                                                   │
│     └── POST {PAYMENT_PAY_URL}/payment/group/validate                       │
│         Headers: { X-PNF-Token: "payment-jwt-token" }                       │
│         Body: { url: window.location.href }                                 │
│         Response: {                                                         │
│           booking_group: [...],                                             │
│           brand: { uuid, name, stripe_public_key },                         │
│           display_config: { show_payment_summary, show_coupon, ... }        │
│         }                                                                   │
│                                                                             │
│  9. PROCESS STRIPE PAYMENT                                                  │
│     └── (See Stripe Integration section below)                              │
│                                                                             │
│  10. PAYMENT CONFIRMATION                                                   │
│      └── POST {PAYMENT_PAY_URL}/1.0/stripe/payment/                         │
│          OR POST {PAYMENT_PAY_URL}/1.0/stripe/payment/confirm/              │
│                                                                             │
│  11. REDIRECT TO PASS PAGE                                                  │
│      └── Navigate to: /{request_uuid}/pass                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Email Verification to Payment

```typescript
// Step 1: Send email verification
const emailResponse = await fetch(`${VERIFY_URL}/email/verify-member-email`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com" }),
});
const { verificationSessionId } = await emailResponse.json();

// Step 2: Verify OTP (user enters 4-digit code)
const verifyResponse = await fetch(
  `${VERIFY_URL}/email/verify-otp?verification_session_id=${verificationSessionId}&otp=1234&request_id=${requestUuid}`,
  { method: "POST" }
);
const { data } = await verifyResponse.json();

// Step 3: Build payment URL from validation_params
const params = new URLSearchParams();
data.validation_params.forEach(({ key, value }) => params.set(key, value));
window.location.href = `/payment/view?${params.toString()}`;
```

---

## Stripe Integration

### Prerequisites

1. **Stripe Public Key**: Obtain from your Stripe dashboard or from the payment validation response (`brand.stripe_public_key`)
2. **Stripe.js**: Load the Stripe library

```html
<script src="https://js.stripe.com/v3/"></script>
```

### Initialize Stripe

```typescript
import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Use your Stripe public key
const STRIPE_PUBLIC_KEY = "pk_test_51J8NOEHDSleR5f1z...";
const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
```

### Payment Methods

#### 1. Credit Card Payment

```typescript
// Create payment method from card element
const { paymentMethod, error } = await stripe.createPaymentMethod({
  type: "card",
  card: cardElement, // Stripe card element
});

if (error) {
  console.error("Payment method creation failed:", error);
  return;
}

// Send to backend for processing
const paymentResponse = await fetch(`${PAYMENT_PAY_URL}/1.0/stripe/payment/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-PNF-Token": token, // From authentication
  },
  body: JSON.stringify({
    email: "user@example.com",
    name: "John Doe",
    currency: "eur",
    amount: 4999, // Amount in cents
    ext_uuid_stripe_payment_method: paymentMethod.id,
    uuid_payment_method: uuidPaymentMethod, // From validate response
    uuid_backoffice_brand: brandUuid, // From validate response
    uuid_booking: bookingUuid, // From URL params
    uuid_booking_group: bookingGroupUuid, // From URL params
  }),
});
```

#### 2. Express Checkout (Apple Pay / Google Pay)

```typescript
// Create confirmation token for Express Checkout
const { confirmationToken, error } = await stripe.createConfirmationToken({
  elements, // Stripe Elements instance
  params: {
    payment_method_data: {
      billing_details: event.billingDetails,
    },
    return_url: "https://your-return-url.com",
  },
});

// Send to backend
const paymentResponse = await fetch(`${PAYMENT_PAY_URL}/1.0/stripe/payment/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-PNF-Token": token,
  },
  body: JSON.stringify({
    email: event.billingDetails?.email,
    name: event.billingDetails?.name,
    phone_number: event.billingDetails?.phone,
    currency: "eur",
    amount: 4999,
    ext_stripe_confirmation_token: confirmationToken.id,
    wallet_pay_type: event.expressPaymentType, // 'apple_pay' or 'google_pay'
    uuid_payment_method: uuidPaymentMethod,
    uuid_backoffice_brand: brandUuid,
    uuid_booking: bookingUuid,
    uuid_booking_group: bookingGroupUuid,
  }),
});
```

### Handle Payment Response

```typescript
interface PaymentResponse {
  data: {
    client_secret: string;
    ext_uuid_payment_intent: string;
    requires_action: boolean;
  };
  stripe_status: "succeeded" | "requires_action" | "error";
  uuid_request?: string;
}

const result: PaymentResponse = await paymentResponse.json();

switch (result.stripe_status) {
  case "succeeded":
    // Payment complete - redirect to pass page
    window.location.href = `/${result.uuid_request}/pass`;
    break;

  case "requires_action":
    // 3D Secure or additional authentication required
    const { error, paymentIntent } = await stripe.handleCardAction(
      result.data.client_secret
    );

    if (error) {
      console.error("Authentication failed:", error);
      return;
    }

    // Confirm payment after 3DS
    await fetch(`${PAYMENT_PAY_URL}/1.0/stripe/payment/confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PNF-Token": token,
      },
      body: JSON.stringify({
        ext_uuid_payment_intent: paymentIntent.id,
      }),
    });
    break;

  case "error":
    console.error("Payment failed");
    break;
}
```

---

## Typical Flow Summary

### Single Trip (Departure Only)

1. `GET /availability/{airport}` - Get Priority Pass options
2. `POST /trip` - Create trip with departure flight
3. `POST /authentication/token/` - Get auth token
4. `POST /{method}/verify-member-{method}` - Send verification code
5. `POST /{method}/verify-otp` - Verify PIN and get payment params
6. Navigate to `/payment/view?{params}`
7. `POST /authentication/token/` - Get payment auth token
8. `POST /payment/group/validate` - Load payment data
9. `POST /1.0/stripe/payment/` - Process Stripe payment
10. `GET /trip/{uuid}` - Retrieve booking confirmation

### Round Trip (Departure + Return)

1. `POST /trip` - Create trip with departure flight
2. `PATCH /trip/{tripUuid}/add-requests` - Add return flight
3. Follow steps 3-10 from Single Trip flow
4. `GET /trip/{uuid}/booking-status` - Get complete booking details
5. `POST /trip/{uuid}/invoice` (Optional) - Generate invoice

### With Wallet Payment (Apple Pay / Google Pay)

1. `POST /trip` - Create trip
2. `PATCH /request/{reqId}/add-wallet-pay` - Initiate wallet payment
3. User authorizes via Apple Pay/Google Pay
4. `PATCH /request/{reqId}/confirm-wallet-pay` - Confirm payment
5. `GET /trip/{uuid}` - Get confirmation

---

## Authentication Headers

Two authentication methods are used:

### 1. `authToken` (Bearer Token)

Used for trip management, request operations, and some payment operations.

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### 2. `X-PNF-Token`

Used for payment validation and booking operations.

```typescript
headers: {
  'X-PNF-Token': token,
  'Content-Type': 'application/json'
}
```

---

## Important Notes

1. **Source Field**: All trip requests automatically include a `source` field (`web`, `ios`, `android`) based on the platform.

2. **Member UUID**: Optional field for logged-in users to associate trips with their account.

3. **Trip UUID Persistence**: After creating a trip, the `tripUuid` is stored and reused when adding return flights.

4. **Currency Handling**: Each Priority Pass request includes both local and selected currency pricing.

5. **Request IDs**: Each Priority Pass request in a trip has a unique `requestId` used for payment and tracking.

6. **HMAC Security**: The `hmac` parameter in URLs is generated server-side and cannot be created client-side. Always use the values from `validation_params`.

7. **Token Storage**: Store tokens in sessionStorage for the duration of the booking session.

---

## Implementation Files (Nuxt/Vue Reference)

- **API Definitions**: [`api/domains/trip/`](api/domains/trip/), [`api/domains/payment/`](api/domains/payment/), [`api/domains/verify/`](api/domains/verify/)
- **Type Definitions**: [`api/domains/trip/trip.types.ts`](api/domains/trip/trip.types.ts), [`api/domains/payment/payment.types.ts`](api/domains/payment/payment.types.ts), [`api/domains/verify/verify.types.ts`](api/domains/verify/verify.types.ts)
- **Business Logic**: [`composables/useManageTrip.ts`](composables/useManageTrip.ts), [`composables/useGetToken.ts`](composables/useGetToken.ts)
- **State Management**: [`stores/useBookingStore.ts`](stores/useBookingStore.ts), [`stores/usePaymentStore.ts`](stores/usePaymentStore.ts), [`stores/useVerifyStore.ts`](stores/useVerifyStore.ts)
- **Stripe Integration**: [`composables/stripe/`](composables/stripe/)

---

## Example: Complete Svelte/React Implementation

```typescript
// ====== API CLIENT SETUP ======

const API_CONFIG = {
  development: {
    apiBaseUrl: "https://api.development.Priority Pass.flights/api/v1.2",
    apiAuthUrl: "https://authentication.development.ticketapp.com/1.0",
    verifyUrl: "https://verify-api.development.Priority Pass.flights",
    paymentPayUrl: "https://pay.development.Priority Pass.flights",
  },
};

const config = API_CONFIG.development;

// ====== STEP 1: GET AVAILABILITY ======
async function getAvailability(airportCode: string) {
  const response = await fetch(
    `${config.apiBaseUrl}/availability/${airportCode}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
}

// ====== STEP 2: CREATE TRIP ======
async function createTrip(tripData: TripRequest) {
  const response = await fetch(`${config.apiBaseUrl}/trip`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });
  return response.json();
}

// ====== STEP 3: GET AUTH TOKEN ======
async function getAuthToken(requestUuid: string, hmac: string, brand: string) {
  const url = `?request_uuid=${requestUuid}&brand=${brand}&hmac=${hmac}`;
  const response = await fetch(`${config.apiAuthUrl}/authentication/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return response.json();
}

// ====== STEP 4: SEND VERIFICATION ======
async function sendPhoneVerification(number: string, prefix: string) {
  const response = await fetch(
    `${config.verifyUrl}/phone/verify-member-phone`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, prefix }),
    }
  );
  return response.json();
}

async function sendEmailVerification(email: string) {
  const response = await fetch(
    `${config.verifyUrl}/email/verify-member-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );
  return response.json();
}

// ====== STEP 5: VERIFY OTP ======
async function verifyOtp(
  method: "phone" | "email",
  verificationSessionId: string,
  otp: string,
  requestId: string
) {
  const params = new URLSearchParams({
    verification_session_id: verificationSessionId,
    otp,
    request_id: requestId,
  });

  const response = await fetch(
    `${config.verifyUrl}/${method}/verify-otp?${params}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.json();
}

// ====== STEP 6: BUILD PAYMENT URL ======
function buildPaymentUrl(
  validationParams: Array<{ key: string; value: string }>
) {
  const params = new URLSearchParams();
  validationParams.forEach(({ key, value }) => params.set(key, value));
  return `/payment/view?${params.toString()}`;
}

// ====== STEP 7: VALIDATE PAYMENT ======
async function validatePayment(token: string, fullUrl: string) {
  const response = await fetch(
    `${config.paymentPayUrl}/payment/group/validate`,
    {
      method: "POST",
      headers: {
        "X-PNF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: fullUrl }),
    }
  );
  return response.json();
}

// ====== STEP 8: PROCESS STRIPE PAYMENT ======
async function processStripePayment(
  token: string,
  paymentParams: CreatePaymentParams
) {
  const response = await fetch(`${config.paymentPayUrl}/1.0/stripe/payment/`, {
    method: "POST",
    headers: {
      "X-PNF-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentParams),
  });
  return response.json();
}

// ====== COMPLETE FLOW EXAMPLE ======
async function completeBookingFlow() {
  // 1. Get availability
  const availability = await getAvailability("BCN");
  const selectedPriority Pass = availability.data.Priority Passs[0];

  // 2. Create trip
  const tripResponse = await createTrip({
    requests: [
      {
        itinerary: {
          departure_airport: { iata: "BCN" },
          arrival_airport: { iata: "MAD" },
        },
        booking: {
          number_of_passengers: 1,
          currency: { code: "EUR" },
          local_price: selectedPriority Pass.pricing.local.amount,
        },
        Priority Pass: {
          uuid: selectedPriority Pass.uuid,
          provider: { uuid: selectedPriority Pass.provider.uuid },
        },
        departure_date: "2025-01-15T10:00:00Z",
        source: "web",
      },
    ],
  });

  const { uuid: requestUuid, hmac } = tripResponse.data.requests[0];

  // 3. Get auth token
  const { token } = await getAuthToken(requestUuid, hmac, "Priority Pass-app");
  sessionStorage.setItem("token", token);

  // 4. Send verification (phone example)
  const { verificationSessionId } = await sendPhoneVerification(
    "612345678",
    "+34"
  );

  // 5. Verify OTP (user enters PIN)
  const userEnteredPin = "1234"; // From user input
  const verifyResult = await verifyOtp(
    "phone",
    verificationSessionId,
    userEnteredPin,
    requestUuid
  );

  // 6. Redirect to payment page
  const paymentUrl = buildPaymentUrl(verifyResult.data.validation_params);
  window.location.href = paymentUrl;
}
```

---

## Error Handling

### Common Error Responses

```typescript
// Verification errors
{
  message: "Invalid OTP",
  status: "ERROR"
}

// Authentication errors
{
  error: "Invalid or expired token"
}

// Payment errors
{
  payment_error: {
    code: "card_declined",
    message: "Your card was declined"
  }
}
```

### Handling Verification Retry

```typescript
// If OTP is wrong, user can retry
if (verifyResult.status !== "SUCCESSFULLY_VERIFIED") {
  // Show error message
  // User can enter PIN again
}

// Resend OTP if needed
async function resendOtp(
  method: "phone" | "email",
  verificationSessionId: string
) {
  const response = await fetch(
    `${config.verifyUrl}/${method}/resend-otp?verification_session_id=${verificationSessionId}`,
    { method: "PUT" }
  );
  return response.json();
}
```
