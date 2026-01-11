<script lang="ts">
  import { page } from "$app/state";
  import CurrencyList from "$lib/components/CurrencyList.svelte";
  import { getCurrencies, type Currency } from "@ticketapp/api";
  import { onMount } from "svelte";
  import { booking } from "$lib/state/booking.svelte";

  let { children } = $props();

  let drawerOpen = $state(false);
  let currencies: Currency[] = $state([]);
  let currenciesLoading = $state(true);
  let currenciesError: string | null = $state(null);

  // Check if we're on payment page
  const isPaymentPage = $derived(page.url.pathname.includes("/payment"));

  function openDrawer() {
    drawerOpen = true;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  function selectCurrency(currency: Currency) {
    booking.selectedCurrency = currency;
    closeDrawer();
  }

  function handleBackToBooking() {
    window.history.back();
  }

  onMount(async () => {
    try {
      const result = await getCurrencies();
      currencies = result;
    } catch (err: unknown) {
      console.error("Error fetching currencies:", err);
      if (err instanceof Error) {
        currenciesError = `Error: ${err.message}`;
      } else {
        currenciesError = "Failed to fetch currencies";
      }
    } finally {
      currenciesLoading = false;
    }
  });
</script>

<div class="min-h-screen bg-primary-800 flex flex-col">
  <!-- Header -->
  <header class="bg-primary-800 px-5 py-3 shrink-0 text-white relative z-10">
    <div class="max-w-sm mx-auto">
      <div class="flex items-center justify-between relative">
        <!-- Back Button (only on payment page) -->
        {#if isPaymentPage}
          <div class="flex-1 flex justify-start">
            <button
              class="w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-0"
              onclick={handleBackToBooking}
              aria-label="Go back"
            >
              <lit-icon icon="mdi:chevron-left" size="24" class="text-white"
              ></lit-icon>
            </button>
          </div>
        {:else}
          <div class="flex-1"></div>
        {/if}

        <!-- Centered Logo -->
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <a href="/booking" aria-label="Go to booking page">
            <lit-logo variant="light" size="large"></lit-logo>
          </a>
        </div>

        <!-- Currency Button -->
        <div class="flex-1 flex justify-end">
          <lit-button
            variant="secondary"
            size="small"
            onbutton-click={openDrawer}
          >
            <span class="font-semibold text-lg -m-1 ml-auto"
              >{booking.selectedCurrency.symbol}</span
            >
            <lit-icon icon="mdi:chevron-down"></lit-icon>
          </lit-button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 px-5 pb-8 pt-0">
    <div class="max-w-sm mx-auto">
      <!-- Bite Card Container -->
      <lit-bite-card background="light" bite-color="primary-800">
        {@render children()}
      </lit-bite-card>
    </div>
  </main>
</div>

<!-- Currency Drawer -->
<lit-drawer open={drawerOpen} ondrawer-close={closeDrawer}>
  <span slot="header">Set currency</span>
  <div slot="body">
    <CurrencyList
      {currencies}
      loading={currenciesLoading}
      error={currenciesError}
      selectedCurrency={booking.selectedCurrency}
      onSelect={selectCurrency}
    />
  </div>
</lit-drawer>
