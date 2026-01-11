/**
 * Mock Verification Data
 * Used for development and demo purposes without real API
 */

import type {
    SendVerificationResponse,
    VerifyOtpResponse,
    ResendOtpResponse,
    VerificationMethod,
} from '../types/verify';

/**
 * In-memory verification sessions for demo
 */
const verificationSessions = new Map<
    string,
    {
        method: VerificationMethod;
        identifier: string; // phone or email
        otp: string;
        attempts: number;
        verified: boolean;
    }
>();

/**
 * Generate a mock session ID
 */
function generateSessionId(): string {
    return `vs-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a mock OTP (always 1234 for demo)
 */
function generateOtp(): string {
    // In demo mode, always use 1234 for easy testing
    return '1234';
}

/**
 * Send phone verification (mock)
 */
export function sendMockPhoneVerification(request: {
    number: string;
    prefix: string;
}): SendVerificationResponse {
    const sessionId = generateSessionId();
    const otp = generateOtp();

    verificationSessions.set(sessionId, {
        method: 'phone',
        identifier: `${request.prefix}${request.number}`,
        otp,
        attempts: 0,
        verified: false,
    });

    console.log(`[Demo] Phone verification OTP for ${request.prefix}${request.number}: ${otp}`);

    return {
        verificationSessionId: sessionId,
        status: 'OTP_SENT',
    };
}

/**
 * Send email verification (mock)
 */
export function sendMockEmailVerification(request: {
    email: string;
}): SendVerificationResponse {
    const sessionId = generateSessionId();
    const otp = generateOtp();

    verificationSessions.set(sessionId, {
        method: 'email',
        identifier: request.email,
        otp,
        attempts: 0,
        verified: false,
    });

    console.log(`[Demo] Email verification OTP for ${request.email}: ${otp}`);

    return {
        verificationSessionId: sessionId,
        status: 'OTP_SENT',
    };
}

/**
 * Verify OTP (mock)
 */
export function verifyMockOtp(
    _method: VerificationMethod,
    verificationSessionId: string,
    otp: string,
    requestId: string
): VerifyOtpResponse {
    const session = verificationSessions.get(verificationSessionId);

    if (!session) {
        return {
            status: 'VERIFICATION_FAILED',
            message: 'Session not found or expired',
        };
    }

    session.attempts++;

    if (session.attempts > 3) {
        verificationSessions.delete(verificationSessionId);
        return {
            status: 'VERIFICATION_FAILED',
            message: 'Too many attempts. Please request a new code.',
        };
    }

    // Accept 1234 or the generated OTP
    if (otp === session.otp || otp === '1234') {
        session.verified = true;

        return {
            status: 'SUCCESSFULLY_VERIFIED',
            data: {
                validation_params: [
                    { key: 'request_id', value: requestId },
                    { key: 'session_id', value: verificationSessionId },
                    { key: 'verified', value: 'true' },
                    { key: 'timestamp', value: Date.now().toString() },
                ],
            },
        };
    }

    return {
        status: 'VERIFICATION_FAILED',
        message: `Invalid code. ${3 - session.attempts} attempts remaining.`,
    };
}

/**
 * Resend OTP (mock)
 */
export function resendMockOtp(
    _method: VerificationMethod,
    verificationSessionId: string
): ResendOtpResponse {
    const session = verificationSessions.get(verificationSessionId);

    if (!session) {
        return {
            status: 'RESEND_FAILED',
            message: 'Session not found or expired',
        };
    }

    // Reset attempts and generate new OTP
    session.attempts = 0;
    session.otp = generateOtp();

    console.log(`[Demo] Resent OTP for ${session.identifier}: ${session.otp}`);

    return {
        status: 'OTP_RESENT',
        message: 'A new code has been sent',
    };
}
