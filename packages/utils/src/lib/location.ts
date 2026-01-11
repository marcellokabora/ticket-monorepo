/**
 * Location utilities for detecting user's country and region
 */

export interface CountryInfo {
  code: string;
  prefix: string;
  name: string;
}

export interface LocationData {
  country_code: string;
  country_name: string;
  city?: string;
  region?: string;
}

/**
 * Detects the user's country based on their IP address using ipapi.co
 * 
 * @returns Promise with country code (e.g., "DE", "ES", "US") or null if detection fails
 * 
 * @example
 * ```typescript
 * const countryCode = await detectUserCountryCode();
 * console.log(countryCode); // "DE" for Germany
 * ```
 */
export async function detectUserCountryCode(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to detect location');
    }

    const data: LocationData = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.warn('Failed to detect user country:', error);
    return null;
  }
}

/**
 * Detects the user's country and matches it against a list of available countries
 * 
 * @param countries - Array of country objects with code, prefix, and name
 * @param fallbackCode - Country code to use if detection fails (default: "ES")
 * @returns Promise with the matched country object
 * 
 * @example
 * ```typescript
 * const countries = await getCountries();
 * const userCountry = await detectUserCountry(countries);
 * console.log(userCountry); // { code: "DE", prefix: "+49", name: "Germany" }
 * ```
 */
export async function detectUserCountry<T extends CountryInfo>(
  countries: T[],
  fallbackCode: string = 'ES'
): Promise<T> {
  const detectedCode = await detectUserCountryCode();

  if (detectedCode) {
    const matchedCountry = countries.find((c) => c.code === detectedCode);
    if (matchedCountry) {
      console.log('✅ Detected country:', matchedCountry.name);
      return matchedCountry;
    }
  }

  // Fallback to provided code or default Spain
  const fallbackCountry = countries.find((c) => c.code === fallbackCode);
  if (fallbackCountry) {
    console.log('ℹ️ Using fallback country:', fallbackCountry.name);
    return fallbackCountry;
  }

  // Last resort: return first country
  return countries[0];
}
