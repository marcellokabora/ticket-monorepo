/**
 * Terminal information for an airport
 */
export interface AirportTerminal {
    name: string;
    code?: string;
    short_name?: string;
    has_service_lane?: boolean;
}

/**
 * Airport data as returned from the ticketapp API
 */
export interface Airport {
    name: string;
    display_name?: string;
    city: string;
    city_region_country?: string;
    country?: string;
    country_code?: string;
    iata: string;
    icao?: string;
    timezone?: string;
    iana_timezone?: string;
    latitude?: string;
    longitude?: string;
    has_service_lane?: boolean;
    terminal?: AirportTerminal;
    terminals?: AirportTerminal[];
}

/**
 * Airport with calculated distance from user's position
 */
export interface AirportWithDistance extends Airport {
    distance: number; // Distance in kilometers
}
