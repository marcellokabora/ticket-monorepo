/**
 * Coupon/Promo Code Management
 * 
 * NOTE: This is a mock implementation. The real API endpoint doesn't exist yet.
 * In development mode, this returns fake data for testing.
 */

/**
 * Represents a promotional coupon code
 */
export interface Coupon {
    code: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    active: boolean;
}

/**
 * Response from fetching available coupons
 */
export interface GetCouponsResponse {
    coupons: Coupon[];
}

/**
 * Fetches available coupon codes
 * 
 * NOTE: This is a mock endpoint that returns fake data in development.
 * The real ticketapp API endpoint doesn't exist yet.
 * 
 * @returns Promise resolving to list of available coupons
 * @throws {ApiError} When the API request fails
 * 
 * @example
 * ```typescript
 * import { getCoupons } from '@ticketapp/api';
 * 
 * const response = await getCoupons();
 * // { coupons: [{ code: 'SUMMER10', description: '10% off', ... }] }
 * ```
 */
export async function getCoupons(): Promise<GetCouponsResponse> {
    // TODO: Replace with real API call when endpoint is available
    // const response = await httpClient<GetCouponsResponse>('/coupons', {
    //     method: 'GET',
    // });
    // return response.data;

    // Mock data for development
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                coupons: [
                    {
                        code: 'WELCOME10',
                        description: '10% off your first booking',
                        discount_type: 'percentage',
                        discount_value: 10,
                        active: true,
                    },
                    {
                        code: 'SUMMER20',
                        description: '20% off summer bookings',
                        discount_type: 'percentage',
                        discount_value: 20,
                        active: true,
                    },
                    {
                        code: 'FASTPASS',
                        description: '€5 off any booking',
                        discount_type: 'fixed',
                        discount_value: 5,
                        active: true,
                    },
                    {
                        code: 'FAMILY25',
                        description: '25% off for families (3+ passengers)',
                        discount_type: 'percentage',
                        discount_value: 25,
                        active: true,
                    },
                    {
                        code: 'EARLYBIRD',
                        description: '15% off early bookings',
                        discount_type: 'percentage',
                        discount_value: 15,
                        active: true,
                    },
                ],
            });
        }, 300); // Simulate network delay
    });
}
