/**
 * Authentication API Endpoints (Mock Implementation)
 * Returns demo auth tokens for development and showcase purposes
 */

import type { GetTokenRequest, GetTokenResponse } from '../types/auth';
import { getMockAuthToken, buildMockTokenUrl } from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get authentication token for API requests.
 * NOTE: In demo mode, always returns a valid mock token
 */
export async function getAuthToken(request: GetTokenRequest): Promise<GetTokenResponse> {
    await delay();
    return getMockAuthToken(request);
}

/**
 * Build the token request URL string from parameters.
 */
export function buildTokenUrl(
    requestUuid: string,
    hmac: string,
    brand: string = 'ticketapp'
): string {
    return buildMockTokenUrl(requestUuid, hmac, brand);
}
