/**
 * Standard API Error class for handling HTTP errors from the ticketapp API.
 * Extends the native Error class with additional HTTP-specific properties.
 */
export class ApiError extends Error {
    public readonly name = 'ApiError';

    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly statusText: string,
        public readonly body?: unknown
    ) {
        super(message);

        // Maintains proper stack trace for where error was thrown (only in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Creates an ApiError from a failed fetch Response.
     */
    static async fromResponse(response: Response): Promise<ApiError> {
        let body: unknown;

        try {
            body = await response.json();
        } catch {
            // Response body is not JSON or empty
            body = await response.text().catch(() => null);
        }

        const message =
            typeof body === 'object' && body !== null && 'message' in body
                ? String((body as { message: unknown }).message)
                : `HTTP ${response.status}: ${response.statusText}`;

        return new ApiError(message, response.status, response.statusText, body);
    }
}
