/**
 * Verification API Types
 * Types for SMS/Email OTP verification flow
 */

/**
 * Request to send SMS verification code
 */
export interface VerifyMemberPhoneRequest {
    /** Phone number without country code (e.g., "612345678") */
    number: string;
    /** Country code (e.g., "+34", "34") */
    prefix: string;
}

/**
 * Request to send Email verification code
 */
export interface VerifyMemberEmailRequest {
    /** User's email address */
    email: string;
}

/**
 * Verification status values
 */
export type VerificationStatus =
    | 'OTP_SENT'
    | 'OTP_RESENT'
    | 'SUCCESSFULLY_VERIFIED'
    | 'ALREADY_VERIFIED'
    | 'VERIFICATION_FAILED'
    | 'RESEND_FAILED'
    | 'ERROR';

/**
 * Response from sending verification code (SMS or Email)
 */
export interface SendVerificationResponse {
    message?: string;
    status: VerificationStatus;
    /** IMPORTANT: Save this for OTP verification */
    verificationSessionId: string;
}

/**
 * Key-value pair for validation params returned after successful verification
 */
export interface ValidationParam {
    /** Parameter name (e.g., 'uuid_booking_group', 'hmac', 'currency') */
    key: string;
    /** Parameter value */
    value: string;
}

/**
 * Response from verifying OTP
 */
export interface VerifyOtpResponse {
    message?: string;
    status: VerificationStatus;
    data?: {
        /** Parameters needed to construct the payment URL */
        validation_params?: ValidationParam[];
    };
}

/**
 * Response from resending OTP
 */
export interface ResendOtpResponse {
    message?: string;
    status: 'OTP_RESENT' | 'RESEND_FAILED';
}

/**
 * Verification method type
 */
export type VerificationMethod = 'phone' | 'email';
