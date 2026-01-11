<script lang="ts">
  import "../app.css";
  import "@ticketapp/ui";
  import { onMount, untrack } from "svelte";
  import { replaceState, afterNavigate } from "$app/navigation";
  import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
  import LoaderPlane from "$lib/components/LoaderPlane.svelte";
  import { getCurrencies, searchAirports } from "@ticketapp/api";
  import {
    fetchAirportAvailability,
    fetchAirportAirlineAvailability,
  } from "@ticketapp/utils";
  import { loadTripByUuid } from "$lib/stores/bookingStore";
  // Shared booking state module - no context needed!
  import { booking, resetBooking } from "$lib/state/booking.svelte";

  let { children } = $props();

  // Internal state management
  let initialLoadComplete = $state(false);
  let isLoadingFromURL = $state(false);
  let routerReady = $state(false);

  // Wait for router to be ready
  afterNavigate(() => {
    routerReady = true;
  });

  // Load state from URL parameters on mount
  onMount(async () => {
    isLoadingFromURL = true;
    booking.loadErrors = {}; // Reset errors

    const params = new URLSearchParams(window.location.search);

    // Load trip from URL parameter (for post-payment recovery)
    const tripParam = params.get("trip");
    if (tripParam) {
      try {
        const tripFromApi = await loadTripByUuid(tripParam);
        if (tripFromApi) {
          console.log("✅ Restored trip from API:", tripFromApi.uuid);
          booking.tripUuid = tripFromApi.uuid;

          // Restore request IDs and airports from trip data
          if (tripFromApi.requests.length > 0) {
            const firstRequest = tripFromApi.requests[0];
            booking.departureRequestId = firstRequest.uuid;

            // Search for the departure airport by IATA
            try {
              const airports = await searchAirports(
                firstRequest.itinerary.departure_airport.iata,
                1
              );
              if (airports.length > 0) {
                booking.departureAirport = airports[0];
                booking.departurePrice = firstRequest.booking.local_price;
              }
            } catch (err) {
              console.error("Failed to load departure airport from trip:", err);
            }

            // Check for return flight (second request)
            if (tripFromApi.requests.length > 1) {
              const secondRequest = tripFromApi.requests[1];
              booking.returnRequestId = secondRequest.uuid;
              booking.addReturnFlight = true;

              try {
                const airports = await searchAirports(
                  secondRequest.itinerary.departure_airport.iata,
                  1
                );
                if (airports.length > 0) {
                  booking.returnAirport = airports[0];
                  booking.returnPrice = secondRequest.booking.local_price;
                }
              } catch (err) {
                console.error("Failed to load return airport from trip:", err);
              }
            }

            // Restore currency and passengers from first request
            // Note: API v1.2 returns empty booking object, so these fields may not exist
            if (
              firstRequest.booking.number_of_passengers &&
              firstRequest.booking.currency?.code
            ) {
              booking.passengerCount =
                firstRequest.booking.number_of_passengers;
              const currencyCode = firstRequest.booking.currency.code;
              if (currencyCode !== booking.selectedCurrency.code) {
                try {
                  const currencies = await getCurrencies();
                  const foundCurrency = currencies.find(
                    (c) => c.code === currencyCode
                  );
                  if (foundCurrency) {
                    booking.selectedCurrency = foundCurrency;
                  }
                } catch (err) {
                  console.error("Failed to load currency from trip:", err);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load trip from API:", err);
        booking.loadErrors.departure = "Failed to load trip";
      }
    }

    // Load currency from URL
    const currencyParam = params.get("currency");
    if (currencyParam) {
      try {
        const currencies = await getCurrencies();
        const foundCurrency = currencies.find(
          (c) => c.code.toUpperCase() === currencyParam.toUpperCase()
        );
        if (foundCurrency) {
          booking.selectedCurrency = foundCurrency;
        } else {
          booking.loadErrors.currency = `Currency '${currencyParam}' not found`;
        }
      } catch (err) {
        booking.loadErrors.currency = "Failed to load currencies";
      }
    }

    // Load passengers from URL
    const passengersParam = params.get("passengers");
    if (passengersParam) {
      const passengers = parseInt(passengersParam, 10);
      if (!isNaN(passengers) && passengers >= 1 && passengers <= 9) {
        booking.passengerCount = passengers;
      }
    }

    // Load promo code from URL
    const promoParam = params.get("promo");
    if (promoParam) {
      booking.appliedPromoCode = promoParam;
    }

    // Load return flight flag from URL
    const returnParam = params.get("return");
    if (returnParam) {
      booking.addReturnFlight = true;
    }

    // Load departure airport from URL
    const departureParam = params.get("departure");
    const departureAirlineParam = params.get("departureAirline");

    if (departureParam) {
      try {
        const airports = await searchAirports(departureParam, 1);
        if (airports.length > 0) {
          booking.departureAirport = airports[0];

          // Load departure airline if present
          if (departureAirlineParam) {
            const parts = departureAirlineParam.split("|");
            const iata = parts[0];
            const name = parts[1] || iata;
            if (iata) {
              booking.departureAirline = {
                iata,
                name,
              };
            }
          }

          // Fetch pricing (airline-aware)
          try {
            if (booking.departureAirline) {
              const result = await fetchAirportAirlineAvailability(
                airports[0].iata,
                booking.departureAirline.iata,
                booking.selectedCurrency.code
              );
              booking.departurePrice = result.price;
              booking.departureTicketappUuid = result.ticketappUuid;
            } else {
              const result = await fetchAirportAvailability(
                airports[0].iata,
                booking.selectedCurrency.code
              );
              booking.departurePrice = result.price;
              booking.departureTicketappUuid = result.ticketappUuid;
            }
          } catch (err) {
            console.error("Failed to fetch departure pricing:", err);
            booking.departurePrice = 0;
          }
        } else {
          booking.loadErrors.departure = `Airport '${departureParam}' not found`;
        }
      } catch (err) {
        booking.loadErrors.departure = "Failed to load departure airport";
      }
    }

    // Load return airport from URL
    const returnAirlineParam = params.get("returnAirline");

    if (returnParam && booking.addReturnFlight) {
      try {
        const airports = await searchAirports(returnParam, 1);
        if (airports.length > 0) {
          booking.returnAirport = airports[0];

          // Load return airline if present
          if (returnAirlineParam) {
            const parts = returnAirlineParam.split("|");
            const iata = parts[0];
            const name = parts[1] || iata;
            if (iata) {
              booking.returnAirline = {
                iata,
                name,
              };
            }
          }

          // Fetch pricing (airline-aware)
          try {
            if (booking.returnAirline) {
              const result = await fetchAirportAirlineAvailability(
                airports[0].iata,
                booking.returnAirline.iata,
                booking.selectedCurrency.code
              );
              booking.returnPrice = result.price;
              booking.returnTicketappUuid = result.ticketappUuid;
            } else {
              const result = await fetchAirportAvailability(
                airports[0].iata,
                booking.selectedCurrency.code
              );
              booking.returnPrice = result.price;
              booking.returnTicketappUuid = result.ticketappUuid;
            }
          } catch (err) {
            console.error("Failed to fetch return pricing:", err);
            booking.returnPrice = 0;
          }
        } else {
          booking.loadErrors.return = `Airport '${returnParam}' not found`;
        }
      } catch (err) {
        booking.loadErrors.return = "Failed to load return airport";
      }
    }

    isLoadingFromURL = false;
    initialLoadComplete = true;
  });

  // Update URL when booking state changes - only sync trip UUID
  $effect(() => {
    const tripUuid = booking.tripUuid;

    // Use untrack to prevent reactivity loops with control flags
    if (
      untrack(
        () =>
          typeof window !== "undefined" &&
          routerReady &&
          initialLoadComplete &&
          !isLoadingFromURL
      )
    ) {
      const params = new URLSearchParams();

      // After login, only include trip UUID - all data is stored in the API
      if (tripUuid) {
        params.set("trip", tripUuid);
      }

      // Build URL with query string only if trip UUID exists
      const queryString = params.toString();
      const newURL = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      replaceState(newURL, {});
    }
  });
</script>

<!-- Theme switcher renders first to apply saved theme before loader shows -->
<ThemeSwitcher />

{#if !initialLoadComplete}
  <div class="flex items-center justify-center min-h-screen bg-primary-800">
    <div class="flex flex-col items-center gap-4">
      <LoaderPlane size={80} />
      <p class="text-neutral-white text-lg">Loading</p>
    </div>
  </div>
{:else}
  {@render children()}
{/if}
