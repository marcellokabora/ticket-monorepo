<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    type Airport,
    type ContactInfo,
    getCountries,
    type Country,
    type RestrictedAirline,
    applyDiscount,
    removeDiscount,
    getAirportByIata,
    getCoupons,
    type Coupon,
  } from "@ticketapp/api";
  import {
    detectUserCountry,
    fetchAirportAvailability,
    fetchAirportAirlineAvailability,
    saveBookingToTrip,
    type AvailabilityResult,
  } from "@ticketapp/utils";
  import AirportPicker from "$lib/components/AirportPicker.svelte";
  import AirlinePicker from "$lib/components/AirlinePicker.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import AlternativePaymentButtons from "$lib/components/AlternativePaymentButtons.svelte";
  // Direct import - no context needed!
  import { booking, saveVerifiedContact } from "$lib/state/booking.svelte";
  import { syncURLWithBooking } from "$lib/state/url-sync";
  import type { PageData } from "./$types";

  // Get URL parameters from page load
  let { data }: { data: PageData } = $props();

  let departureDrawerOpen = $state(false);
  let returnDrawerOpen = $state(false);
  let promoCodeDialogOpen = $state(false);
  let promoCodeInput = $state("");
  let promoCodeError = $state<string | null>(null);
  let isPromoCodeLoading = $state(false);
  let availableCoupons = $state<Coupon[]>([]);
  let isCouponsLoading = $state(false);
  let paymentDrawerOpen = $state(false);
  let isPricingLoading = $state(false);
  let isDeparturePriceLoading = $state(false);
  let isReturnPriceLoading = $state(false);
  let isProcessingPayment = $state(false);
  let errorMessage = $state<string | null>(null);
  let showToast = $state(false);

  // Airline selection state (for airports with restricted airlines)
  let departureAirlineDrawerOpen = $state(false);
  let returnAirlineDrawerOpen = $state(false);
  let departureRestrictedAirlines = $state<RestrictedAirline[]>([]);
  let returnRestrictedAirlines = $state<RestrictedAirline[]>([]);
  let isAirlineLoading = $state(false);
  let pendingDepartureAirport = $state<Airport | null>(null);
  let pendingReturnAirport = $state<Airport | null>(null);

  // Payment verification state
  let verificationStep = $state<1 | 2>(1);
  let deliveryMethod = $state<"sms" | "email">("sms");
  let phoneNumber = $state("");
  let emailAddress = $state("");
  let verificationCode = $state("");
  let isVerificationLoading = $state(false);
  let resendTimer = $state(0);
  let resendInterval: ReturnType<typeof setInterval> | null = null;
  let showCountrySelector = $state(false);
  let selectedCountry = $state<Country>({
    code: "ES",
    prefix: "+34",
    name: "Spain",
  });
  let countrySearchQuery = $state("");
  let countries = $state<Country[]>([]);
  let countriesLoading = $state(true);

  // Verification form validation errors
  let phoneError = $state<string | null>(null);
  let emailError = $state<string | null>(null);
  let verificationCodeError = $state<string | null>(null);
  let hasAttemptedVerification = $state(false);

  // Derived values
  const hasAnyService = $derived(() => booking.departureAirport !== null);
  const isBookingValid = $derived(() => {
    if (!booking.departureAirport) return false;
    if (booking.addReturnFlight && !booking.returnAirport) return false;
    return true;
  });

  // Calculate total price with validated discount
  const totalPrice = $derived(() => {
    const outboundTotal = booking.departurePrice * booking.passengerCount;
    const returnTotal = booking.addReturnFlight
      ? booking.returnPrice * booking.passengerCount
      : 0;
    const total = outboundTotal + returnTotal;

    // Apply discount from API
    if (booking.discountAmount > 0) {
      return round(total - booking.discountAmount, 2);
    } else if (booking.discountPercentage) {
      return round(total * (1 - booking.discountPercentage / 100), 2);
    }

    return round(total, 2);
  });

  const priceBeforeDiscount = $derived(() => {
    const outboundTotal = booking.departurePrice * booking.passengerCount;
    const returnTotal = booking.addReturnFlight
      ? booking.returnPrice * booking.passengerCount
      : 0;
    return outboundTotal + returnTotal;
  });

  // Verification validation functions
  function validatePhoneNumber(phone: string): boolean {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 6 && digitsOnly.length <= 15;
  }

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateVerificationCode(code: string): boolean {
    return /^\d{4}$/.test(code);
  }

  function formatPhoneNumber(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  }

  const isVerificationStep1Valid = $derived(
    deliveryMethod === "sms"
      ? validatePhoneNumber(phoneNumber)
      : validateEmail(emailAddress)
  );

  const isVerificationStep2Valid = $derived(
    validateVerificationCode(verificationCode)
  );

  const contactDisplay = $derived(
    deliveryMethod === "sms"
      ? `${selectedCountry.prefix} ${phoneNumber}`
      : emailAddress
  );

  const filteredCountries = $derived(
    countries.filter(
      (country) =>
        country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.prefix.includes(countrySearchQuery)
    )
  );

  function round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  // Pricing functions - now with airline awareness
  async function fetchDeparturePricing() {
    if (!booking.departureAirport) {
      booking.departurePrice = 0;
      return;
    }
    isDeparturePriceLoading = true;
    isPricingLoading = true;
    try {
      // If an airline is selected, fetch airline-specific pricing
      if (booking.departureAirline) {
        const result = await fetchAirportAirlineAvailability(
          booking.departureAirport.iata,
          booking.departureAirline.iata,
          booking.selectedCurrency.code
        );
        booking.departurePrice = result.price;
        booking.departureTicketappUuid = result.ticketappUuid;
      } else {
        const result = await fetchAirportAvailability(
          booking.departureAirport.iata,
          booking.selectedCurrency.code
        );
        booking.departurePrice = result.price;
        booking.departureTicketappUuid = result.ticketappUuid;
      }
    } catch (error) {
      console.error("Error fetching departure pricing:", error);
      booking.departurePrice = 0;
    } finally {
      isDeparturePriceLoading = false;
      if (!isReturnPriceLoading) {
        isPricingLoading = false;
      }
    }
  }

  async function fetchReturnPricing() {
    if (!booking.returnAirport || !booking.addReturnFlight) {
      booking.returnPrice = 0;
      return;
    }
    isReturnPriceLoading = true;
    isPricingLoading = true;
    try {
      // If an airline is selected, fetch airline-specific pricing
      if (booking.returnAirline) {
        const result = await fetchAirportAirlineAvailability(
          booking.returnAirport.iata,
          booking.returnAirline.iata,
          booking.selectedCurrency.code
        );
        booking.returnPrice = result.price;
        booking.returnTicketappUuid = result.ticketappUuid;
      } else {
        const result = await fetchAirportAvailability(
          booking.returnAirport.iata,
          booking.selectedCurrency.code
        );
        booking.returnPrice = result.price;
        booking.returnTicketappUuid = result.ticketappUuid;
      }
    } catch (error) {
      console.error("Error fetching return pricing:", error);
      booking.returnPrice = 0;
    } finally {
      isReturnPriceLoading = false;
      if (!isDeparturePriceLoading) {
        isPricingLoading = false;
      }
    }
  }

  // Event handlers
  function incrementPassengers() {
    if (booking.passengerCount < 9) {
      booking.passengerCount++;
    }
  }

  function decrementPassengers() {
    if (booking.passengerCount > 1) {
      booking.passengerCount--;
    }
  }

  function handleReturnFlightToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    booking.addReturnFlight = checked;
    if (checked) {
      returnDrawerOpen = true;
    } else {
      booking.returnPrice = 0;
      booking.returnAirline = null;
    }
  }

  /**
   * Handle departure airport selection
   * Checks for airline restrictions and shows airline picker if needed
   */
  async function handleDepartureAirportSelect(airport: Airport) {
    departureDrawerOpen = false;
    isDeparturePriceLoading = true;
    isPricingLoading = true;

    try {
      // Check availability and get any airline restrictions
      const result = await fetchAirportAvailability(
        airport.iata,
        booking.selectedCurrency.code
      );

      if (!result.available) {
        errorMessage = `Fast Track is not available at ${airport.display_name || airport.name}`;
        showToast = true;
        isDeparturePriceLoading = false;
        isPricingLoading = false;
        return;
      }

      // Always show airline picker after airport selection
      if (
        result.restrictedToAirlines &&
        result.restrictedToAirlines.length > 0
      ) {
        // Store the pending airport and show airline picker
        pendingDepartureAirport = airport;
        departureRestrictedAirlines = result.restrictedToAirlines;
        departureAirlineDrawerOpen = true;
        isDeparturePriceLoading = false;
        isPricingLoading = false;
      } else {
        // Fallback: no airlines available - set airport directly
        booking.departureAirport = airport;
        booking.departureAirline = null;
        booking.departurePrice = result.price;
        booking.departureTicketappUuid = result.ticketappUuid;
        isDeparturePriceLoading = false;
        isPricingLoading = false;
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      errorMessage = "Failed to check availability. Please try again.";
      showToast = true;
      isDeparturePriceLoading = false;
      isPricingLoading = false;
    }
  }

  /**
   * Handle departure airline selection (when airport has restrictions)
   */
  async function handleDepartureAirlineSelect(airline: RestrictedAirline) {
    if (!pendingDepartureAirport) return;

    isAirlineLoading = true;

    try {
      // Get airline-specific availability and pricing
      const result = await fetchAirportAirlineAvailability(
        pendingDepartureAirport.iata,
        airline.iata,
        booking.selectedCurrency.code
      );

      if (!result.available) {
        errorMessage = `Fast Track is not available with ${airline.name}`;
        showToast = true;
        isAirlineLoading = false;
        return;
      }

      // Set both airport and airline
      booking.departureAirport = pendingDepartureAirport;
      booking.departureAirline = airline;
      booking.departurePrice = result.price;
      booking.departureTicketappUuid = result.ticketappUuid;

      // Close drawer and reset state
      departureAirlineDrawerOpen = false;
      pendingDepartureAirport = null;
      departureRestrictedAirlines = [];
    } catch (error) {
      console.error("Error fetching airline availability:", error);
      errorMessage = "Failed to check airline availability. Please try again.";
      showToast = true;
    } finally {
      isAirlineLoading = false;
    }
  }

  /**
   * Handle return airport selection
   * Similar to departure, checks for airline restrictions
   */
  async function handleReturnAirportSelect(airport: Airport) {
    returnDrawerOpen = false;
    isReturnPriceLoading = true;
    isPricingLoading = true;

    try {
      // Check availability and get any airline restrictions
      const result = await fetchAirportAvailability(
        airport.iata,
        booking.selectedCurrency.code
      );

      if (!result.available) {
        errorMessage = `Fast Track is not available at ${airport.display_name || airport.name}`;
        showToast = true;
        isReturnPriceLoading = false;
        isPricingLoading = false;
        return;
      }

      // Always show airline picker after airport selection
      if (
        result.restrictedToAirlines &&
        result.restrictedToAirlines.length > 0
      ) {
        // Store the pending airport and show airline picker
        pendingReturnAirport = airport;
        returnRestrictedAirlines = result.restrictedToAirlines;
        returnAirlineDrawerOpen = true;
        isReturnPriceLoading = false;
        isPricingLoading = false;
      } else {
        // Fallback: no airlines available - set airport directly
        booking.returnAirport = airport;
        booking.returnAirline = null;
        booking.returnPrice = result.price;
        booking.returnTicketappUuid = result.ticketappUuid;
        isReturnPriceLoading = false;
        isPricingLoading = false;
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      errorMessage = "Failed to check availability. Please try again.";
      showToast = true;
      isReturnPriceLoading = false;
      isPricingLoading = false;
    }
  }

  /**
   * Handle return airline selection (when airport has restrictions)
   */
  async function handleReturnAirlineSelect(airline: RestrictedAirline) {
    if (!pendingReturnAirport) return;

    isAirlineLoading = true;

    try {
      // Get airline-specific availability and pricing
      const result = await fetchAirportAirlineAvailability(
        pendingReturnAirport.iata,
        airline.iata,
        booking.selectedCurrency.code
      );

      if (!result.available) {
        errorMessage = `Fast Track is not available with ${airline.name}`;
        showToast = true;
        isAirlineLoading = false;
        return;
      }

      // Set both airport and airline
      booking.returnAirport = pendingReturnAirport;
      booking.returnAirline = airline;
      booking.returnPrice = result.price;
      booking.returnTicketappUuid = result.ticketappUuid;

      // Close drawer and reset state
      returnAirlineDrawerOpen = false;
      pendingReturnAirport = null;
      returnRestrictedAirlines = [];
    } catch (error) {
      console.error("Error fetching airline availability:", error);
      errorMessage = "Failed to check airline availability. Please try again.";
      showToast = true;
    } finally {
      isAirlineLoading = false;
    }
  }

  /**
   * Handle closing the airline drawer without selection
   */
  function handleDepartureAirlineDrawerClose() {
    departureAirlineDrawerOpen = false;
    pendingDepartureAirport = null;
    departureRestrictedAirlines = [];
  }

  function handleReturnAirlineDrawerClose() {
    returnAirlineDrawerOpen = false;
    pendingReturnAirport = null;
    returnRestrictedAirlines = [];
  }

  /**
   * Handle "My airline is not listed" - shows error message
   */
  function handleDepartureAirlineNotListed() {
    errorMessage =
      "Fast Track at this airport is only available for passengers flying with the listed airlines.";
    showToast = true;
    handleDepartureAirlineDrawerClose();
  }

  // Note: Trip creation happens during payment, not during selection
  // This ensures we don't create trips for users who are just browsing

  function handleReturnAirlineNotListed() {
    errorMessage =
      "Fast Track at this airport is only available for passengers flying with the listed airlines.";
    showToast = true;
    handleReturnAirlineDrawerClose();
  }

  async function handleCreditCard() {
    // If already verified, ensure trip exists and go directly to payment
    if (booking.verifiedContact) {
      const tripUuid = await ensureTripExists();
      if (tripUuid) {
        navigateToPayment();
      }
    } else {
      paymentDrawerOpen = true;
    }
  }

  function handlePaymentError(error: string) {
    errorMessage = error;
  }

  // Payment verification handlers
  function handlePhoneInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    phoneNumber = formatPhoneNumber(value);
    phoneError = null;
  }

  function handlePhoneBlur() {
    if (phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber)) {
      phoneError = "Invalid phone number (6-15 digits required)";
    }
  }

  function handleEmailInput(e: Event) {
    emailAddress = (e.target as HTMLInputElement).value;
    emailError = null;
  }

  function handleEmailBlur() {
    if (emailAddress.length > 0 && !validateEmail(emailAddress)) {
      emailError = "Please enter a valid email address";
    }
  }

  function handleCodeInput(e: Event) {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    verificationCode = value.slice(0, 4);
    verificationCodeError = null;
  }

  function handleCodeBlur() {
    if (
      verificationCode.length > 0 &&
      !validateVerificationCode(verificationCode)
    ) {
      errorMessage = "Code must be 4 digits";
      showToast = true;
    }
  }

  function handleTabChange(e: CustomEvent) {
    deliveryMethod = e.detail.activeTab === 0 ? "sms" : "email";
    phoneError = null;
    emailError = null;
  }

  function startResendTimer() {
    resendTimer = 59;
    if (resendInterval) clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      resendTimer--;
      if (resendTimer <= 0) {
        if (resendInterval) clearInterval(resendInterval);
        resendInterval = null;
      }
    }, 1000);
  }

  function clearResendTimer() {
    if (resendInterval) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
  }

  async function handleSendVerificationCode() {
    if (deliveryMethod === "sms") {
      if (!validatePhoneNumber(phoneNumber)) {
        phoneError = "Please enter a valid phone number";
        return;
      }
    } else {
      if (!validateEmail(emailAddress)) {
        emailError = "Please enter a valid email address";
        return;
      }
    }

    isVerificationLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isVerificationLoading = false;
    verificationStep = 2;
    startResendTimer();
  }

  async function handleResendCode() {
    if (resendTimer > 0) return;
    isVerificationLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isVerificationLoading = false;
    startResendTimer();
  }

  async function handleVerifyCode() {
    if (!validateVerificationCode(verificationCode)) {
      errorMessage = "Please enter a valid 4-digit code";
      showToast = true;
      return;
    }

    hasAttemptedVerification = true;
    isVerificationLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for fake verification code "1234" (dev mode only)
    const isDev = import.meta.env.DEV;
    if (isDev && verificationCode === "1234") {
      console.log("✅ [DEV] Fake verification code accepted");
      // Continue with verification success flow below
    } else if (verificationCode !== "1234") {
      isVerificationLoading = false;
      hasAttemptedVerification = false;
      verificationCodeError = "Incorrect code.";
      verificationCode = "";
      return;
    }

    // Store verified contact info
    saveVerifiedContact({
      method: deliveryMethod,
      value:
        deliveryMethod === "sms"
          ? `${selectedCountry.prefix} ${phoneNumber}`
          : emailAddress,
    });

    // Validate required fields before proceeding to payment
    if (!booking.departureAirport) {
      isVerificationLoading = false;
      hasAttemptedVerification = false;
      errorMessage = "Please select a departure airport first.";
      showToast = true;
      verificationCode = "";
      return;
    }

    // Create trip and navigate to payment with only trip UID in URL
    const tripUuid = await ensureTripExists();
    if (!tripUuid) {
      isVerificationLoading = false;
      hasAttemptedVerification = false;
      verificationCode = "";
      return;
    }

    isVerificationLoading = false;
    resetVerificationState();
    paymentDrawerOpen = false;

    // Navigate to payment with ONLY trip UUID - payment page loads data from API
    goto(`/booking/payment?tripId=${tripUuid}`);
  }

  function handleChangeContact() {
    verificationStep = 1;
    verificationCode = "";
    clearResendTimer();
  }

  function resetVerificationState() {
    verificationStep = 1;
    verificationCode = "";
    phoneError = null;
    emailError = null;
    verificationCodeError = null;
    hasAttemptedVerification = false;
    clearResendTimer();
  }

  function handlePaymentDrawerClose() {
    resetVerificationState();
    paymentDrawerOpen = false;
  }

  function handleCountrySelect(country: Country) {
    selectedCountry = country;
    showCountrySelector = false;
    countrySearchQuery = "";
  }

  function handleCountrySearch(e: Event) {
    countrySearchQuery = (e.target as HTMLInputElement).value;
  }

  function highlightText(text: string, query: string): string {
    if (!query.trim()) {
      return text;
    }
    const regex = new RegExp(`(${query.trim()})`, "gi");
    return text.replace(regex, '<span class="underline">$1</span>');
  }

  function handlePaymentVerified(contact: ContactInfo) {
    paymentDrawerOpen = false;
    saveVerifiedContact(contact);
    navigateToPayment();
  }

  async function handlePromoCodeClick() {
    promoCodeDialogOpen = true;

    // Load available coupons when dialog opens
    if (availableCoupons.length === 0 && !isCouponsLoading) {
      isCouponsLoading = true;
      try {
        const response = await getCoupons();
        availableCoupons = response.coupons.filter((c) => c.active);
        console.log("✅ Loaded", availableCoupons.length, "available coupons");
      } catch (error) {
        console.error("Failed to load coupons:", error);
        // Don't show error to user - manual entry still works
      } finally {
        isCouponsLoading = false;
      }
    }
  }

  /**
   * Creates or updates a trip based on current booking state.
   * If user has verified contact, reuses it without asking again.
   * Note: API doesn't support updating existing trips (except adding return flight),
   * so we create a new trip if anything changed.
   */
  async function ensureTripExists(): Promise<string | null> {
    if (!booking.departureAirport) {
      errorMessage = "Please select an airport first";
      showToast = true;
      return null;
    }

    if (!booking.selectedCurrency) {
      errorMessage = "Currency not set. Please try again.";
      showToast = true;
      return null;
    }

    try {
      // Check if we need to create a new trip or can reuse existing
      const needsNewTrip = !booking.tripUuid;
      const action = needsNewTrip ? "Creating" : "Updating";
      console.log(`📝 ${action} trip...`);

      const result = await saveBookingToTrip({
        departureAirport: booking.departureAirport,
        returnAirport: booking.returnAirport,
        addReturnFlight: booking.addReturnFlight,
        passengerCount: booking.passengerCount,
        currency: booking.selectedCurrency,
        departurePrice: booking.departurePrice,
        returnPrice: booking.returnPrice,
        airlineIata: booking.departureAirline?.iata,
        existingTripUuid: booking.tripUuid || undefined,
      });

      // Update trip IDs (may be new trip if user changed departure details)
      booking.tripUuid = result.tripUuid;
      booking.departureRequestId = result.departureRequestId;
      booking.returnRequestId = result.returnRequestId;
      console.log(`✅ Trip saved:`, result.tripUuid);
      return result.tripUuid;
    } catch (error) {
      console.error("Failed to save trip:", error);
      errorMessage = "Failed to process. Please try again.";
      showToast = true;
      return null;
    }
  }

  async function handlePromoCodeSubmit() {
    if (!promoCodeInput.trim()) return;

    if (!booking.departureAirport) {
      errorMessage = "Please select an airport first";
      showToast = true;
      return;
    }

    const code = promoCodeInput.trim().toUpperCase();
    isPromoCodeLoading = true;

    try {
      // First, check against the fake coupon list
      const matchingCoupon = availableCoupons.find(
        (c) => c.code.toUpperCase() === code && c.active
      );

      if (matchingCoupon) {
        // Valid coupon from fake list
        booking.appliedPromoCode = matchingCoupon.code;

        if (matchingCoupon.discount_type === "percentage") {
          booking.discountPercentage = matchingCoupon.discount_value;
          booking.discountAmount = 0; // Will be calculated from percentage
          console.log(
            `✅ [FAKE] ${matchingCoupon.code} applied: ${matchingCoupon.discount_value}% discount`
          );
        } else {
          booking.discountPercentage = null;
          booking.discountAmount = matchingCoupon.discount_value;
          console.log(
            `✅ [FAKE] ${matchingCoupon.code} applied: €${matchingCoupon.discount_value} discount`
          );
        }

        promoCodeDialogOpen = false;
        promoCodeInput = "";
        promoCodeError = null;
        isPromoCodeLoading = false;
        return;
      }

      // If not in fake list, try the API (when it exists)
      // For now, show invalid message since API endpoint doesn't exist yet
      promoCodeError = "Invalid promo code";
      console.warn("❌ Promo code not found in available coupons:", code);

      // TODO: Uncomment when real API is ready
      // const tripUuid = await ensureTripExists();
      // if (!tripUuid) {
      //   isPromoCodeLoading = false;
      //   return;
      // }
      // const response = await applyDiscount(tripUuid, { code });
      // if (response.valid) {
      //   booking.appliedPromoCode = code;
      //   booking.discountAmount = response.discount_amount || 0;
      //   booking.discountPercentage = response.discount_percentage || null;
      //   promoCodeDialogOpen = false;
      //   promoCodeInput = "";
      //   promoCodeError = null;
      // } else {
      //   promoCodeError = response.message || "Invalid promo code";
      // }
    } catch (error) {
      console.error("Failed to validate promo code:", error);
      promoCodeError = "Failed to validate promo code. Please try again.";
    } finally {
      isPromoCodeLoading = false;
    }
  }

  async function handleRemovePromoCode() {
    if (booking.tripUuid) {
      try {
        await removeDiscount(booking.tripUuid);
      } catch (error) {
        console.error("Failed to remove discount from API:", error);
        // Continue with local removal even if API fails
      }
    }

    booking.appliedPromoCode = null;
    booking.discountAmount = 0;
    booking.discountPercentage = null;
    console.log("🗑️ Promo code removed");
  }

  function handlePromoCodeInputChange(e: Event) {
    promoCodeInput = (e.target as HTMLInputElement).value;
    promoCodeError = null;
  }

  function dismissToast() {
    showToast = false;
    setTimeout(() => {
      errorMessage = null;
    }, 300);
  }

  // Helper to navigate to payment with only trip UUID
  function navigateToPayment() {
    // Only include trip UUID - payment page loads all data from API
    if (booking.tripUuid) {
      goto(`/booking/payment?tripId=${booking.tripUuid}`);
    } else {
      console.error("Cannot navigate to payment: No trip UUID");
      errorMessage = "Trip not found. Please try again.";
      showToast = true;
    }
  }

  // Auto-dismiss logic
  $effect(() => {
    if (errorMessage) {
      showToast = true;
      const timer = setTimeout(() => {
        showToast = false;
        setTimeout(() => {
          errorMessage = null;
        }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  // Auto-submit verification code when complete
  $effect(() => {
    if (
      verificationStep === 2 &&
      validateVerificationCode(verificationCode) &&
      !isVerificationLoading &&
      !hasAttemptedVerification
    ) {
      handleVerifyCode();
    }
  });

  // Sync URL with booking state changes
  $effect(() => {
    // Track all relevant booking fields
    const _ = [
      booking.departureAirport,
      booking.departureAirline,
      booking.returnAirport,
      booking.returnAirline,
      booking.addReturnFlight,
      booking.passengerCount,
      booking.appliedPromoCode,
    ];

    // Update URL whenever state changes (debounced to avoid excessive updates)
    const timeout = setTimeout(() => {
      syncURLWithBooking(booking, "/booking");
    }, 100);

    return () => clearTimeout(timeout);
  });

  // Initialize from URL parameters on mount
  onMount(async () => {
    try {
      const fetchedCountries = await getCountries();
      countries = fetchedCountries;
      countriesLoading = false;

      // Auto-detect user's country after countries are loaded
      selectedCountry = await detectUserCountry(countries, "ES");

      // Load booking data from URL parameters
      const params = data.bookingParams;

      // Set passenger count from URL
      if (
        params.passengers &&
        params.passengers >= 1 &&
        params.passengers <= 9
      ) {
        booking.passengerCount = params.passengers;
      }

      // Set add return flight from URL
      if (params.addReturn) {
        booking.addReturnFlight = true;
      }

      // Load departure airport if specified
      if (params.departure) {
        try {
          const departureAirport = await getAirportByIata(params.departure);
          if (departureAirport) {
            // First check availability to get restricted airlines list
            const availabilityResult = await fetchAirportAvailability(
              departureAirport.iata,
              booking.selectedCurrency.code
            );

            if (!availabilityResult.available) {
              console.warn(
                `Departure airport ${params.departure} is not available`
              );
              return;
            }

            // Check if airline is specified in URL
            if (
              params.departureAirline &&
              availabilityResult.restrictedToAirlines?.length
            ) {
              // Find the airline in the restricted list to get full details
              const airline = availabilityResult.restrictedToAirlines.find(
                (a) =>
                  a.iata.toUpperCase() ===
                  params.departureAirline!.toUpperCase()
              );

              if (airline) {
                // Fetch airline-specific pricing
                const airlineResult = await fetchAirportAirlineAvailability(
                  departureAirport.iata,
                  airline.iata,
                  booking.selectedCurrency.code
                );

                if (airlineResult.available) {
                  booking.departureAirport = departureAirport;
                  booking.departureAirline = airline; // Use full airline object with name
                  booking.departurePrice = airlineResult.price;
                  booking.departureTicketappUuid = airlineResult.ticketappUuid;
                }
              } else {
                console.warn(
                  `Airline ${params.departureAirline} not found in restricted list`
                );
              }
            } else if (!availabilityResult.restrictedToAirlines?.length) {
              // No airline restrictions - use airport directly
              booking.departureAirport = departureAirport;
              booking.departurePrice = availabilityResult.price;
              booking.departureTicketappUuid = availabilityResult.ticketappUuid;
            }
          }
        } catch (error) {
          console.error("Failed to load departure airport from URL:", error);
        }
      }

      // Load return airport if specified and return flight is enabled
      if (params.return && booking.addReturnFlight) {
        try {
          const returnAirport = await getAirportByIata(params.return);
          if (returnAirport) {
            // First check availability to get restricted airlines list
            const availabilityResult = await fetchAirportAvailability(
              returnAirport.iata,
              booking.selectedCurrency.code
            );

            if (!availabilityResult.available) {
              console.warn(`Return airport ${params.return} is not available`);
              return;
            }

            // Check if airline is specified in URL
            if (
              params.returnAirline &&
              availabilityResult.restrictedToAirlines?.length
            ) {
              // Find the airline in the restricted list to get full details
              const airline = availabilityResult.restrictedToAirlines.find(
                (a) =>
                  a.iata.toUpperCase() === params.returnAirline!.toUpperCase()
              );

              if (airline) {
                // Fetch airline-specific pricing
                const airlineResult = await fetchAirportAirlineAvailability(
                  returnAirport.iata,
                  airline.iata,
                  booking.selectedCurrency.code
                );

                if (airlineResult.available) {
                  booking.returnAirport = returnAirport;
                  booking.returnAirline = airline; // Use full airline object with name
                  booking.returnPrice = airlineResult.price;
                  booking.returnTicketappUuid = airlineResult.ticketappUuid;
                }
              } else {
                console.warn(
                  `Airline ${params.returnAirline} not found in restricted list`
                );
              }
            } else if (!availabilityResult.restrictedToAirlines?.length) {
              // No airline restrictions - use airport directly
              booking.returnAirport = returnAirport;
              booking.returnPrice = availabilityResult.price;
              booking.returnTicketappUuid = availabilityResult.ticketappUuid;
            }
          }
        } catch (error) {
          console.error("Failed to load return airport from URL:", error);
        }
      }

      // Apply promo code if specified (after airports are loaded)
      if (params.promo && booking.departureAirport) {
        promoCodeInput = params.promo;
        // Auto-apply promo code
        await handlePromoCodeSubmit();
      }
    } catch (error) {
      console.error("Failed to initialize booking from URL:", error);
      countries = [{ code: "ES", prefix: "+34", name: "Spain" }];
      countriesLoading = false;
    }
  });
</script>

<!-- Booking Page Content -->
<div class="bg-secondary-20 flex flex-col gap-5 px-4 pt-9 pb-5 rounded-t-3xl">
  <lit-airport-select
    label="Departure"
    airlineInfo={booking.departureAirline
      ? `${booking.departureAirline.iata} ${booking.departureAirline.name}`
      : ""}
    placeholder="Select departure airport"
    selectedItem={booking.departureAirport?.display_name ||
      booking.departureAirport?.name ||
      ""}
    itemCode={booking.departureAirport?.iata || ""}
    onairport-click={() => {
      departureDrawerOpen = true;
    }}
  ></lit-airport-select>

  {#if booking.addReturnFlight}
    <lit-airport-select
      label="Return from"
      airlineInfo={booking.returnAirline
        ? `${booking.returnAirline.iata} ${booking.returnAirline.name}`
        : ""}
      placeholder="Select return airport"
      selectedItem={booking.returnAirport?.display_name ||
        booking.returnAirport?.name ||
        ""}
      itemCode={booking.returnAirport?.iata || ""}
      onairport-click={() => {
        returnDrawerOpen = true;
      }}
    ></lit-airport-select>
  {/if}

  <!-- Passenger Counter -->
  <div class="border-b border-secondary-100 pb-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <lit-button
          variant="tertiary"
          icon-only
          disabled={booking.passengerCount <= 1}
          onbutton-click={decrementPassengers}
        >
          <lit-icon icon="mdi:minus" size="24"></lit-icon>
        </lit-button>
        <div class="w-10 text-center">
          <p class="text-xl font-medium text-neutral-black leading-normal">
            {booking.passengerCount}
          </p>
        </div>
        <lit-button
          variant="tertiary"
          icon-only
          disabled={!booking.departureAirport || booking.passengerCount >= 9}
          onbutton-click={incrementPassengers}
        >
          <lit-icon icon="mdi:plus" size="24"></lit-icon>
        </lit-button>
      </div>

      <!-- Price Display -->
      <div class="flex flex-col items-end gap-1 px-2.5 relative">
        {#if hasAnyService()}
          <div
            class="flex items-baseline gap-0 transition-opacity duration-200"
            class:opacity-50={isPricingLoading}
          >
            <span class="text-2xl font-medium text-primary-500 leading-none">
              {booking.selectedCurrency.symbol}{Math.floor(totalPrice())}
            </span>
            <span
              class="text-sm font-normal text-primary-500 leading-none -translate-y-2"
            >
              {(totalPrice() % 1).toFixed(2).slice(2)}
            </span>
          </div>
          {#if booking.appliedPromoCode}
            <div class="relative flex items-baseline gap-0 leading-none">
              <span class="text-sm font-normal text-secondary-200 leading-none">
                {Math.floor(priceBeforeDiscount())}
              </span>
              <span
                class="text-[8px] font-normal text-secondary-200 leading-none -translate-y-1"
              >
                {(priceBeforeDiscount() % 1).toFixed(2).slice(2)}
              </span>
              <div
                class="absolute top-1.5 left-0 right-0 h-px bg-secondary-200"
              ></div>
            </div>
          {/if}
        {:else}
          <span
            class="text-center text-2xl leading-normal font-normal text-neutral-100"
          >
            {booking.selectedCurrency.symbol} ––
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Add Return Toggle with Promo Code -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <lit-toggle
        checked={booking.addReturnFlight}
        ontoggle-change={handleReturnFlightToggle}
      ></lit-toggle>
      <span class="text-base font-normal text-neutral-black"> Add return </span>
    </div>

    {#if booking.appliedPromoCode}
      <lit-button
        variant="tertiary"
        size="small"
        active
        onbutton-click={handleRemovePromoCode}
      >
        <span class="text-sm font-normal">
          {#if booking.discountPercentage}
            {booking.discountPercentage}% off
          {:else if booking.discountAmount > 0}
            {booking.selectedCurrency.symbol}{booking.discountAmount.toFixed(2)}
            off
          {:else}
            Promo code
          {/if}
        </span>
        <lit-icon icon="mdi:close" size="16"></lit-icon>
      </lit-button>
    {:else}
      <lit-button
        variant="tertiary"
        size="small"
        disabled={!booking.departureAirport}
        onbutton-click={handlePromoCodeClick}
      >
        Add promo code
      </lit-button>
    {/if}
  </div>
</div>

<!-- QR Code Section with Shadow -->
<div class="bg-secondary-20 flex flex-col items-center">
  <div class="flex items-center h-3.75 w-full">
    <div class="flex-1 flex items-center justify-center min-h-px min-w-px">
      <div class="w-full rotate-180">
        <div
          class="h-6.5 w-full opacity-60 bg-linear-to-b from-secondary-80 to-transparent"
        ></div>
      </div>
    </div>
  </div>
</div>

<!-- Payment Section Header -->
<div
  class="bg-secondary-20 flex flex-col gap-0 items-center justify-center px-4 py-5"
>
  <div class="flex items-center gap-4 w-full">
    <div class="flex-1 h-px bg-secondary-100"></div>
    <p
      class="text-xs font-semibold text-secondary-300 text-center uppercase tracking-wider leading-4"
    >
      PAY WITH
    </p>
    <div class="flex-1 h-px bg-secondary-100"></div>
  </div>
</div>

<!-- Payment Buttons -->
<div
  class="bg-secondary-20 flex flex-col gap-3 items-center justify-center pb-5 pt-0 px-4"
>
  <!-- Credit Card Button -->
  <lit-button
    class="w-full"
    variant="primary"
    disabled={!isBookingValid() || isProcessingPayment}
    onbutton-click={handleCreditCard}
  >
    <div class="flex gap-2">
      <span>Credit card</span>
      <img
        src="/booking/assets/payment-logos/visa-logo.png"
        alt="Visa"
        class="h-5.5 w-7.25 rounded-sm"
      />
      <img
        src="/booking/assets/payment-logos/mastercard-logo.png"
        alt="Mastercard"
        class="h-5.5 w-7.75 rounded-sm"
      />
    </div>
  </lit-button>

  <!-- Instant Checkout Buttons (3 in a row) -->
  <AlternativePaymentButtons
    disabled={!isBookingValid() || isProcessingPayment}
    amount={Math.round(totalPrice() * 100)}
    onError={handlePaymentError}
  />
</div>

<!-- Powered by Stripe -->
<div
  class="bg-secondary-20 flex items-center justify-center gap-1 px-4 pb-5 pt-0"
>
  <p class="text-xs font-medium text-secondary-300 text-center">
    Payment fees may apply. Powered by
  </p>
  <div class="h-3.5 w-9 overflow-clip relative mt-[2px]">
    <img
      src="/booking/assets/payment-logos/stripe-logo.svg"
      alt="Stripe"
      class="w-full h-full object-cover"
    />
  </div>
</div>

<!-- Departure Airport Drawer -->
<lit-drawer
  open={departureDrawerOpen}
  ondrawer-close={() => {
    departureDrawerOpen = false;
  }}
>
  <span slot="header">Select departure airport</span>
  <div slot="body">
    <AirportPicker
      selectedAirport={booking.departureAirport}
      onSelect={handleDepartureAirportSelect}
    />
  </div>
</lit-drawer>

<!-- Return Airport Drawer -->
<lit-drawer
  open={returnDrawerOpen}
  ondrawer-close={() => {
    returnDrawerOpen = false;
  }}
>
  <span slot="header">Select return airport</span>
  <div slot="body">
    <AirportPicker
      selectedAirport={booking.returnAirport}
      onSelect={handleReturnAirportSelect}
      showNearby={false}
    />
  </div>
</lit-drawer>

<!-- Departure Airline Drawer (shown when airport has airline restrictions) -->
<lit-drawer
  open={departureAirlineDrawerOpen}
  ondrawer-close={handleDepartureAirlineDrawerClose}
>
  <span slot="header">Select airline</span>
  <div slot="body">
    <AirlinePicker
      airlines={departureRestrictedAirlines}
      selectedAirline={booking.departureAirline}
      onSelect={handleDepartureAirlineSelect}
      onNotListed={handleDepartureAirlineNotListed}
      airportName={pendingDepartureAirport?.iata}
      isLoading={isAirlineLoading}
    />
  </div>
</lit-drawer>

<!-- Return Airline Drawer (shown when airport has airline restrictions) -->
<lit-drawer
  open={returnAirlineDrawerOpen}
  ondrawer-close={handleReturnAirlineDrawerClose}
>
  <span slot="header">Select airline</span>
  <div slot="body">
    <AirlinePicker
      airlines={returnRestrictedAirlines}
      selectedAirline={booking.returnAirline}
      onSelect={handleReturnAirlineSelect}
      onNotListed={handleReturnAirlineNotListed}
      airportName={pendingReturnAirport?.iata}
      isLoading={isAirlineLoading}
    />
  </div>
</lit-drawer>

<!-- Promo Code Dialog -->
<lit-dialog
  open={promoCodeDialogOpen}
  ondialog-close={() => {
    promoCodeDialogOpen = false;
    promoCodeInput = "";
    promoCodeError = null;
  }}
>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-bold text-neutral-black">Add promo code</h2>
    </div>
    <form
      class="flex flex-col gap-8"
      onsubmit={(e) => {
        e.preventDefault();
        handlePromoCodeSubmit();
      }}
    >
      <lit-text-field
        type="basic"
        value={promoCodeInput}
        placeholder="Enter promo code"
        validated={promoCodeInput.length > 0 && !promoCodeError}
        error={promoCodeError || ""}
        oninput={handlePromoCodeInputChange}
      ></lit-text-field>
      <lit-button
        variant="primary"
        size="medium"
        type="submit"
        disabled={!promoCodeInput.trim() || isPromoCodeLoading}
      >
        <span>{isPromoCodeLoading ? "Validating..." : "Apply code"}</span>
      </lit-button>
    </form>
  </div>
</lit-dialog>

<!-- Payment Verification Drawer -->
<lit-drawer open={paymentDrawerOpen} ondrawer-close={handlePaymentDrawerClose}>
  <span slot="header">
    {paymentDrawerOpen ? "Get your pass via" : "Verification"}
  </span>

  <div slot="body" class="flex flex-col p-5 pt-0">
    {#if verificationStep === 1}
      <!-- Step 1: Enter phone or email -->
      <form
        class="flex flex-col gap-8"
        onsubmit={(e) => {
          e.preventDefault();
          handleSendVerificationCode();
        }}
      >
        <!-- Tab switch for SMS/Email -->
        <lit-tab-switch
          label1="SMS"
          label2="Email"
          active-tab={deliveryMethod === "sms" ? 0 : 1}
          ontab-change={handleTabChange}
        ></lit-tab-switch>

        <!-- Input field -->
        {#if deliveryMethod === "sms"}
          <div class="flex gap-3">
            <!-- Country selector button -->
            <lit-button
              class="rounded-sm [&::part(button)]:px-3"
              variant="tertiary"
              onbutton-click={() => (showCountrySelector = true)}
            >
              <div class="rounded overflow-hidden">
                <lit-icon
                  icon="flag:{selectedCountry?.code?.toLowerCase() ?? 'es'}-4x3"
                  size="32"
                ></lit-icon>
              </div>
              <lit-icon icon="mdi:chevron-down" size="20"></lit-icon>
            </lit-button>

            <!-- Phone input -->
            <div class="flex-1">
              <lit-text-field
                type="phone-number"
                placeholder="Phone number"
                prefix={selectedCountry?.prefix ?? "+34"}
                value={phoneNumber}
                validated={phoneNumber.length > 0 &&
                  validatePhoneNumber(phoneNumber) &&
                  !phoneError}
                error={phoneError || ""}
                inputType="tel"
                maxlength={13}
                oninput={handlePhoneInput}
                onblur={handlePhoneBlur}
              ></lit-text-field>
            </div>
          </div>
        {:else}
          <lit-text-field
            type="basic"
            value={emailAddress}
            placeholder="Email address"
            validated={emailAddress.length > 0 &&
              validateEmail(emailAddress) &&
              !emailError}
            error={emailError || ""}
            inputType="email"
            oninput={handleEmailInput}
            onblur={handleEmailBlur}
          ></lit-text-field>
        {/if}

        <!-- Send button -->
        <lit-button
          class="w-full"
          variant="primary"
          type="submit"
          disabled={!isVerificationStep1Valid || isVerificationLoading}
        >
          {isVerificationLoading ? "Sending..." : "Send verification code"}
        </lit-button>
      </form>
    {:else}
      <!-- Step 2: Enter verification code -->
      <form
        class="flex flex-col gap-6"
        onsubmit={(e) => {
          e.preventDefault();
          handleVerifyCode();
        }}
      >
        <!-- Info box -->
        <div
          class="bg-white rounded-xl p-6 flex flex-col items-center gap-4 border border-secondary-100"
        >
          <p class="text-base text-neutral-black text-center">
            Please enter the code we sent to
          </p>
          <div class="flex items-center gap-2">
            <span class="text-base font-semibold text-neutral-black">
              {contactDisplay}
            </span>
            <button
              type="button"
              class="text-sm font-semibold text-primary-500 uppercase tracking-wide cursor-pointer bg-transparent border-none"
              onclick={handleChangeContact}
            >
              Change
            </button>
          </div>

          <!-- Code input -->
          <lit-text-field
            type="pin-number"
            value={verificationCode}
            placeholder="– – – –"
            maxlength={4}
            error={verificationCodeError || ""}
            oninput={handleCodeInput}
            onblur={handleCodeBlur}
          ></lit-text-field>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <lit-button
            class="flex-1"
            variant="secondary"
            type="button"
            disabled={resendTimer > 0 || isVerificationLoading}
            onbutton-click={handleResendCode}
          >
            {resendTimer > 0 ? `Resend: ${resendTimer}s` : "Resend"}
          </lit-button>
          <lit-button
            class="flex-1"
            variant="primary"
            type="submit"
            disabled={!isVerificationStep2Valid || isVerificationLoading}
          >
            {isVerificationLoading ? "Verifying..." : "Verify"}
          </lit-button>
        </div>
      </form>
    {/if}
  </div>
</lit-drawer>

<!-- Country Selector Drawer -->
<lit-drawer
  open={showCountrySelector}
  ondrawer-close={() => (showCountrySelector = false)}
>
  <span slot="header">Select country code</span>

  <div slot="body" class="flex flex-col">
    <!-- Search field -->
    <div
      class="px-5 py-3 pt-0 bg-secondary-20 border-b border-secondary-100 sticky top-0 z-10"
    >
      <lit-search-input
        size="medium"
        placeholder="Search"
        value={countrySearchQuery}
        oninput={handleCountrySearch}
      ></lit-search-input>
    </div>

    <!-- Country list -->
    <div class="flex flex-col pl-6 overflow-y-auto min-h-[60vh]">
      {#if countriesLoading}
        <div class="flex justify-center items-center py-8">
          <span class="text-neutral-300">Loading countries...</span>
        </div>
      {:else if filteredCountries.length === 0}
        <div class="flex justify-center items-center py-8">
          <span class="text-neutral-300">No countries found</span>
        </div>
      {:else}
        {#each filteredCountries as country}
          <button
            class="flex items-center gap-3 px-5 py-3 hover:bg-secondary-20 transition-colors cursor-pointer border-b border-secondary-100 bg-transparent w-full text-left hover:border-primary-500"
            onclick={() => handleCountrySelect(country)}
          >
            {#if country?.code}
              <lit-icon icon="flag:{country.code.toLowerCase()}-4x3" size="32"
              ></lit-icon>
            {/if}
            <span class="flex-1 text-base text-neutral-black">
              {@html highlightText(
                country?.name ?? "Unknown",
                countrySearchQuery
              )}
            </span>
            <span class="text-base text-neutral-400">
              {@html highlightText(country?.prefix ?? "", countrySearchQuery)}
            </span>
          </button>
        {/each}
      {/if}
    </div>
  </div>
</lit-drawer>

<!-- Toast Notification -->
<Toast message={errorMessage} show={showToast} onDismiss={dismissToast} />
