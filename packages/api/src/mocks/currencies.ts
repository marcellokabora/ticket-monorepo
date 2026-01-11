/**
 * Mock Currency Data
 * Used for development and demo purposes without real API
 */

import type { Currency } from '../types';

/**
 * Available currencies for demo
 */
export const MOCK_CURRENCIES: Currency[] = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
];

/**
 * Mock exchange rates (relative to EUR)
 */
export const MOCK_EXCHANGE_RATES: Record<string, number> = {
    EUR: 1.0,
    USD: 1.08,
    GBP: 0.85,
    CHF: 0.95,
    CAD: 1.47,
    AUD: 1.65,
    JPY: 162.5,
    CNY: 7.8,
    INR: 90.2,
    SGD: 1.45,
    HKD: 8.45,
    NZD: 1.78,
    SEK: 11.4,
    NOK: 11.6,
    DKK: 7.45,
    PLN: 4.32,
    CZK: 25.2,
    HUF: 392.5,
    TRY: 35.2,
    AED: 3.97,
    SAR: 4.05,
    MXN: 18.5,
    BRL: 5.35,
    ZAR: 20.1,
    THB: 38.5,
    MYR: 5.1,
    PHP: 60.2,
    IDR: 17050,
    KRW: 1420,
    TWD: 34.2,
};

/**
 * Fee percentage for transactions (4%)
 */
const FEE_PERCENTAGE = 0.04;

/**
 * Calculate fee for a given amount
 */
export function calculateMockFee(currencyCode: string, amount: number) {
    const fee = Math.round(amount * FEE_PERCENTAGE * 100) / 100;
    return {
        currency_code: currencyCode,
        amount,
        fee,
        total_amount: Math.round((amount + fee) * 100) / 100,
    };
}

/**
 * Convert price from EUR to target currency
 */
export function convertPrice(eurAmount: number, targetCurrency: string): number {
    const rate = MOCK_EXCHANGE_RATES[targetCurrency] || 1;
    return Math.round(eurAmount * rate * 100) / 100;
}
