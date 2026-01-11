/**
 * Authentication API Types
 * Types for token-based authentication
 */

/**
 * Request to get authentication token
 */
export interface GetTokenRequest {
    /** The full URL with query parameters including hmac, brand, request_uuid */
    url: string;
}

/**
 * Response from authentication token endpoint
 */
export interface GetTokenResponse {
    /** JWT token for authentication */
    token: string;
}
