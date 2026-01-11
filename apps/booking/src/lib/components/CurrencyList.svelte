<script lang="ts">
  import type { Currency } from "@ticketapp/api";

  interface Props {
    currencies: Currency[];
    loading: boolean;
    error: string | null;
    selectedCurrency?: Currency | null;
    onSelect: (currency: Currency) => void;
  }

  let {
    currencies,
    loading,
    error,
    selectedCurrency = null,
    onSelect,
  }: Props = $props();

  let searchQuery = $state("");

  // Map currency codes to country codes for flag icons
  const currencyToCountry: Record<string, string> = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    AUD: "au",
    BGN: "bg",
    CAD: "ca",
    CLP: "cl",
    DKK: "dk",
    EGP: "eg",
  };

  // Popular currencies list
  const popularCurrencyCodes = ["USD", "EUR", "GBP"];

  // Filter currencies based on search query
  function filterCurrencies(
    currencyList: Currency[],
    query: string
  ): Currency[] {
    if (!query.trim()) return currencyList;

    const lowerQuery = query.toLowerCase();
    return currencyList.filter(
      (c) =>
        c.code.toLowerCase().includes(lowerQuery) ||
        c.name?.toLowerCase().includes(lowerQuery) ||
        c.symbol?.toLowerCase().includes(lowerQuery)
    );
  }

  const sections = $derived.by(() => {
    if (!currencies || currencies.length === 0) return [];

    const filteredCurrencies = filterCurrencies(currencies, searchQuery);

    const popularCurrencies = filteredCurrencies.filter((c) =>
      popularCurrencyCodes.includes(c.code)
    );

    // Only show sections that have results
    return [
      ...(popularCurrencies.length > 0
        ? [{ title: "Most popular", currencies: popularCurrencies }]
        : []),
      ...(filteredCurrencies.length > 0
        ? [{ title: "All currencies", currencies: filteredCurrencies }]
        : []),
    ];
  });

  function getCountryCode(currencyCode: string): string {
    return (
      currencyToCountry[currencyCode] || currencyCode.toLowerCase().slice(0, 2)
    );
  }

  function isSelected(currency: Currency): boolean {
    return selectedCurrency?.code === currency.code;
  }

  function handleSearchChange(e: Event) {
    searchQuery = (e.target as HTMLInputElement).value;
  }
</script>

<div class="flex flex-col w-full">
  {#if loading}
    <p class="text-gray-500 text-center py-4">Loading currencies...</p>
  {:else if error}
    <p class="text-red-500 text-center py-4">{error}</p>
  {:else if !currencies || currencies.length === 0}
    <p class="text-gray-500 text-center py-4">No currencies found</p>
  {:else}
    <!-- Search Input -->
    <div
      class="px-5 pb-4 sticky top-0 z-10 bg-secondary-20 border-b border-secondary-100"
    >
      <lit-search-input
        size="medium"
        placeholder="Search currencies..."
        value={searchQuery}
        oninput={handleSearchChange}
      ></lit-search-input>
    </div>
    {#if sections.length === 0}
      <p class="text-gray-500 text-center py-4">
        No currencies match your search
      </p>
    {:else}
      {#each sections as section}
        <div class="flex flex-col bg-secondary-20 w-full">
          <!-- Section Header -->
          <div
            class="flex items-center h-9 px-5 py-2.5 bg-secondary-40 overflow-clip w-full"
          >
            <p
              class="flex-1 text-sm font-normal text-secondary-500 text-center uppercase tracking-wider leading-4"
            >
              {section.title}
            </p>
          </div>

          <!-- Currency List -->
          <div class="flex flex-col pl-6 w-full">
            {#each section.currencies as currency}
              <button
                class="flex gap-2 h-17 items-center pr-2 border-b border-secondary-80 cursor-pointer last:border-b-0 w-full"
                onclick={() => onSelect(currency)}
              >
                <div class="flex flex-1 gap-3 items-center min-w-0">
                  <!-- Flag Icon -->
                  <lit-icon
                    icon="circle-flags:{getCountryCode(currency.code)}"
                    size="36"
                  ></lit-icon>

                  <!-- Currency Name -->
                  <p
                    class="flex-1 text-base font-{isSelected(currency)
                      ? 'bold'
                      : 'normal'} text-neutral-black leading-5 text-left"
                  >
                    {currency.name || currency.code}
                  </p>

                  <!-- Currency Code -->
                  <p
                    class="text-sm font-normal text-neutral-300 leading-normal"
                  >
                    {currency.code}
                  </p>
                </div>

                <!-- Check Icon for selected currency -->
                {#if isSelected(currency)}
                  <lit-icon icon="mdi:check" size="24" color="#50b40a"
                  ></lit-icon>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  {/if}
</div>
