/**
 * Airline data types for the ticketapp API
 */

/**
 * Basic airline data as returned from the ticketapp API
 */
export interface Airline {
    /** IATA airline code (e.g., 'BA', 'KL', 'VS') */
    iata: string;
    /** ICAO airline code (e.g., 'BAW', 'KLM', 'VIR') */
    icao?: string;
    /** Full airline name (e.g., 'British Airways') */
    name: string;
    /** Hours before departure when check-in opens */
    hours_checkin_opens_before_departure?: number;
    /** Web check-in URL */
    web_checkin?: string;
}
