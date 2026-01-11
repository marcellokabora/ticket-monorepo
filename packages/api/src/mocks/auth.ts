/**
 * Mock Authentication Data
 * Used for development and demo purposes without real API
 */

import type { GetTokenResponse } from '../types/auth';

/**
 * Generate a mock JWT token
 * This is NOT a real JWT, just a demo token for development
 */
function generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
        JSON.stringify({
            sub: 'demo-user',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
            iss: 'ticketapp-demo',
            demo: true,
        })
    );
    const signature = btoa('demo-signature-not-valid');

    return `${header}.${payload}.${signature}`;
}

/**
 * Get mock auth token
 * In demo mode, always returns a valid mock token
 */
export function getMockAuthToken(_request: { url: string }): GetTokenResponse {
    return {
        token: generateMockToken(),
    };
}

/**
 * Build token URL (same as real implementation)
 */
export function buildMockTokenUrl(
    requestUuid: string,
    hmac: string,
    brand: string = 'ticketapp'
): string {
    return `?request_uuid=${requestUuid}&brand=${brand}&hmac=${hmac}`;
}
