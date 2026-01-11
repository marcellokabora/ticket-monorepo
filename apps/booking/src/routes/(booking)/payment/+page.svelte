<script lang="ts">
  import "@ticketapp/ui";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import Toast from "$lib/components/Toast.svelte";
  import AlternativePaymentButtons from "$lib/components/AlternativePaymentButtons.svelte";
  import type { BookingData, PaymentMethod } from "@ticketapp/api";
  import { searchAirports, getCurrencies } from "@ticketapp/api";
  import {
    getStripe,
    type Stripe,
    type StripeElements,
  } from "$lib/stripe/client";
  import { loadTripByUuid, saveBookingToTrip } from "$lib/stores/bookingStore";
  import { booking, saveBookingState } from "$lib/state/booking.svelte";

  // Payment state
  let paymentError = $state<string | null>(null);
  let isProcessing = $state(false);
  let isLoadingTrip = $state(false);
  let showToast = $state(false);

  // Stripe Elements state
  let stripe = $state<Stripe | null>(null);
  let elements = $state<StripeElements | null>(null);
  let cardNumberElement = $state<any>(null);
  let cardExpiryElement = $state<any>(null);
  let cardCvcElement = $state<any>(null);
  let elementsReady = $state(false);

  // Card validation state
  let cardNumberValid = $state(false);
  let cardExpiryValid = $state(false);
  let cardCvcValid = $state(false);

  const isCardFormValid = $derived(
    cardNumberValid && cardExpiryValid && cardCvcValid
  );

  // Auto-dismiss toast after 5 seconds
  $effect(() => {
    if (paymentError) {
      showToast = true;
      const timer = setTimeout(() => {
        showToast = false;
        setTimeout(() => {
          paymentError = null;
        }, 300); // Clear error after fade out animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  // Load trip from URL and initialize Stripe Elements
  onMount(async () => {
    const tripUuid = page.url.searchParams.get("tripId");

    // If we have airports but no pricing, fetch the pricing
    // Check for 0, NaN, or undefined prices
    if (
      booking.departureAirport &&
      (!booking.departurePrice ||
        isNaN(booking.departurePrice) ||
        (booking.addReturnFlight &&
          booking.returnAirport &&
          (!booking.returnPrice || isNaN(booking.returnPrice))))
    ) {
      isLoadingTrip = true;

      try {
        const { fetchAirportAvailability } = await import("@ticketapp/utils");

        if (
          booking.departureAirport &&
          (!booking.departurePrice || isNaN(booking.departurePrice))
        ) {
          const deptResult = await fetchAirportAvailability(
            booking.departureAirport.iata,
            booking.selectedCurrency.code
          );
          booking.departurePrice = deptResult.price;
          booking.departureTicketappUuid = deptResult.ticketappUuid;
        }

        if (
          booking.addReturnFlight &&
          booking.returnAirport &&
          (!booking.returnPrice || isNaN(booking.returnPrice))
        ) {
          const retResult = await fetchAirportAvailability(
            booking.returnAirport.iata,
            booking.selectedCurrency.code
          );
          booking.returnPrice = retResult.price;
          booking.returnTicketappUuid = retResult.ticketappUuid;
        }
      } catch (err) {
        console.error("Failed to fetch pricing:", err);
        paymentError = "Failed to load pricing";
      } finally {
        isLoadingTrip = false;
      }
    }
    // Try to restore from Trip API if we have a trip UUID but no booking data
    else if (tripUuid && !booking.departureAirport) {
      isLoadingTrip = true;
      console.log("📥 Loading trip from API:", tripUuid);

      try {
        const trip = await loadTripByUuid(tripUuid);

        if (trip && trip.requests.length > 0) {
          console.log("✅ Restored trip from API:", trip.uuid);
          booking.tripUuid = trip.uuid;

          const firstRequest = trip.requests[0];
          booking.departureRequestId = firstRequest.uuid;

          // Note: API v1.2 returns empty booking object, so we need to fetch pricing separately
          // For now, passenger count defaults to 1 if not in booking data
          booking.passengerCount =
            firstRequest.booking.number_of_passengers || 1;

          // Load departure airport details
          const airports = await searchAirports(
            firstRequest.itinerary.departure_airport.iata,
            1
          );
          if (airports.length > 0) {
            booking.departureAirport = airports[0];
          }

          // Restore currency if available
          if (firstRequest.booking.currency?.code) {
            const currencyCode = firstRequest.booking.currency.code;
            if (currencyCode !== booking.selectedCurrency?.code) {
              try {
                const currencies = await getCurrencies();
                const foundCurrency = currencies.find(
                  (c) => c.code === currencyCode
                );
                if (foundCurrency) {
                  booking.selectedCurrency = foundCurrency;
                }
              } catch (err) {
                console.warn("Could not load currency, using default");
              }
            }
          }

          // Check for return flight
          if (trip.requests.length > 1) {
            const returnRequest = trip.requests[1];
            booking.returnRequestId = returnRequest.uuid;
            booking.addReturnFlight = true;

            const returnAirports = await searchAirports(
              returnRequest.itinerary.departure_airport.iata,
              1
            );
            if (returnAirports.length > 0) {
              booking.returnAirport = returnAirports[0];
            }
          }

          // Fetch current pricing for the airports
          // (since booking object doesn't contain pricing in API v1.2)
          if (booking.departureAirport) {
            try {
              const { fetchAirportAvailability } = await import(
                "@ticketapp/utils"
              );
              const result = await fetchAirportAvailability(
                booking.departureAirport.iata,
                booking.selectedCurrency.code
              );
              booking.departurePrice = result.price;
              booking.departureTicketappUuid = result.ticketappUuid;
            } catch (err) {
              console.error("Failed to fetch departure pricing:", err);
            }
          }

          if (booking.returnAirport) {
            try {
              const { fetchAirportAvailability } = await import(
                "@ticketapp/utils"
              );
              const result = await fetchAirportAvailability(
                booking.returnAirport.iata,
                booking.selectedCurrency.code
              );
              booking.returnPrice = result.price;
              booking.returnTicketappUuid = result.ticketappUuid;
            } catch (err) {
              console.error("Failed to fetch return pricing:", err);
            }
          }
        } else {
          console.warn("⚠️ No trip found, redirecting to booking");
          goto("/booking");
          return;
        }
      } catch (error) {
        console.error("❌ Failed to load trip:", error);
        paymentError = "Failed to load booking information";
      } finally {
        isLoadingTrip = false;
      }
    }

    // Initialize Stripe
    stripe = await getStripe();

    if (stripe) {
      elements = stripe.elements();

      // Styling for all elements
      const elementStyles = {
        base: {
          fontSize: "16px",
          color: "#001f3d",
          fontFamily: "Lato, sans-serif",
          "::placeholder": {
            color: "#94b4d4",
          },
          iconColor: "#698daf",
        },
        invalid: {
          color: "#eb5757",
          iconColor: "#eb5757",
        },
      };

      // Create separate elements for card number, expiry, and CVC
      cardNumberElement = elements.create("cardNumber", {
        style: elementStyles,
        showIcon: true,
      });

      cardExpiryElement = elements.create("cardExpiry", {
        style: elementStyles,
      });

      cardCvcElement = elements.create("cardCvc", {
        style: elementStyles,
      });

      // Add change listeners to track validation state
      cardNumberElement.on("change", (event: any) => {
        cardNumberValid = event.complete && !event.error;
      });

      cardExpiryElement.on("change", (event: any) => {
        cardExpiryValid = event.complete && !event.error;
      });

      cardCvcElement.on("change", (event: any) => {
        cardCvcValid = event.complete && !event.error;
      });

      elementsReady = true;
    }
  });

  // Mount elements when form becomes visible
  $effect(() => {
    if (elementsReady && cardNumberElement && !cardNumberElement._parent) {
      const cardNumberContainer = document.getElementById(
        "card-number-element"
      );
      const cardExpiryContainer = document.getElementById(
        "card-expiry-element"
      );
      const cardCvcContainer = document.getElementById("card-cvc-element");

      if (cardNumberContainer && cardExpiryContainer && cardCvcContainer) {
        cardNumberElement.mount("#card-number-element");
        cardExpiryElement.mount("#card-expiry-element");
        cardCvcElement.mount("#card-cvc-element");
      }
    }
  });

  // Redirect if required data is missing
  // onMount(() => {
  //   if (!booking.departureAirport || !booking.verifiedContact) {
  //     const currentParams = new URLSearchParams(window.location.search);
  //     const queryString = currentParams.toString();
  //     const url = queryString ? `/booking?${queryString}` : "/booking";
  //     goto(url);
  //   }
  // });

  // Build booking data for payment page
  const bookingData = $derived(() => {
    if (!booking.departureAirport) {
      return null;
    }

    return {
      departureAirport: booking.departureAirport,
      returnAirport: booking.returnAirport ?? undefined,
      addReturnFlight: booking.addReturnFlight,
      passengerCount: booking.passengerCount,
      departurePrice: booking.departurePrice,
      returnPrice: booking.returnPrice,
      totalPrice: calculateTotalPrice(),
      currency: booking.selectedCurrency,
      promoCode: booking.appliedPromoCode ?? undefined,
    } satisfies BookingData;
  });

  function calculateTotalPrice(): number {
    const outboundTotal = booking.departurePrice * booking.passengerCount;
    const returnTotal = booking.addReturnFlight
      ? booking.returnPrice * booking.passengerCount
      : 0;
    const total = outboundTotal + returnTotal;
    return round(booking.appliedPromoCode ? total * 0.9 : total, 2);
  }

  function round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  // Calculate fees (mock - 2 EUR fixed for now)
  const taxesAndFees = 2.0;

  // Calculate discount (5 EUR if promo code exists)
  const discount = $derived(() => (bookingData()?.promoCode ? 5.0 : 0));

  const totalWithFees = $derived(() => {
    const data = bookingData();
    return data ? data.totalPrice + taxesAndFees - discount() : 0;
  });

  // Format price
  function formatPrice(price: number): string {
    return price.toFixed(2);
  }

  // Payment method handlers
  async function handleCreditCard() {
    const data = bookingData();
    if (!data) return;

    // Process payment with card element
    if (!stripe || !cardNumberElement) {
      paymentError = "Stripe is not initialized. Please refresh the page.";
      return;
    }

    if (isProcessing) return;

    isProcessing = true;
    paymentError = null;

    try {
      // Mock payment success - generate a mock transaction ID
      const mockTransactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("💳 Mock payment processed:", mockTransactionId);
      console.log("📦 Current booking state before payment:");
      console.log("   Departure:", booking.departureAirport?.name);
      console.log("   Passengers:", booking.passengerCount);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Payment successful
      handlePaymentSuccess(mockTransactionId, "credit_card");
    } catch (error) {
      console.error("Payment error:", error);
      paymentError =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      isProcessing = false;
    }
  }

  function handlePaymentError(error: string) {
    paymentError = error;
  }

  function handlePaymentSuccess(
    transactionId: string,
    paymentMethod: PaymentMethod
  ) {
    // Store transaction data in context for ticket page
    booking.transactionId = transactionId;
    booking.paymentMethod = paymentMethod;
    booking.bookedAt = new Date();

    // Save booking state to sessionStorage before navigation
    saveBookingState();

    // Navigate to ticket page with trip UUID
    const currentParams = new URLSearchParams(window.location.search);

    // Ensure trip UUID is in the URL
    if (booking.tripUuid && !currentParams.has("trip")) {
      currentParams.set("trip", booking.tripUuid);
    }

    const queryString = currentParams.toString();
    const url = queryString
      ? `/booking/confirmation?${queryString}`
      : "/booking/confirmation";
    goto(url);
  }

  function dismissToast() {
    showToast = false;
    setTimeout(() => {
      paymentError = null;
    }, 300); // Clear error after fade out animation
  }
</script>

<Toast message={paymentError} show={showToast} onDismiss={dismissToast} />

{#if isLoadingTrip}
  <!-- Loading state while restoring trip from API -->
  <div class="flex flex-col items-center justify-center min-h-96 p-8">
    <div class="flex flex-col items-center gap-4">
      <div class="animate-pulse">
        <lit-icon
          icon="mdi:loading"
          size="32"
          class="text-primary-500 animate-spin"
        ></lit-icon>
      </div>
      <p class="text-base text-secondary-300 text-center">
        Loading booking information...
      </p>
    </div>
  </div>
{:else if bookingData()}
  {@const data = bookingData()}
  <!-- Payment Page Card Content -->
  <div class="bg-secondary-20 flex flex-col pt-9">
    <!-- Order Summary -->
    <div class="px-5 pt-2 pb-6">
      <div class="flex flex-col gap-1">
        <div class="flex items-start justify-between gap-2">
          <p class="text-lg font-semibold text-neutral-black flex-1">
            {data.departureAirport.name}
          </p>
          <p class="text-lg font-normal text-primary-700">
            {data.departureAirport.iata}
          </p>
        </div>
        {#if data.addReturnFlight && data.returnAirport}
          <div class="flex items-start justify-between gap-2">
            <p class="text-lg font-semibold text-neutral-black flex-1">
              {data.returnAirport.name}
            </p>
            <p class="text-lg font-normal text-primary-700">
              {data.returnAirport.iata}
            </p>
          </div>
        {/if}
        <p class="text-base font-normal text-neutral-black">
          {data.passengerCount} passenger{data.passengerCount > 1 ? "s" : ""}
        </p>
      </div>
    </div>

    <!-- QR separator shadow -->
    <div class="flex items-center h-3.75 w-full">
      <div class="flex-1 flex items-center justify-center">
        <div class="w-full rotate-180">
          <div
            class="h-6.5 w-full opacity-60 bg-linear-to-b from-secondary-80 to-transparent"
          ></div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="px-5 py-8">
      <div class="flex flex-col gap-6">
        <!-- Line Items -->
        <div class="flex flex-col gap-3 px-3">
          <!-- Priority Pass items -->
          <div class="flex items-start justify-between text-sm">
            <p class="flex-1 text-secondary-300">
              {data.passengerCount} x Priority Pass {data.departureAirport.iata}
            </p>
            <p class="font-bold text-neutral-black text-right">
              {formatPrice(data.departurePrice * data.passengerCount)}
              {data.currency.code}
            </p>
          </div>

          {#if data.addReturnFlight && data.returnAirport}
            <div class="flex items-start justify-between text-sm">
              <p class="flex-1 text-secondary-300">
                {data.passengerCount} x Priority Pass {data.returnAirport.iata}
              </p>
              <p class="font-bold text-neutral-black text-right">
                {formatPrice(data.returnPrice * data.passengerCount)}
                {data.currency.code}
              </p>
            </div>
          {/if}

          <!-- Taxes and fees -->
          <div class="flex items-start justify-between text-sm">
            <p class="flex-1 text-secondary-300">Taxes, services and fees</p>
            <p class="font-bold text-neutral-black text-right">
              {formatPrice(taxesAndFees)}
              {data.currency.code}
            </p>
          </div>

          {#if data.promoCode}
            <!-- Promo code discount -->
            <div class="flex gap-0.5 items-center w-full">
              <div class="flex-1 flex gap-0.5 items-center min-w-0">
                <p class="text-sm text-secondary-300">
                  Coupon: {data.promoCode}
                </p>
                <!-- <lit-icon icon="mdi:close" color="#C80000" size="18"></lit-icon> -->
              </div>
              <p class="text-sm font-bold text-primary-500 text-right">
                -{formatPrice(discount())}
                {data.currency.code}
              </p>
            </div>
          {/if}
        </div>

        <!-- Total Box -->
        <div
          class="flex items-center justify-between px-3 py-2 border border-secondary-200 rounded-lg"
        >
          <p class="flex-1 font-bold text-base text-secondary-300">Total</p>
          <p class="font-bold text-base text-neutral-black text-right">
            {formatPrice(totalWithFees())}
            {data.currency.code}
          </p>
        </div>
      </div>
    </div>

    <!-- Shadow divider (inverted) -->
    <div class="flex items-center justify-center w-full rotate-180">
      <div class="w-full h-6 flex items-center">
        <div class="flex-1">
          <div class="w-full rotate-180">
            <div
              class="h-6.5 w-full opacity-60 bg-linear-to-b from-secondary-80 to-transparent"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Section -->
    <div class="px-4 py-5 pt-0">
      <!-- Credit Card Details Header -->
      <div class="flex items-center gap-4 w-full pb-6 pt-2">
        <div class="flex-1 h-px bg-secondary-200"></div>
        <p
          class="text-xs font-semibold text-secondary-300 text-center uppercase tracking-wider"
        >
          Credit card details
        </p>
        <div class="flex-1 h-px bg-secondary-200"></div>
      </div>

      <!-- Card Form (Stripe Elements) -->
      <div class="flex flex-col gap-5 w-full">
        <!-- Card Number -->
        <div
          id="card-number-element"
          class="px-4 py-3.5 border border-secondary-200 rounded-lg bg-neutral-white h-13"
        ></div>

        <!-- Expiry Date and CVV in a row -->
        <div class="flex gap-5 w-full">
          <!-- Expiry Date -->
          <div
            id="card-expiry-element"
            class="flex-1 px-4 py-3.5 border border-secondary-200 rounded-lg bg-neutral-white h-13"
          ></div>

          <!-- CVV -->
          <div
            id="card-cvc-element"
            class="flex-1 px-4 py-3.5 border border-secondary-200 rounded-lg bg-neutral-white h-13"
          ></div>
        </div>
      </div>

      <!-- Pay Button -->
      <lit-button
        class="w-full mt-6"
        variant="primary"
        loading={isProcessing}
        disabled={isProcessing || !isCardFormValid}
        onbutton-click={handleCreditCard}
      >
        <span>Pay {formatPrice(totalWithFees())} {data.currency.code}</span>
      </lit-button>

      <!-- Other Payment Methods Header -->
      <div class="flex items-center gap-4 w-full py-6">
        <div class="flex-1 h-px bg-secondary-200"></div>
        <p
          class="text-xs font-semibold text-secondary-300 text-center uppercase tracking-wider"
        >
          Other payment methods
        </p>
        <div class="flex-1 h-px bg-secondary-200"></div>
      </div>

      <!-- Instant Checkout Buttons (3 in a row) -->
      <AlternativePaymentButtons
        disabled={isProcessing}
        amount={Math.round(totalWithFees() * 100)}
        onError={handlePaymentError}
      />

      <!-- Powered by Stripe -->
      <div class="flex items-center justify-center gap-1 pt-6 pb-2">
        <p class="text-[13px] font-normal text-secondary-300">Powered by</p>
        <div class="h-4.5 w-10.75 overflow-clip">
          <img
            src="/booking/assets/payment-logos/stripe-logo.svg"
            alt="Stripe"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  </div>
{/if}
