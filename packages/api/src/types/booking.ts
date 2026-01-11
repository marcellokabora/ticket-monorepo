import type { Currency } from './currency';
import type { Airport } from './airport';

export type ContactInfo = {
    method: 'sms' | 'email';
    value: string;
};

export type PaymentMethod = 'credit_card' | 'apple_pay' | 'paypal' | 'google_pay';

export interface BookingData {
    departureAirport: Airport;
    returnAirport?: Airport;
    addReturnFlight: boolean;
    passengerCount: number;
    totalPrice: number;
    currency: Currency;
    promoCode?: string;
    // Pricing breakdown
    departurePrice: number;
    returnPrice: number;
}

export interface TicketData extends BookingData {
    transactionId: string;
    contact: ContactInfo;
    paymentMethod: PaymentMethod;
    bookedAt: Date;
}
