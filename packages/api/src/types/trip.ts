/**
 * Trip API Types
 * Based on ticketapp Trip & Booking API
 */

// ============================================
// Request Types
// ============================================

export interface TripItinerary {
    departure_airport: { iata: string };
    arrival_airport?: { iata: string }; // Optional for one-way bookings
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TripBookingInfo {
    // API v1.2 requires booking to be present but empty
}

export interface TripServiceInfo {
    uuid: string;
    provider: { uuid: string };
}

export interface TripCustomer {
    brand: string;
    email?: string;
    phone?: {
        prefix: string;
        number: string;
    };
}

export interface TripRequestItem {
    itinerary: TripItinerary;
    customer: TripCustomer;
    booking: TripBookingInfo;
    source: 'ticketapp-application-web' | 'ticketapp-application-mobile' | 'api-v1.1' | 'api-v1.2';
}

export interface CreateTripRequest {
    requests: TripRequestItem[];
    member?: { uuid: string };
}

export interface AddRequestsToTripRequest {
    requests: TripRequestItem[];
}

// ============================================
// Response Types
// ============================================

export interface ServiceRequest {
    uuid: string;
    itinerary: TripItinerary;
    booking: {
        uuid: string;
        number_of_passengers: number;
        currency: { code: string };
        local_price: number;
        status?: string;
    };
    servicepass: TripServiceInfo;
    departure_date: string;
    flight_number?: string;
    airline?: { iata: string };
    source: string;
}

export interface Trip {
    uuid: string;
    requests: ServiceRequest[];
    completed: boolean;
    member?: { uuid: string };
}

export interface TripResponse {
    data: Trip;
}

// ============================================
// Booking Status Types
// ============================================

export interface Transaction {
    uuid: string;
    amount: number;
    currency: { code: string };
    status: string;
    payment_method?: string;
    created_at?: string;
}

export interface Booking {
    uuid: string;
    status: string;
    total_amount?: number;
    currency?: { code: string };
}

export interface BookingStatusItem {
    request: ServiceRequest;
    booking: Booking;
    transactions: Transaction[];
    disclaimer?: string;
}

export interface BookingStatusResponse {
    data: BookingStatusItem[];
}

// ============================================
// Simplified Trip State (for app storage)
// ============================================

export interface TripState {
    tripUuid: string | null;
    requestIds: string[];
    departureRequestId: string | null;
    returnRequestId: string | null;
}
