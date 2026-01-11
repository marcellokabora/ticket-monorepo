<script lang="ts">
  import {
    createCheckoutSession,
    redirectToCheckout,
  } from "$lib/stripe/client";
  import { booking, saveBookingState } from "$lib/state/booking.svelte";
  import { saveBookingToTrip } from "$lib/stores/bookingStore";
  import { buildBookingURL } from "$lib/state/url-sync";

  interface Props {
    disabled?: boolean;
    amount: number;
    onError?: (error: string) => void;
  }

  let { disabled = false, amount, onError }: Props = $props();
  let isProcessing = $state(false);

  async function handleCheckout(
    paymentMethod: "paypal" | "apple_pay" | "google_pay"
  ) {
    try {
      isProcessing = true;

      // Validate required booking data
      if (!booking.departureAirport) {
        throw new Error("Please select a departure airport");
      }

      // Generate mock transaction ID
      const mockTransactionId = `mock_${paymentMethod}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store transaction data
      booking.transactionId = mockTransactionId;
      booking.paymentMethod = paymentMethod;
      booking.bookedAt = new Date();

      console.log(
        `💳 Mock ${paymentMethod} payment processed:`,
        mockTransactionId
      );
      console.log("📦 Current booking state before save:");
      console.log("   Departure:", booking.departureAirport?.name);
      console.log("   Passengers:", booking.passengerCount);
      console.log("   Transaction:", booking.transactionId);

      // Save booking state to sessionStorage before navigation
      saveBookingState();

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Navigate directly to confirmation page
      const params = new URLSearchParams();
      if (booking.tripUuid) {
        params.set("tripId", booking.tripUuid);
      }
      params.set("session_id", mockTransactionId);
      params.set("payment_method", paymentMethod);

      const confirmationUrl = `/booking/confirmation?${params.toString()}`;
      window.location.href = confirmationUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process payment";

      if (onError) {
        onError(errorMessage);
      }

      isProcessing = false;
    }
  }

  async function handlePayPal() {
    await handleCheckout("paypal");
  }

  async function handleApplePay() {
    await handleCheckout("apple_pay");
  }

  async function handleGooglePay() {
    await handleCheckout("google_pay");
  }
</script>

<!-- Instant Checkout Buttons (3 in a row) -->
<div class="flex gap-2 w-full">
  <!-- PayPal Button -->
  <button
    type="button"
    class="flex-1 h-13 bg-[#0070ba] rounded-full flex items-center justify-center px-5 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    disabled={disabled || isProcessing}
    aria-label="Pay with PayPal"
    onclick={handlePayPal}
  >
    <img
      src="/booking/assets/payment-logos/paypal-logo.svg"
      alt="PayPal"
      class="h-4 w-14"
    />
  </button>

  <!-- Apple Pay Button -->
  <button
    type="button"
    class="flex-1 h-13 bg-black rounded-full flex items-center justify-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    disabled={disabled || isProcessing}
    aria-label="Pay with Apple Pay"
    onclick={handleApplePay}
  >
    <img
      src="/booking/assets/payment-logos/apple-pay-logo.svg"
      alt="Apple Pay"
      class="h-5 w-12.5"
    />
  </button>

  <!-- Google Pay Button -->
  <button
    type="button"
    class="flex-1 h-13 bg-black rounded-full flex items-center justify-center px-4 py-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    disabled={disabled || isProcessing}
    aria-label="Pay with Google Pay"
    onclick={handleGooglePay}
  >
    <img
      src="/booking/assets/payment-logos/google-pay-logo.svg"
      alt="Google Pay"
      class="h-5 w-13"
    />
  </button>
</div>
