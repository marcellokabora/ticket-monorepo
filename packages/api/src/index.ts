// Endpoints
export { getCurrencies, getFeeForPrice, searchAirports, getPopularAirports, getNearestAirports, getAirportByIata, getAvailability, getAvailabilityByAirline, getCountries } from './endpoints';
export { createTrip, addRequestsToTrip, getTrip, getTripBookingStatus } from './endpoints';
export { applyDiscount, removeDiscount, getCoupons } from './endpoints';
export { sendPhoneVerification, sendEmailVerification, verifyOtp, resendOtp } from './endpoints';
export { getAuthToken, buildTokenUrl } from './endpoints';

// Types
export type { Currency, ApiResponse, Airport, AirportTerminal, AirportWithDistance, ServicePass, Pricing, PricingDetail, AvailabilityResponse, AvailabilityQuery, RestrictedAirline, Country } from './types';
export type { Airline } from './types/airline';
export type { FeeRequest, FeeResponse } from './endpoints';
export type { ApplyDiscountRequest, ApplyDiscountResponse, Coupon, GetCouponsResponse } from './endpoints';
export type { ContactInfo, PaymentMethod, BookingData, TicketData } from './types/booking';
export type {
    TripItinerary,
    TripBookingInfo,
    TripServiceInfo,
    TripCustomer,
    TripRequestItem,
    CreateTripRequest,
    AddRequestsToTripRequest,
    ServiceRequest,
    Trip,
    TripResponse,
    Transaction,
    Booking,
    BookingStatusItem,
    BookingStatusResponse,
    TripState,
} from './types/trip';
export type {
    VerifyMemberPhoneRequest,
    VerifyMemberEmailRequest,
    SendVerificationResponse,
    VerifyOtpResponse,
    ResendOtpResponse,
    VerificationMethod,
    VerificationStatus,
    ValidationParam,
} from './types/verify';
export type { GetTokenRequest, GetTokenResponse } from './types/auth';

// Errors
export { ApiError } from './errors';

// Mock data (for demo/testing purposes)
export {
    MOCK_POPULAR_AIRPORTS,
    MOCK_ALL_AIRPORTS,
    MOCK_CURRENCIES,
    MOCK_COUNTRIES,
} from './mocks';
