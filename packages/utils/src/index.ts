export { PersistentStore, counterStore } from './lib/store';
export { detectUserCountryCode, detectUserCountry, type CountryInfo, type LocationData } from './lib/location';
export {
    createTripFromBooking,
    addReturnFlightToTrip,
    saveBookingToTrip,
    loadTripByUuid,
    type CreateTripParams,
    type AddReturnFlightParams,
    type SaveTripParams,
    type SaveTripResult
} from './lib/trip';
export {
    fetchAirportAvailability,
    fetchAirportAirlineAvailability,
    fetchAirportPricing,
    fetchAirportAirlinePricing,
    type AvailabilityResult
} from './lib/pricing';
export {
    bookingStore,
    defaultBookingState,
    resetBookingState,
    updateBookingFields,
    isBookingReadyForPayment,
    calculateTotalPrice,
    calculatePriceBeforeDiscount,
    type BookingStateData
} from './lib/booking';
