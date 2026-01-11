import type { PageLoad } from './$types';

export interface BookingPageParams {
    departure?: string; // Airport IATA code
    return?: string; // Airport IATA code
    passengers?: number;
    promo?: string;
    addReturn?: boolean;
    departureAirline?: string; // Airline IATA code
    returnAirline?: string; // Airline IATA code
}

/**
 * Load function to extract booking parameters from URL
 * These parameters make the booking state shareable and bookmarkable
 * 
 * Example URL: /booking?departure=BCN&return=MAD&passengers=2&promo=SUMMER&addReturn=true
 */
export const load: PageLoad = ({ url }) => {
    const searchParams = url.searchParams;

    const params: BookingPageParams = {
        departure: searchParams.get('departure') || undefined,
        return: searchParams.get('return') || undefined,
        passengers: searchParams.get('passengers')
            ? parseInt(searchParams.get('passengers')!, 10)
            : undefined,
        promo: searchParams.get('promo') || undefined,
        addReturn: searchParams.get('addReturn') === 'true',
        departureAirline: searchParams.get('departureAirline') || undefined,
        returnAirline: searchParams.get('returnAirline') || undefined,
    };

    return {
        bookingParams: params,
    };
};
