/**
 * Verification API Endpoints (Mock Implementation)
 * Returns demo verification data for development and showcase purposes
 * 
 * NOTE: For demo purposes, always use OTP code "1234" to verify
 */

import type {
    VerifyMemberPhoneRequest,
    VerifyMemberEmailRequest,
    SendVerificationResponse,
    VerifyOtpResponse,
    ResendOtpResponse,
    VerificationMethod,
} from '../types/verify';
import {
    sendMockPhoneVerification,
    sendMockEmailVerification,
    verifyMockOtp,
    resendMockOtp,
} from '../mocks';

/**
 * Simulate network delay for realistic behavior
 */
function delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send SMS verification code to user's phone.
 * NOTE: In demo mode, the OTP is always "1234"
 */
export async function sendPhoneVerification(
    request: VerifyMemberPhoneRequest
): Promise<SendVerificationResponse> {
    await delay();
    return sendMockPhoneVerification(request);
}

/**
 * Send Email verification code to user's email.
 * NOTE: In demo mode, the OTP is always "1234"
 */
export async function sendEmailVerification(
    request: VerifyMemberEmailRequest
): Promise<SendVerificationResponse> {
    await delay();
    return sendMockEmailVerification(request);
}

/**
 * Verify OTP (PIN code) entered by user.
 * NOTE: In demo mode, use OTP "1234" to successfully verify
 */
export async function verifyOtp(
    method: VerificationMethod,
    verificationSessionId: string,
    otp: string,
    requestId: string
): Promise<VerifyOtpResponse> {
    await delay();
    return verifyMockOtp(method, verificationSessionId, otp, requestId);
}

/**
 * Resend OTP if user didn't receive it.
 */
export async function resendOtp(
    method: VerificationMethod,
    verificationSessionId: string
): Promise<ResendOtpResponse> {
    await delay();
    return resendMockOtp(method, verificationSessionId);
}
