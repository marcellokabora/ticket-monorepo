<script lang="ts">
  import "@ticketapp/ui";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { TicketData } from "@ticketapp/api";
  import { booking, resetBooking } from "$lib/state/booking.svelte";
  import type { PageData } from "./$types";

  // Get data from load function
  let { data }: { data: PageData } = $props();

  // Page state
  let error = $state<string | null>(null);
  let showCancelDialog = $state(false);

  // Build ticket data from store
  const ticketData = $derived(() => {
    // Check if we have minimum required data
    if (!booking.departureAirport || !booking.transactionId) {
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
      transactionId: booking.transactionId,
      contact: booking.verifiedContact,
      paymentMethod: booking.paymentMethod,
      bookedAt: booking.bookedAt || new Date(),
    } satisfies TicketData;
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

  // Format phone number with country code highlighting
  function formatPhoneNumber(phoneValue: string): {
    countryCode: string;
    number: string;
  } {
    // Simple formatting - assumes format like +49 171 202 0841 or +491712020841
    const cleaned = phoneValue.replace(/\s/g, "");
    if (cleaned.startsWith("+")) {
      const countryCode = cleaned.substring(0, 3); // +49, +44, etc.
      const number = cleaned.substring(3);
      return { countryCode, number };
    }
    return { countryCode: "", number: phoneValue };
  }

  function handleActivatePass() {
    // Navigate to activation flow
    goto("/booking/activation");
  }

  function handleAddReturnFlight() {
    // Navigate back to booking with return flight addition
    const tripId = $page.url.searchParams.get("tripId");
    const tripParam = tripId
      ? `?tripId=${tripId}&addReturn=true`
      : "?addReturn=true";
    goto(`/booking${tripParam}`);
  }

  function handleResendLink() {
    // Resend confirmation link
    alert("Link resent to your contact method");
  }

  function handleCancelTicket() {
    showCancelDialog = true;
  }

  function confirmCancelTicket() {
    // Handle ticket cancellation
    alert("Ticket cancellation - to be implemented");
    showCancelDialog = false;
  }

  function handleNewBooking() {
    resetBooking();
    goto("/booking");
  }

  function handleRetryPayment() {
    const tripId = $page.url.searchParams.get("tripId");
    const tripParam = tripId ? `?tripId=${tripId}` : "";
    goto(`/booking/payment${tripParam}`);
  }
</script>

<div class="min-h-screen bg-primary-800 flex flex-col">
  <!-- Header with centered logo -->
  <header
    class="bg-primary-800 h-17 flex items-center justify-center shrink-0 text-white"
  >
    <a href="/booking" class="w-32 h-4" aria-label="Return to booking">
      <lit-logo variant="light" size="large"></lit-logo>
    </a>
  </header>

  <!-- Main Content -->
  <main class="flex-1">
    <div class="max-w-sm mx-auto px-5">
      {#if error}
        <!-- Error State -->
        <lit-bite-card background="light" bite-color="primary-800">
          <div
            class="bg-secondary-20 flex flex-col items-center py-12 px-5 gap-6 rounded-b-2xl"
          >
            <div
              class="w-16 h-16 rounded-full bg-system-alert/10 flex items-center justify-center"
            >
              <lit-icon
                icon="mdi:alert-circle"
                size="32"
                class="text-system-alert"
              ></lit-icon>
            </div>
            <div class="text-center">
              <h1 class="text-xl font-bold text-neutral-black mb-2">
                Something went wrong
              </h1>
              <p class="text-base text-secondary-300">{error}</p>
            </div>
            <div class="flex flex-col gap-3 w-full mt-4">
              <lit-button
                variant="primary"
                class="w-full"
                onbutton-click={handleRetryPayment}
              >
                <span>Try Again</span>
              </lit-button>
              <lit-button
                variant="secondary"
                class="w-full"
                onbutton-click={handleNewBooking}
              >
                <span>Start New Booking</span>
              </lit-button>
            </div>
          </div>
        </lit-bite-card>
      {:else if ticketData()}
        {@const data = ticketData()}
        {@const phone = data.contact
          ? formatPhoneNumber(data.contact.value)
          : null}

        <!-- Bite Card Container -->
        <lit-bite-card background="light" bite-color="primary-800">
          <!-- Order Summary Section -->
          <div class="bg-secondary-20 pt-8 pb-8 px-5">
            <div class="flex flex-col gap-1">
              <div class="flex items-start justify-between">
                <p class="text-lg font-semibold text-neutral-black flex-1">
                  {data.departureAirport.name}
                </p>
                <p class="text-lg text-primary-700 font-normal">
                  {data.departureAirport.iata}
                </p>
              </div>
              <p class="text-base text-neutral-black">
                {data.passengerCount} passenger{data.passengerCount > 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          <!-- QR Code Section with Shadow -->
          <div
            class="bg-secondary-20 flex flex-col items-center pb-6.5 pt-0 px-0"
          >
            <div
              class="flex flex-col h-16 items-center justify-center -mb-6.5 shrink-0 w-full"
            >
              <img
                src="/booking/assets/qr-code-placeholder.svg"
                alt="QR Code"
                class="h-16 w-[132px] block"
              />
            </div>
            <div class="flex h-6.5 items-center -mb-6.5 shrink-0 w-full">
              <div class="flex flex-1 items-center min-h-px min-w-px">
                <div
                  class="flex flex-1 items-center justify-center min-h-px min-w-px"
                >
                  <div class="flex-none rotate-180 w-full">
                    <div
                      class="bg-gradient-to-b from-secondary-80 h-6.5 opacity-60 to-transparent w-full"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Body Section -->
          <div
            class="bg-secondary-20 flex flex-col gap-5 items-center justify-center pb-8 pt-9 px-5 rounded-b-2xl"
          >
            <!-- Phone Number Container -->
            <div
              class="w-full border border-secondary-200 rounded-2xl px-4 py-4"
            >
              <div class="flex flex-col gap-2 items-center text-center">
                <p class="text-base text-neutral-black leading-5">
                  Pass has been sent to:
                </p>
                {#if phone}
                  <p class="text-base font-semibold leading-7">
                    <span class="text-primary-500">{phone.countryCode}</span>
                    <span class="text-neutral-black">{phone.number}</span>
                  </p>
                {:else}
                  <p
                    class="text-base font-semibold text-neutral-black leading-7"
                  >
                    Your contact method
                  </p>
                {/if}
              </div>
            </div>

            <!-- Airport Requirements Message -->
            <div class="w-full">
              <p class="text-base text-neutral-black text-center leading-7">
                {data.departureAirport.iata} airport requires flight details<br
                />
                to use this pass.
              </p>
            </div>

            <!-- Activate Pass Button -->
            <lit-button
              variant="primary"
              size="medium"
              class="w-full"
              onbutton-click={handleActivatePass}
            >
              <span>Activate pass</span>
            </lit-button>

            <!-- Add Return Flight Button (only show if no return flight) -->
            {#if !data.addReturnFlight}
              <lit-button
                variant="secondary"
                size="medium"
                class="w-full"
                onbutton-click={handleAddReturnFlight}
              >
                <span>Add return flight</span>
              </lit-button>
            {/if}
          </div>
        </lit-bite-card>

        <!-- Bottom CTA Section -->
        <div class="flex flex-col gap-5 items-center justify-center px-4 py-9">
          <!-- Resend Link Button -->
          <lit-button
            variant="secondary"
            size="small"
            class="w-full text-white"
            onbutton-click={handleResendLink}
          >
            <span>Resend the link</span>
          </lit-button>

          <!-- Cancel Priority Pass Button -->
          <lit-button
            variant="default"
            size="small"
            class="w-full text-white"
            onbutton-click={handleCancelTicket}
          >
            <span>Cancel Priority Pass</span>
          </lit-button>
        </div>
      {:else}
        <!-- No data state -->
        <lit-bite-card background="light" bite-color="primary-800">
          <div
            class="bg-secondary-20 flex flex-col items-center py-12 px-5 gap-6 rounded-b-2xl"
          >
            <div
              class="w-16 h-16 rounded-full bg-secondary-80 flex items-center justify-center"
            >
              <lit-icon
                icon="mdi:ticket-outline"
                size="32"
                class="text-secondary-300"
              ></lit-icon>
            </div>
            <div class="text-center">
              <h1 class="text-xl font-bold text-neutral-black mb-2">
                No Ticket Found
              </h1>
              <p class="text-base text-secondary-300">
                We couldn't find your booking information.
              </p>
            </div>
            <lit-button
              variant="primary"
              class="w-full mt-4"
              onbutton-click={handleNewBooking}
            >
              <span>Start New Booking</span>
            </lit-button>
          </div>
        </lit-bite-card>
      {/if}
    </div>
  </main>
</div>

<!-- Cancel Confirmation Dialog -->
{#if showCancelDialog}
  <lit-dialog
    open={showCancelDialog}
    onclose={() => (showCancelDialog = false)}
  >
    <div class="flex flex-col gap-6 p-6">
      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-bold text-neutral-black">Cancel Priority Pass?</h2>
        <p class="text-base text-secondary-300">
          Are you sure you want to cancel your Priority Pass booking? This action
          cannot be undone.
        </p>
      </div>
      <div class="flex flex-col gap-3 w-full">
        <lit-button
          variant="primary"
          size="medium"
          class="w-full"
          onbutton-click={confirmCancelTicket}
        >
          <span>Yes, Cancel Booking</span>
        </lit-button>
        <lit-button
          variant="secondary"
          size="medium"
          class="w-full"
          onbutton-click={() => (showCancelDialog = false)}
        >
          <span>Keep Booking</span>
        </lit-button>
      </div>
    </div>
  </lit-dialog>
{/if}
