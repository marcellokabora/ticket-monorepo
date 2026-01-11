<script lang="ts">
  import type { RestrictedAirline } from "@ticketapp/api";

  // Props
  let {
    airlines,
    selectedAirline = null,
    onSelect,
    onNotListed,
    airportName,
    isLoading = false,
  }: {
    airlines: RestrictedAirline[];
    selectedAirline?: RestrictedAirline | null;
    onSelect?: (airline: RestrictedAirline) => void;
    onNotListed?: () => void;
    airportName?: string;
    isLoading?: boolean;
  } = $props();

  // Internal state
  let searchQuery = $state("");

  // Filter airlines based on search query
  const filteredAirlines = $derived.by(() => {
    if (!searchQuery.trim()) {
      return airlines;
    }

    const query = searchQuery.toLowerCase().trim();
    return airlines.filter(
      (airline) =>
        airline.name.toLowerCase().includes(query) ||
        airline.iata.toLowerCase().includes(query) ||
        airline.icao?.toLowerCase().includes(query)
    );
  });

  function handleSearchInput(e: Event) {
    searchQuery = (e.target as HTMLInputElement).value;
  }

  function handleAirlineSelect(airline: RestrictedAirline) {
    onSelect?.(airline);
  }

  function handleNotListed() {
    onNotListed?.();
  }

  /**
   * Get airline logo URL from IATA code
   * Uses a public CDN service that provides airline logos
   */
  function getAirlineLogo(iataCode: string): string {
    return `https://images.kiwi.com/airlines/64/${iataCode}.png`;
  }

  /**
   * Highlight matching text by wrapping it with underline styling
   */
  function highlightText(text: string, query: string): string {
    if (!query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query.trim()})`, "gi");
    return text.replace(regex, '<span class="underline">$1</span>');
  }

  /**
   * Handle image load error - show IATA code as fallback
   */
  function handleImageError(e: Event, iataCode: string) {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    if (target.parentElement) {
      target.parentElement.innerHTML = `<span class="text-[10px] font-semibold text-secondary-500">${iataCode}</span>`;
    }
  }
</script>

<div class="flex flex-col w-full min-h-[60vh]">
  <!-- Info Banner -->
  <div class="px-5 pb-4 pt-0 bg-secondary-20">
    <div class="flex items-center gap-3 p-4 bg-secondary-40 rounded-xl">
      <lit-icon
        icon="mdi:information-outline"
        size="24"
        class="text-secondary-500 shrink-0"
      ></lit-icon>
      <p class="text-sm text-secondary-500">
        {#if airportName}
          Fast Track at {airportName} airport is available only for passengers flying
          with selected airlines.
        {:else}
          Fast Track at this airport is available only for passengers flying
          with selected airlines.
        {/if}
      </p>
    </div>
  </div>

  <!-- Search Input (only show if more than 8 airlines) -->
  {#if airlines.length > 8}
    <div
      class="sticky top-0 z-10 bg-secondary-20 border-b border-secondary-100"
    >
      <lit-search-input
        size="medium"
        placeholder="Search airline"
        value={searchQuery}
        oninput={handleSearchInput}
        onclear={() => (searchQuery = "")}
        class="p-5 pt-0"
      ></lit-search-input>
    </div>
  {/if}

  <!-- Loading state -->
  {#if isLoading}
    <div
      class="flex flex-col items-center justify-center py-12 bg-secondary-20"
    >
      <lit-icon
        icon="mdi:loading"
        size="32"
        class="text-secondary-300 animate-spin"
      ></lit-icon>
      <p class="mt-3 text-sm text-secondary-300">Loading airlines...</p>
    </div>
  {:else if filteredAirlines.length === 0 && searchQuery.trim()}
    <!-- No results from search -->
    <div
      class="flex flex-col items-center justify-center py-12 bg-secondary-20"
    >
      <p
        class="text-sm font-medium text-secondary-200 text-center tracking-widest uppercase"
      >
        No airline found
      </p>
    </div>
  {:else}
    <!-- Airline List -->
    <div class="flex flex-col bg-secondary-20">
      <!-- Section Header -->
      <div
        class="flex items-center justify-center h-9 px-5 py-2.5 bg-secondary-40"
      >
        <p
          class="flex-1 text-sm font-normal text-secondary-500 text-center uppercase tracking-widest leading-4"
        >
          Airlines
        </p>
      </div>

      <!-- Airline List -->
      <div class="flex flex-col pl-6">
        {#each filteredAirlines as airline}
          <button
            class="flex h-13 items-center pr-4 border-b border-secondary-80 w-full cursor-pointer hover:border-secondary-200 transition-colors"
            onclick={() => handleAirlineSelect(airline)}
          >
            <div class="flex flex-1 items-center gap-4 min-w-0">
              <!-- Airline Logo -->
              <div
                class="size-6 rounded bg-white overflow-hidden shrink-0 flex items-center justify-center"
              >
                <img
                  src={getAirlineLogo(airline.iata)}
                  alt={airline.name}
                  class="w-full h-full object-cover"
                  onerror={(e) => handleImageError(e, airline.iata)}
                />
              </div>

              <!-- Airline Name -->
              <p
                class="flex-1 text-base font-normal text-neutral-black text-left truncate"
              >
                {@html highlightText(airline.name, searchQuery)}
              </p>

              <!-- IATA Code -->
              <p
                class="text-base font-normal text-neutral-300 text-right shrink-0"
              >
                {@html highlightText(airline.iata, searchQuery)}
              </p>
            </div>

            <!-- Check Icon for selected airline -->
            {#if selectedAirline?.iata === airline.iata}
              <lit-icon icon="mdi:check" size="24" class="text-primary-500 ml-2"
              ></lit-icon>
            {/if}
          </button>
        {/each}

        <!-- My airline is not listed option -->
        {#if onNotListed}
          <button
            class="flex h-13 items-center pr-4 border-b border-secondary-80 w-full cursor-pointer hover:border-secondary-200 transition-colors"
            onclick={handleNotListed}
          >
            <p
              class="flex-1 text-base font-normal text-neutral-black text-left"
            >
              My airline is not listed
            </p>
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
