<script lang="ts">
  import "@ticketapp/ui";
  import { goto } from "$app/navigation";
  import { booking } from "$lib/state/booking.svelte";
  import type { LitSteps } from "@ticketapp/ui";

  // Activation flow state
  type ActivationStep = "date" | "airline" | "flight" | "pax" | "summary";

  let currentStep = $state<ActivationStep>("date");
  let selectedDate = $state<Date | null>(null);
  let selectedAirline = $state<{ name: string; code: string } | null>(null);
  let selectedFlight = $state<{
    time: string;
    destination: string;
    country: string;
    flightNumber: string;
  } | null>(null);
  let passengerNames = $state<string[]>([]);
  let searchQuery = $state("");
  let stepsElement = $state<LitSteps | null>(null);

  // Initialize passenger names based on booking data
  $effect(() => {
    if (booking.passengerCount > 0 && passengerNames.length === 0) {
      passengerNames = Array(booking.passengerCount).fill("");
    }
  });

  // Step number for lit-steps component
  const stepNumber = $derived(
    currentStep === "date"
      ? 1
      : currentStep === "airline"
        ? 2
        : currentStep === "flight"
          ? 3
          : currentStep === "pax"
            ? 4
            : 5
  );

  // Steps data for lit-steps component
  const stepsData = $derived([
    {
      label: "DATE",
      value: selectedDate ? formatShortDate(selectedDate) : undefined,
    },
    { label: "AIRLINE", value: selectedAirline?.name },
    { label: "FLIGHT", value: selectedFlight?.flightNumber },
    {
      label: `${booking.passengerCount || 1} PAX`,
      value: passengerNames.filter((n) => n).length > 0 ? "Done" : undefined,
    },
  ]);

  // Update steps element properties
  $effect(() => {
    if (stepsElement) {
      stepsElement.currentStep = stepNumber;
      stepsElement.steps = stepsData;
    }
  });

  // Handle step click to navigate back
  function handleStepClick(event: CustomEvent) {
    const stepIndex = event.detail.step;
    if (stepIndex === 1) {
      currentStep = "date";
    } else if (stepIndex === 2 && selectedDate) {
      currentStep = "airline";
    } else if (stepIndex === 3 && selectedAirline) {
      currentStep = "flight";
    } else if (stepIndex === 4 && selectedFlight) {
      currentStep = "pax";
    }
  }

  // Calendar data
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Dynamic calendar months state
  type MonthData = {
    year: number;
    month: number;
    days: (number | null)[];
  };

  let calendarMonths = $state<MonthData[]>([]);
  let scrollContainer = $state<HTMLElement | null>(null);
  let monthsLoaded = $state(0);
  let isLoading = $state(false);

  // Generate calendar days for a specific month
  function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // Monday = 1

    const days: (number | null)[] = [];
    // Add empty slots for days before the first day
    for (let i = 1; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  // Load more months
  function loadMoreMonths(count: number = 3) {
    if (isLoading) return; // Prevent multiple simultaneous loads
    isLoading = true;

    const newMonths: MonthData[] = [];
    for (let i = 0; i < count; i++) {
      const monthOffset = monthsLoaded + i;
      const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
      const month = (currentMonth + monthOffset) % 12;
      const days = generateCalendarDays(year, month);
      newMonths.push({ year, month, days });
    }

    // Reassign the entire array for reactivity
    calendarMonths = [...calendarMonths, ...newMonths];
    monthsLoaded += count;

    setTimeout(() => {
      isLoading = false;
    }, 100);
  }

  // Initialize calendar with enough months to enable scrolling
  $effect(() => {
    if (calendarMonths.length === 0) {
      loadMoreMonths(6); // Load 6 months initially to ensure scrollable content
    }
  });

  // Auto-load more if needed to ensure scrollability
  $effect(() => {
    if (
      scrollContainer &&
      currentStep === "date" &&
      calendarMonths.length > 0
    ) {
      const hasScroll =
        scrollContainer.scrollHeight > scrollContainer.clientHeight;

      // If there's no scroll yet, load more months
      if (!hasScroll && calendarMonths.length < 12) {
        loadMoreMonths(3);
      }
    }
  });

  // Handle scroll to load more months
  function handleCalendarScroll() {
    if (currentStep !== "date") return;

    if (isLoading) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const threshold = scrollHeight * 0.8;

    // Load more when user scrolls to 80% of the content
    if (scrollPosition >= threshold) {
      loadMoreMonths(3);
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function formatShortDate(date: Date): string {
    return `${date.getDate()} ${monthNames[date.getMonth()].substring(0, 3)}`;
  }

  function formatFullDate(date: Date): string {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  function isDateAvailable(day: number, month: number, year: number): boolean {
    const date = new Date(year, month, day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return date >= todayDate;
  }

  function isDateSelected(day: number, month: number, year: number): boolean {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  }

  function selectDate(day: number, month: number, year: number) {
    selectedDate = new Date(year, month, day);
  }

  // Airlines data (mock data - in production, this would come from API)
  const popularAirlines = [
    { name: "JetBlue", code: "B6" },
    { name: "Lufthansa", code: "LH" },
    { name: "Ryanair", code: "FR" },
  ];

  const allAirlines = [
    { name: "Air Asia", code: "D7" },
    { name: "Air Moldova", code: "9U" },
    { name: "Eurowings", code: "EW" },
    { name: "Iberia", code: "IB" },
    { name: "JetBlue", code: "B6" },
    { name: "Norwegian", code: "D8" },
    { name: "Ryanair", code: "FR" },
    { name: "Virgin", code: "VS" },
    { name: "Lufthansa", code: "LH" },
  ];

  const filteredAirlines = $derived(
    !searchQuery
      ? allAirlines
      : allAirlines.filter(
          (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
  );

  /**
   * Get airline logo URL from IATA code
   * Uses a public CDN service that provides airline logos
   */
  function getAirlineLogo(iataCode: string): string {
    return `https://images.kiwi.com/airlines/64/${iataCode}.png`;
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

  // Flights data (mock data)
  const flights = [
    {
      time: "12:00",
      destination: "Thessaloniki",
      country: "Greece",
      flightNumber: "FR1201",
    },
    {
      time: "12:30",
      destination: "Madrid",
      country: "Spain",
      flightNumber: "FR5991",
    },
    {
      time: "14:00",
      destination: "Alicante",
      country: "Spain",
      flightNumber: "FR2521",
    },
    {
      time: "15:30",
      destination: "Seville",
      country: "Spain",
      flightNumber: "GT6655",
    },
    {
      time: "16:30",
      destination: "Fuerteventura",
      country: "Spain",
      flightNumber: "FR5701",
    },
    {
      time: "17:00",
      destination: "Porto",
      country: "Portugal",
      flightNumber: "FR8341",
    },
    {
      time: "17:30",
      destination: "Lisbon",
      country: "Portugal",
      flightNumber: "FR1881",
    },
    {
      time: "18:30",
      destination: "Marrakech",
      country: "Morocco",
      flightNumber: "FR3021",
    },
  ];

  // Navigation functions
  function handleNext() {
    switch (currentStep) {
      case "date":
        if (selectedDate) currentStep = "airline";
        break;
      case "airline":
        if (selectedAirline) currentStep = "flight";
        break;
      case "flight":
        if (selectedFlight) currentStep = "pax";
        break;
      case "pax":
        if (passengerNames.every((n) => n?.trim())) currentStep = "summary";
        break;
      case "summary":
        handleActivate();
        break;
    }
  }

  function handleBack() {
    switch (currentStep) {
      case "airline":
        currentStep = "date";
        break;
      case "flight":
        currentStep = "airline";
        break;
      case "pax":
        currentStep = "flight";
        break;
      case "summary":
        currentStep = "pax";
        break;
      default:
        goto("/booking/confirmation");
    }
  }

  function goToStep(step: ActivationStep) {
    currentStep = step;
  }

  function handleActivate() {
    // In production, this would call an API to activate the pass
    alert("Priority Pass pass activated successfully!");
    goto("/booking/confirmation");
  }

  function updatePassengerName(index: number, value: string) {
    // Guard against undefined values from event handler
    if (value === undefined) return;

    const newNames = [...passengerNames];
    newNames[index] = value;
    passengerNames = newNames;
  }

  // Check if can proceed to next step
  const canProceed = $derived(
    currentStep === "date"
      ? !!selectedDate
      : currentStep === "airline"
        ? !!selectedAirline
        : currentStep === "flight"
          ? !!selectedFlight
          : currentStep === "pax"
            ? passengerNames.every((n) => n?.trim())
            : true
  );

  // Header titles for each step
  const stepTitles: Record<ActivationStep, string> = {
    date: "Select departure date",
    airline: "Select airline",
    flight: "Select flight",
    pax: "Passengers",
    summary: "Review details",
  };

  // Button labels
  const buttonLabel = $derived(
    currentStep === "summary" ? "Activate Priority Pass" : "Next"
  );
</script>

<svelte:window on:scroll={handleCalendarScroll} />

<div class="min-h-screen bg-primary-800 flex flex-col gap-2">
  <!-- Header with centered logo -->
  <header
    class="bg-primary-800 flex items-center justify-center px-5 shrink-0 text-white pt-6"
  >
    <div class="flex items-center gap-2">
      <lit-logo variant="light" size="large"></lit-logo>
      <span class="text-primary-300 text-base"
        >{booking.departureAirport?.iata || "LTN"}</span
      >
    </div>
  </header>

  <!-- Steps Progress (not shown on summary) -->
  {#if currentStep !== "summary"}
    <div class="px-5 py-5 flex justify-center">
      <lit-steps bind:this={stepsElement} onstep-click={handleStepClick}
      ></lit-steps>
    </div>
  {/if}

  <!-- Main Content -->
  <main class="flex-1 flex flex-col min-h-0">
    <!-- Bottom Sheet Style Container -->
    <div
      class="bg-secondary-20 flex-1 flex flex-col rounded-tr-4xl min-h-0 max-w-md mx-auto w-full"
    >
      <!-- Sheet Header - Sticky -->
      <div
        class="px-5 pt-5 pb-4 flex items-center justify-between gap-4 sticky top-0 bg-secondary-20 z-10 rounded-tr-4xl rounded-tl-4xl"
      >
        <h1 class="text-lg font-semibold text-neutral-black flex-1">
          {stepTitles[currentStep]}
        </h1>

        {#if currentStep === "flight"}
          <!-- Time Filter Button -->
          <button
            class="flex items-center gap-2 px-5 py-3 border-2 border-primary-300 rounded-full"
          >
            <lit-icon icon="mdi:filter-outline" size="24"></lit-icon>
            <span
              class="text-base font-semibold text-neutral-black tracking-wide"
              >12:00–17:59</span
            >
          </button>
        {/if}

        {#if currentStep === "airline"}
          <!-- Search Input -->
          <div class="flex-1 max-w-full">
            <lit-text-field
              type="basic"
              placeholder="Search"
              value={searchQuery}
              oninput={(e) => (searchQuery = e.detail.value)}
            ></lit-text-field>
          </div>
        {/if}
      </div>

      <!-- Weekday Header (Date step only) - Sticky -->
      {#if currentStep === "date"}
        <div class="px-5 pb-6 sticky top-[60px] bg-secondary-20 z-10">
          <div
            class="flex items-center justify-between h-9 px-2.5 border border-secondary-200 rounded-full"
          >
            {#each weekDays as day}
              <span
                class="flex-1 text-center text-sm font-semibold text-secondary-800"
                >{day}</span
              >
            {/each}
          </div>
        </div>
      {/if}

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto min-h-0" bind:this={scrollContainer}>
        {#if currentStep === "date"}
          <!-- Calendar: Dynamic Months -->
          {#each calendarMonths as monthData, index (index)}
            <div class="py-3">
              <div class="px-5">
                <div class="flex items-center gap-4 mb-3">
                  <span
                    class="text-sm text-secondary-800 tracking-widest uppercase"
                  >
                    {monthNames[monthData.month]}
                    {monthData.year}
                  </span>
                  <div class="flex-1 h-px bg-secondary-200"></div>
                </div>
                <div class="grid grid-cols-7 gap-y-0">
                  {#each monthData.days as day}
                    {#if day === null}
                      <div class="w-12 h-12"></div>
                    {:else}
                      {@const available = isDateAvailable(
                        day,
                        monthData.month,
                        monthData.year
                      )}
                      {@const selected = isDateSelected(
                        day,
                        monthData.month,
                        monthData.year
                      )}
                      <button
                        class="w-12 h-12 flex items-center justify-center rounded-full text-base font-medium transition-colors
                          {selected
                          ? 'bg-primary-300 text-neutral-black'
                          : available
                            ? 'text-neutral-black hover:bg-secondary-80'
                            : 'text-secondary-200'}"
                        disabled={!available}
                        onclick={() =>
                          available &&
                          selectDate(day, monthData.month, monthData.year)}
                      >
                        {day}
                      </button>
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        {:else if currentStep === "airline"}
          <!-- Popular Airlines -->
          <div class="bg-secondary-20">
            <div
              class="bg-[#e5eaef] h-9 flex items-center px-5 text-sm text-secondary-500 uppercase tracking-widest"
            >
              Most popular
            </div>
            <div class="pl-6">
              {#each popularAirlines as airline}
                <button
                  class="w-full flex items-center gap-4 pr-4 h-13 border-b border-secondary-80 text-left"
                  onclick={() => (selectedAirline = airline)}
                >
                  <div
                    class="w-6 h-6 bg-neutral-white rounded flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={getAirlineLogo(airline.code)}
                      alt={airline.name}
                      class="w-full h-full object-contain"
                      onerror={(e) => handleImageError(e, airline.code)}
                    />
                  </div>
                  <span class="flex-1 text-base text-neutral-black"
                    >{airline.name}</span
                  >
                  <span class="text-base text-neutral-300">{airline.code}</span>
                  {#if selectedAirline?.code === airline.code}
                    <lit-icon
                      icon="mdi:check"
                      size="24"
                      class="text-system-success"
                    ></lit-icon>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <!-- All Airlines -->
          <div class="bg-secondary-20">
            <div
              class="bg-[#e5eaef] h-9 flex items-center px-5 text-sm text-secondary-500 uppercase tracking-widest"
            >
              All airlines
            </div>
            <div class="pl-6">
              {#each filteredAirlines as airline}
                <button
                  class="w-full flex items-center gap-4 pr-4 h-13 border-b border-secondary-80 text-left"
                  onclick={() => (selectedAirline = airline)}
                >
                  <div
                    class="w-6 h-6 bg-neutral-white rounded flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={getAirlineLogo(airline.code)}
                      alt={airline.name}
                      class="w-full h-full object-contain"
                      onerror={(e) => handleImageError(e, airline.code)}
                    />
                  </div>
                  <span class="flex-1 text-base text-neutral-black"
                    >{airline.name}</span
                  >
                  <span class="text-base text-neutral-300">{airline.code}</span>
                  <div class="w-6 flex items-center justify-center">
                    <lit-icon
                      icon="mdi:check"
                      size="24"
                      class="text-system-success {selectedAirline?.code ===
                      airline.code
                        ? 'opacity-100'
                        : 'opacity-0'}"
                    ></lit-icon>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {:else if currentStep === "flight"}
          <!-- Flights List -->
          <div class="bg-secondary-20">
            <div
              class="bg-[#e5eaef] h-9 flex items-center px-5 text-sm text-secondary-500 uppercase tracking-widest"
            >
              12:00 – 17:59
            </div>
            <div class="pl-6">
              {#each flights as flight}
                <button
                  class="w-full flex items-center gap-2 pr-4 py-2.5 border-b border-secondary-80 text-left"
                  onclick={() => (selectedFlight = flight)}
                >
                  <span class="text-base text-neutral-black">{flight.time}</span
                  >
                  <span class="text-base text-secondary-200">to</span>
                  <div class="flex-1 flex items-center gap-2">
                    <div class="flex-1 flex flex-col gap-0.5">
                      <span
                        class="text-base font-bold text-neutral-black leading-5"
                        >{flight.destination}</span
                      >
                      <span class="text-sm text-secondary-300"
                        >{flight.country}</span
                      >
                    </div>
                    <span class="text-xs text-secondary-200"
                      >{flight.flightNumber}</span
                    >
                  </div>
                  {#if selectedFlight?.flightNumber === flight.flightNumber}
                    <lit-icon
                      icon="mdi:check"
                      size="24"
                      class="text-system-success"
                    ></lit-icon>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {:else if currentStep === "pax"}
          <!-- Passengers Form -->
          <div class="bg-secondary-20 px-5 py-5 flex flex-col gap-5">
            {#each Array(booking.passengerCount || 1) as _, index}
              <div class="flex items-center gap-5">
                <div
                  class="w-6 h-6 rounded-full bg-secondary-80 flex items-center justify-center"
                >
                  <span class="text-sm text-neutral-black">{index + 1}</span>
                </div>
                <div class="flex-1">
                  <lit-text-field
                    type="basic"
                    label="Full name"
                    placeholder="Enter passenger name"
                    value={passengerNames[index] || ""}
                    validated={!!passengerNames[index]?.trim()}
                    oninput={(e) => updatePassengerName(index, e.detail.value)}
                  ></lit-text-field>
                </div>
              </div>
            {/each}
          </div>
        {:else if currentStep === "summary"}
          <!-- Summary Review -->
          <div class="bg-secondary-20 px-5 py-5 flex flex-col gap-9">
            <!-- Departure Date -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <span
                  class="text-xs font-semibold text-secondary-300 uppercase tracking-widest"
                  >Departure date</span
                >
                <div class="flex-1 h-px bg-secondary-80"></div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base text-neutral-black">
                  {selectedDate ? formatFullDate(selectedDate) : "Not selected"}
                </span>
                <button
                  class="w-9 h-9 rounded-full bg-secondary-40 flex items-center justify-center"
                  onclick={() => goToStep("date")}
                  aria-label="Edit departure date"
                >
                  <lit-icon
                    icon="mdi:pencil"
                    size="24"
                    class="text-neutral-black"
                  ></lit-icon>
                </button>
              </div>
            </div>

            <!-- Airline -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <span
                  class="text-xs font-semibold text-secondary-300 uppercase tracking-widest"
                  >Airline</span
                >
                <div class="flex-1 h-px bg-secondary-80"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-6 h-6 bg-neutral-white rounded flex items-center justify-center overflow-hidden"
                  >
                    <lit-icon
                      icon="mdi:airplane"
                      size="16"
                      class="text-secondary-300"
                    ></lit-icon>
                  </div>
                  <span class="text-base text-neutral-black">
                    {selectedAirline?.name || "Not selected"}
                  </span>
                </div>
                <button
                  class="w-9 h-9 rounded-full bg-secondary-40 flex items-center justify-center"
                  onclick={() => goToStep("airline")}
                  aria-label="Edit airline selection"
                >
                  <lit-icon
                    icon="mdi:pencil"
                    size="24"
                    class="text-neutral-black"
                  ></lit-icon>
                </button>
              </div>
            </div>

            <!-- Flight -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <span
                  class="text-xs font-semibold text-secondary-300 uppercase tracking-widest"
                  >Flight</span
                >
                <div class="flex-1 h-px bg-secondary-80"></div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base text-neutral-black leading-6">
                  {#if selectedFlight}
                    Departing at <strong>{selectedFlight.time}</strong> to
                    <strong>{selectedFlight.destination}</strong>
                    ({selectedFlight.flightNumber})
                  {:else}
                    Not selected
                  {/if}
                </span>
                <button
                  class="w-9 h-9 rounded-full bg-secondary-40 flex items-center justify-center shrink-0"
                  onclick={() => goToStep("flight")}
                  aria-label="Edit flight selection"
                >
                  <lit-icon
                    icon="mdi:pencil"
                    size="24"
                    class="text-neutral-black"
                  ></lit-icon>
                </button>
              </div>
            </div>

            <!-- Passengers -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <span
                  class="text-xs font-semibold text-secondary-300 uppercase tracking-widest"
                  >Pax</span
                >
                <div class="flex-1 h-px bg-secondary-80"></div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-base text-neutral-black leading-6">
                  {passengerNames.filter((n) => n?.trim()).join(", ") ||
                    "Not entered"}
                </span>
                <button
                  class="w-9 h-9 rounded-full bg-secondary-40 flex items-center justify-center shrink-0"
                  onclick={() => goToStep("pax")}
                  aria-label="Edit passenger names"
                >
                  <lit-icon
                    icon="mdi:pencil"
                    size="24"
                    class="text-neutral-black"
                  ></lit-icon>
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div
        class="bg-secondary-20 p-5 shadow-[0_0_15px_rgba(44,92,148,0.2)] sticky bottom-0 shrink-0"
      >
        {#if currentStep === "date" && selectedDate}
          <div class="flex items-center gap-4">
            <div class="flex-1 flex flex-col">
              <span class="text-xs text-secondary-500">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ][selectedDate.getDay()]}
              </span>
              <span class="text-base font-semibold text-neutral-black">
                {selectedDate.getDate()}
                {monthNames[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
              </span>
            </div>
            <lit-button
              variant="primary"
              size="medium"
              class="flex-1"
              disabled={!canProceed}
              onbutton-click={handleNext}
            >
              <span>Next</span>
              <lit-icon icon="mdi:chevron-right" size="24"></lit-icon>
            </lit-button>
          </div>
        {:else}
          <lit-button
            variant="primary"
            size="medium"
            class="w-full"
            disabled={!canProceed}
            onbutton-click={handleNext}
          >
            <span>{buttonLabel}</span>
            {#if currentStep !== "summary"}
              <lit-icon icon="mdi:chevron-right" size="24"></lit-icon>
            {/if}
          </lit-button>
        {/if}
      </div>
    </div>
  </main>
</div>
