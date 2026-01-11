/**
 * Mock Data Exports
 * Central export for all mock data and functions
 */

// Airport mocks
export {
    MOCK_POPULAR_AIRPORTS,
    MOCK_ALL_AIRPORTS,
    searchMockAirports,
    getMockAirportByIata,
    getMockNearestAirports,
} from './airports';

// Currency mocks
export {
    MOCK_CURRENCIES,
    MOCK_EXCHANGE_RATES,
    calculateMockFee,
    convertPrice,
} from './currencies';

// Availability mocks
export { getMockAvailability, getMockAvailabilityByAirline } from './availability';

// Country mocks
export { MOCK_COUNTRIES } from './countries';

// Trip mocks
export {
    createMockTrip,
    addMockRequestsToTrip,
    getMockTrip,
    getMockTripBookingStatus,
} from './trips';

// Verification mocks
export {
    sendMockPhoneVerification,
    sendMockEmailVerification,
    verifyMockOtp,
    resendMockOtp,
} from './verification';

// Auth mocks
export { getMockAuthToken, buildMockTokenUrl } from './auth';

// Discount mocks
export {
    applyMockDiscount,
    removeMockDiscount,
    getAppliedDiscount,
} from './discount';
