<script lang="ts">
  import {
    searchAirports,
    getPopularAirports,
    getNearestAirports,
    ApiError,
    type Airport,
  } from "@ticketapp/api";

  // Props - only selection related, all fetching/filtering is internal
  let {
    selectedAirport,
    onSelect,
    showNearby = true,
  }: {
    selectedAirport?: Airport | null;
    onSelect?: (airport: Airport) => void;
    showNearby?: boolean;
  } = $props();

  // Internal state
  let searchQuery = $state("");
  let airports = $state<Airport[]>([]);
  let popularAirports = $state<Airport[]>([]);
  let nearbyAirports = $state<Airport[]>([]);
  let loading = $state(false);
  let searchError = $state<string | null>(null);
  let popularError = $state<string | null>(null);
  let geoError = $state<string | null>(null);
  let userPosition = $state<{ lat: number; lng: number } | null>(null);
  let geoLoading = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Constants
  const DEBOUNCE_MS = 300;
  const MIN_SEARCH_LENGTH = 2;

  /**
   * Request user's geolocation and fetch nearby airports from API
   */
  async function handleGeolocation() {
    if (!navigator.geolocation) {
      geoError = "Geolocation is not supported by your browser";
      return;
    }

    geoLoading = true;
    geoError = null;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // Cache for 5 minutes
          });
        }
      );

      userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Fetch nearest airports from API
      nearbyAirports = await getNearestAirports(
        userPosition.lat,
        userPosition.lng,
        5
      );
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            geoError = "Location permission denied";
            break;
          case err.POSITION_UNAVAILABLE:
            geoError = "Location information unavailable";
            break;
          case err.TIMEOUT:
            geoError = "Location request timed out";
            break;
        }
      } else if (err instanceof ApiError) {
        geoError = `Failed to get nearby airports: ${err.message}`;
      } else {
        geoError = "Failed to get nearby airports";
      }
    } finally {
      geoLoading = false;
    }
  }

  /**
   * Perform search with debouncing
   */
  async function performSearch(query: string) {
    if (!query.trim() || query.trim().length < MIN_SEARCH_LENGTH) {
      airports = [];
      return;
    }

    loading = true;
    searchError = null;

    try {
      airports = await searchAirports(query, 20);
    } catch (err) {
      console.error("Error searching airports:", err);
      if (err instanceof ApiError) {
        searchError = `API Error ${err.statusCode}: ${err.message}`;
      } else if (err instanceof Error) {
        searchError = `Error: ${err.message}`;
      } else {
        searchError = "Failed to search airports";
      }
    } finally {
      loading = false;
    }
  }

  /**
   * Load popular airports on mount
   */
  async function loadPopularAirports() {
    loading = true;
    popularError = null;

    try {
      popularAirports = await getPopularAirports();
    } catch (err) {
      console.error("Error fetching popular airports:", err);
      if (err instanceof ApiError) {
        popularError = `API Error ${err.statusCode}: ${err.message}`;
      } else if (err instanceof Error) {
        popularError = `Error: ${err.message}`;
      } else {
        popularError = "Failed to fetch popular airports";
      }
    } finally {
      loading = false;
    }
  }

  // Debounced search effect
  $effect(() => {
    const query = searchQuery;

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!query.trim()) {
      airports = [];
      loading = false;
      return;
    }

    if (query.trim().length < MIN_SEARCH_LENGTH) {
      airports = [];
      loading = false;
      return;
    }

    // Set loading state immediately when user types enough characters
    loading = true;

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  });

  // Load popular airports on mount
  $effect(() => {
    loadPopularAirports();
  });

  // Load nearby airports on mount if geolocation is available
  $effect(() => {
    if (showNearby && navigator.geolocation) {
      handleGeolocation();
    }
  });

  // Computed sections based on search state
  const sections = $derived.by(() => {
    // If searching, show search results only
    if (searchQuery.trim()) {
      if (airports.length > 0) {
        return [
          {
            title: "Search results",
            airports: airports,
          },
        ];
      }
      // If searching but no results (and no error), return empty
      return [];
    }

    // If no search, show nearby (if available) and popular
    const result: { title: string; airports: Airport[] }[] = [];

    if (showNearby && nearbyAirports.length > 0) {
      result.push({
        title: "Nearby airports",
        airports: nearbyAirports,
      });
    }

    if (popularAirports.length > 0) {
      result.push({
        title: "Most popular",
        airports: popularAirports,
      });
    }

    return result;
  });

  function handleSearchInput(e: Event) {
    searchQuery = (e.target as HTMLInputElement).value;
  }

  function handleAirportSelect(airport: Airport) {
    onSelect?.(airport);
  }

  /**
   * Highlight matching text by wrapping it with underline styling
   * @param text - The text to search within
   * @param query - The search query to highlight
   * @returns HTML string with matches underlined
   */
  function highlightText(text: string, query: string): string {
    if (!query.trim() || query.trim().length < MIN_SEARCH_LENGTH) {
      return text;
    }

    const regex = new RegExp(`(${query.trim()})`, "gi");
    return text.replace(regex, '<span class="underline">$1</span>');
  }
</script>

{#snippet statusMessage(message: string)}
  <div class="flex flex-col bg-secondary-20">
    <div class="flex flex-col h-25 items-start justify-center w-full">
      <p
        class="text-sm font-medium text-secondary-200 text-center tracking-[2px] uppercase w-full"
      >
        {message}
      </p>
    </div>
  </div>
{/snippet}

<div class="flex flex-col w-full min-h-[80vh]">
  <!-- Search Input -->
  <div class="sticky top-0 z-10 bg-secondary-20 border-b border-secondary-100">
    <lit-search-input
      size="medium"
      placeholder="Type city, airport or IATA code"
      value={searchQuery}
      oninput={handleSearchInput}
      onclear={() => (searchQuery = "")}
      class="p-5 pt-0"
    ></lit-search-input>
  </div>

  <!-- Show nearby airports button -->
  {#if showNearby && !searchQuery.trim() && nearbyAirports.length === 0}
    <button
      class="flex gap-4 items-center px-5 py-4 bg-secondary-20 border-t border-secondary-80 w-full cursor-pointer"
      onclick={handleGeolocation}
      disabled={geoLoading}
    >
      <div
        class="flex items-center justify-center size-11 bg-neutral-black rounded-full shrink-0"
      >
        {#if geoLoading}
          <lit-icon icon="mdi:loading" size="24" class="text-white animate-spin"
          ></lit-icon>
        {:else}
          <lit-icon icon="mdi:crosshairs-gps" size="24" class="text-white"
          ></lit-icon>
        {/if}
      </div>
      <p class="flex-1 text-base font-normal text-neutral-black text-left">
        {geoLoading ? "Finding your location..." : "Show nearby airports"}
      </p>
    </button>

    <!-- Geolocation Error message -->
    <!-- {#if geoError}
      <div
        class="flex items-center gap-2 px-5 py-3 bg-secondary-20 text-system-alert border-l-4 border-system-alert"
      >
        <lit-icon icon="mdi:alert-circle" size="20"></lit-icon>
        <p class="text-sm">{geoError}</p>
      </div>
    {/if} -->
  {/if}

  <!-- Search Error message -->
  {#if searchError}
    <div
      class="flex items-center gap-2 px-5 py-3 bg-secondary-20 text-system-alert border-l-4 border-system-alert"
    >
      <lit-icon icon="mdi:alert-circle" size="20"></lit-icon>
      <p class="text-sm">{searchError}</p>
    </div>
  {/if}

  <!-- Status messages -->
  {#if searchQuery.trim() && searchQuery.trim().length < MIN_SEARCH_LENGTH}
    {@render statusMessage("Type at least two characters")}
  {:else if loading && searchQuery.trim().length >= MIN_SEARCH_LENGTH}
    {@render statusMessage("Searching...")}
  {:else if searchQuery.trim() && !loading && airports.length === 0 && !searchError && searchQuery.trim().length >= MIN_SEARCH_LENGTH}
    {@render statusMessage("No airport found")}
  {/if}

  <!-- Airport List Sections -->
  {#each sections as section}
    <div class="flex flex-col bg-secondary-20">
      <!-- Section Header -->
      <div
        class="flex items-center justify-center h-9 px-5 py-2.5 bg-secondary-40"
      >
        <p
          class="flex-1 text-sm font-normal text-secondary-500 text-center uppercase tracking-wider leading-4"
        >
          {section.title}
        </p>
      </div>

      <!-- Airport List -->
      <div class="flex flex-col pl-6">
        {#each section.airports as airport}
          <button
            class="flex gap-2 h-15 items-center pr-5 border-b border-secondary-80 w-full cursor-pointer {airport.iata ===
            selectedAirport?.iata
              ? 'bg-secondary-30'
              : ''}"
            onclick={() => handleAirportSelect(airport)}
          >
            <div class="flex flex-1 items-center justify-between min-w-0">
              <!-- Airport Name and Country -->
              <div
                class="flex-1 flex flex-col gap-1 items-start justify-center min-w-0 pr-2"
              >
                <p
                  class="text-base font-bold text-neutral-black leading-5 text-left truncate"
                >
                  {@html highlightText(
                    airport.display_name || airport.name,
                    searchQuery
                  )}
                </p>
                <p
                  class="text-sm font-normal text-secondary-300 leading-normal truncate"
                >
                  {airport.city_region_country}
                </p>
              </div>

              <!-- IATA Code -->
              <div class="flex items-center justify-end shrink-0">
                <p class="text-base font-normal text-secondary-500 text-right">
                  {@html highlightText(airport.iata, searchQuery)}
                </p>
              </div>
            </div>

            <!-- Check Icon for selected airport -->
            {#if selectedAirport?.iata === airport.iata}
              <lit-icon icon="mdi:check" size="24" class="text-primary-500"
              ></lit-icon>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
