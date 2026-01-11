/**
 * Service availability and pricing types.
 * These types represent the service pass/priority access system.
 */

/**
 * Pricing detail for a specific currency
 * Note: local pricing may have null values when currency matches default
 */
export interface PricingDetail {
    price: number | null;
    children_price: number | null;
    currency: {
        code: string | null;
        symbol: string | null;
    };
}

/**
 * Complete pricing information for a ServicePass
 * Note: Use local price if available, otherwise fallback to default price
 */
export interface Pricing {
    children_age_limit: number | null;
    infant_age_limit: number | null;
    default: PricingDetail;
    local: PricingDetail;
    vat_number: string | null;
}

/**
 * ServicePass data including pricing
 */
export interface ServicePass {
    uuid: string;
    pricing: Pricing;
}

/**
 * Basic airline data for restricted airlines list
 */
export interface RestrictedAirline {
    /** IATA airline code (e.g., 'BA', 'KL') */
    iata: string;
    /** ICAO airline code */
    icao?: string;
    /** Full airline name */
    name: string;
}

/**
 * Response from the availability endpoint
 */
export interface AvailabilityResponse {
    available: boolean;
    servicepass: ServicePass | null;
    available_only_via_airlines?: boolean;
    /** List of airlines that are allowed to use ServicePass at this airport.
     * If empty, all airlines are allowed. If populated, user MUST select one. */
    restricted_to_airlines?: RestrictedAirline[];
}

/**
 * Query options for availability request
 */
export interface AvailabilityQuery {
    currency_code?: string;
}
