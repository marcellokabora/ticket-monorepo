# Airport Selection & Airline Validation Flow for Fast Track

This document describes the complete flow for selecting an airport and validating airline eligibility before adding a trip for Fast Track ticket validation. This is essential because Fast Track services are tied to specific airports and, in some cases, restricted to specific airlines (tenants).

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Concepts](#core-concepts)
4. [API Endpoints](#api-endpoints)
5. [Flow Diagrams](#flow-diagrams)
6. [Data Types](#data-types)
7. [Implementation Steps](#implementation-steps)
8. [Code Examples](#code-examples)

---

## Overview

Before creating a Fast Track trip, the system must:

1. **Select an Airport** - User selects departure (or return) airport
2. **Check Fast Track Availability** - Verify if the airport offers Fast Track services
3. **Validate Airline Restrictions** - Some airports restrict Fast Track to specific airlines (tenants)
4. **Get Airline-Specific Availability** - If restricted, user must select from eligible airlines
5. **Fetch Provider Information** - Get the Fast Track operator/provider for the airport

### Why This Matters

- **Airline Tenants**: Some airports have Fast Track services operated by or restricted to specific airlines
- **Ticket Validation**: The Fast Track pass must be validated against the airline ticket
- **Processing Methods**: Different airlines have different fulfillment methods (via airport, airline, or provider)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                     │
│  ┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────┐   │
│  │ Airport     │────▶│ Airline Selector │────▶│ Confirm & Create Trip   │   │
│  │ Search Box  │     │ (if restricted)  │     │                         │   │
│  └─────────────┘     └──────────────────┘     └─────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
           │                    │                         │
           ▼                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                          │
│  ┌─────────────────┐  ┌────────────────────────────┐  ┌───────────────────┐ │
│  │ /availability/  │  │ /availability/{airport}/   │  │ /trip             │ │
│  │ {airportCode}   │  │ {airlineCode}              │  │                   │ │
│  └─────────────────┘  └────────────────────────────┘  └───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
           │                    │                         │
           ▼                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES                                     │
│  ┌─────────────────┐  ┌────────────────────────────┐  ┌───────────────────┐ │
│  │ Fast Track      │  │ Airline Tenant             │  │ Booking           │ │
│  │ Availability    │  │ Validation                 │  │ Service           │ │
│  └─────────────────┘  └────────────────────────────┘  └───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Airport Data Structure

```typescript
interface AirportData {
  iata?: string           // IATA code (e.g., "LHR", "JFK")
  icao?: string           // ICAO code
  name?: string           // Full airport name
  display_name?: string   // Display-friendly name
  city?: string           // City name
  city_region_country?: string
  country?: CountryData
  terminals?: TerminalData[]
  timezone?: string
  iana_timezone?: string
  coordinates?: CoordinatesData
  proximity?: number
  distance?: number
}
```

### 2. Airline Data Structure

```typescript
interface AirlineData {
  iata?: string           // IATA code (e.g., "BA", "AA")
  icao?: string           // ICAO code
  name?: string           // Full airline name
  hours_checkin_opens_before_departure?: number
  web_checkin?: string
}
```

### 3. Fast Track Availability Response

```typescript
interface AvailabilityResponse {
  available: boolean                    // Is Fast Track available at this airport?
  Priority Pass: Priority Pass                  // Fast Track details
  issuing_datetime: IssuingDateTime
  requested: RequestedData
  resources: Resources
  restricted_to_airlines: AirlineData[] // KEY: List of allowed airlines (if restricted)
}
```

### 4. Processing Methods

The `processing_method` indicates how the Fast Track pass will be fulfilled:

```typescript
const PROCESSING_METHOD = {
  REGULAR: 'regular',                         // Standard processing
  RAISE_ELIGIBILITY: 'raise_eligibility',     // Requires eligibility check
  FULFILLMENT_VIA_AIRPORT: 'fulfillment_via_airport',   // Airport handles fulfillment
  FULFILLMENT_VIA_AIRLINE: 'fulfillment_via_airline',   // Airline handles fulfillment (needs PNR)
  FULFILLMENT_VIA_PROVIDER: 'fulfillment_via_provider', // Third-party provider
}
```

---

## API Endpoints

### 1. Check Airport Availability

```
GET /availability/{airportCode}
```

**Purpose**: Check if Fast Track is available at the specified airport.

**Parameters**:
- `airportCode` (path): Airport IATA code (e.g., "LHR")

**Query Parameters**:
- `departure_terminal?`: Terminal name
- `departure_datetime_local?`: Local departure datetime
- `flight_number?`: Flight number
- `brand?`: Brand identifier
- `country_iso?`: User's country ISO code
- `source`: Request source ("Priority Pass-application-web" or "Priority Pass-application-mobile")

**Response**:
```json
{
  "data": {
    "available": true,
    "Priority Pass": {
      "pricing": { ... },
      "airport": { "iata": "LHR", ... },
      "airline": { ... },
      "lane_operating_hours": { "open": "05:00", "close": "22:00" },
      "requirements": { ... },
      "service_name": "Fast Track Security",
      "purchase_window": { ... },
      "processing_method": {
        "id": 1,
        "name": "regular",
        "needs_fulfillment": false
      }
    },
    "restricted_to_airlines": [
      { "iata": "BA", "icao": "BAW", "name": "British Airways" },
      { "iata": "VS", "icao": "VIR", "name": "Virgin Atlantic" }
    ]
  }
}
```

**Key Logic**:
- If `restricted_to_airlines` is **empty**, Fast Track is available for ALL airlines
- If `restricted_to_airlines` has items, user MUST select one of these airlines

---

### 2. Get Availability by Airport AND Airline

```
GET /availability/{airportCode}/{airlineCode}
```

**Purpose**: Get Fast Track availability for a specific airport-airline combination.

**Parameters**:
- `airportCode` (path): Airport IATA code
- `airlineCode` (path): Airline IATA code

**Query Parameters**:
- Same as `/availability/{airportCode}`

**Response**: Same structure as above, but tailored to the specific airline.

**When to Use**:
- After user selects an airline from `restricted_to_airlines`
- To get airline-specific pricing and requirements

---

### 3. Get Airport Fast Track Provider

```
GET /Priority Pass/{airportIata}/provider
```

**Purpose**: Get the Fast Track operator/provider name for an airport.

**Response**:
```json
{
  "data": {
    "name": "Airport Security Services Ltd"
  }
}
```

---

### 4. Search Airports

```
GET /base-data/airports/search
```

**Purpose**: Search for airports by name, city, or IATA code.

**Query Parameters**:
- `q`: Search query (city name, airport name)
- `airport`: Specific airport IATA code
- `length`: Maximum results (default: 10)

---

### 5. Get Nearby Airports

```
GET /base-data/airports/nearest/{latitude}/{longitude}
```

**Purpose**: Find airports near given coordinates.

**Query Parameters**:
- `only_ft_available`: Filter to only airports with Fast Track

---

### 6. Get Popular Airports

```
GET /base-data/airports/popular
```

**Purpose**: Get list of popular airports for quick selection.

---

## Flow Diagrams

### Main Flow: Airport Selection → Airline Validation → Trip Creation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FAST TRACK BOOKING FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

  User                          Application                         API
   │                                │                                 │
   │  1. Search/Select Airport      │                                 │
   │───────────────────────────────▶│                                 │
   │                                │  2. Check Availability          │
   │                                │────────────────────────────────▶│
   │                                │                                 │
   │                                │◀────────────────────────────────│
   │                                │  3. Response with               │
   │                                │     - available: true/false     │
   │                                │     - restricted_to_airlines[]  │
   │                                │                                 │
   │◀───────────────────────────────│                                 │
   │  4a. If NOT available:         │                                 │
   │      Show "Unavailable" modal  │                                 │
   │                                │                                 │
   │  4b. If available AND          │                                 │
   │      restricted_to_airlines    │                                 │
   │      is EMPTY:                 │                                 │
   │      ─────▶ Continue to trip   │                                 │
   │             creation           │                                 │
   │                                │                                 │
   │  4c. If available AND          │                                 │
   │      restricted_to_airlines    │                                 │
   │      is NOT EMPTY:             │                                 │
   │      ─────▶ Show Airline       │                                 │
   │             Selector           │                                 │
   │                                │                                 │
   │  5. User selects airline       │                                 │
   │───────────────────────────────▶│                                 │
   │                                │  6. Get Airline-Specific        │
   │                                │     Availability                │
   │                                │────────────────────────────────▶│
   │                                │                                 │
   │                                │◀────────────────────────────────│
   │                                │  7. Response with               │
   │                                │     airline-specific details    │
   │                                │                                 │
   │◀───────────────────────────────│                                 │
   │  8. Show confirmation &        │                                 │
   │     Continue to trip creation  │                                 │
   │                                │                                 │
   │  9. User confirms trip         │                                 │
   │───────────────────────────────▶│                                 │
   │                                │  10. Create Trip Request        │
   │                                │────────────────────────────────▶│
   │                                │                                 │
   │                                │◀────────────────────────────────│
   │◀───────────────────────────────│  11. Trip Created              │
   │  12. Proceed to payment        │                                 │
   │                                │                                 │
```

### Decision Flow for Airline Restriction

```
                    ┌─────────────────────────────┐
                    │   Check Airport Availability │
                    │   GET /availability/{IATA}   │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │      available: true?        │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                   NO                          YES
                    │                           │
                    ▼                           ▼
        ┌──────────────────┐      ┌─────────────────────────────┐
        │ Show "Fast Track │      │  restricted_to_airlines     │
        │ Not Available"   │      │  has items?                 │
        │ Modal            │      └─────────────┬───────────────┘
        └──────────────────┘                    │
                                  ┌─────────────┴─────────────┐
                                  │                           │
                                 NO                          YES
                                  │                           │
                                  ▼                           ▼
                    ┌─────────────────────┐     ┌─────────────────────────┐
                    │ Continue without    │     │ Show Airline Selector   │
                    │ airline selection   │     │ Drawer                  │
                    │                     │     │ - Display airline list  │
                    │ selectedAirline =   │     │ - User must choose      │
                    │ null                │     └───────────┬─────────────┘
                    └─────────────────────┘                 │
                                  │                         ▼
                                  │           ┌─────────────────────────┐
                                  │           │ User selects airline    │
                                  │           │ from restricted list    │
                                  │           └───────────┬─────────────┘
                                  │                       │
                                  │                       ▼
                                  │           ┌─────────────────────────┐
                                  │           │ GET /availability/      │
                                  │           │ {airport}/{airline}     │
                                  │           └───────────┬─────────────┘
                                  │                       │
                                  └───────────┬───────────┘
                                              │
                                              ▼
                                ┌─────────────────────────────┐
                                │   Continue to Trip Creation  │
                                │   with selected airport &    │
                                │   airline (if any)           │
                                └─────────────────────────────┘
```

---

## Data Types

### Complete Type Definitions

```typescript
// === AIRPORT ===
interface AirportData {
  iata?: string
  icao?: string
  name?: string
  display_name?: string
  city?: string
  city_region_country?: string
  country?: CountryData
  terminals?: TerminalData[]
  timezone?: string
  iana_timezone?: string
  coordinates?: CoordinatesData
  proximity?: number
  distance?: number
}

interface TerminalData {
  short_name?: string
  name?: string
  has_Priority Pass_lane?: boolean
  Priority Pass_lanes?: Priority PassLaneDetails[]
}

// === AIRLINE ===
interface AirlineData {
  iata?: string
  icao?: string
  name?: string
  hours_checkin_opens_before_departure?: number
  web_checkin?: string
}

// === FAST TRACK ===
interface Priority Pass {
  pricing: Pricing
  airport: AirportData
  airline: AirlineData
  lane_operating_hours: LaneOperatingHours
  requirements: Requirements
  service_name: string
  purchase_window: {
    purchase_close_days: number | null
    purchase_close_minutes: number | null
    processing_additional_minutes: number | null
    purchase_open_minutes: number | null
  }
  processing_method: {
    id: number
    name: PROCESSING_METHOD | ''
    needs_fulfillment: boolean
  }
}

interface LaneOperatingHours {
  open: string | null   // e.g., "05:00"
  close: string | null  // e.g., "22:00"
}

// === API RESPONSES ===
interface AvailabilityResponse {
  available: boolean
  Priority Pass: Priority Pass
  issuing_datetime: IssuingDateTime
  requested: RequestedData
  resources: Resources
  restricted_to_airlines: AirlineData[]
}

interface RequestedData {
  departure_terminal: string
  departure_datetime_local: string
  flight_number: string
  brand: string
  airport_code: string
  airline_code: string
}

// === QUERY PARAMETERS ===
interface AvailabilityPriority PassParams {
  departure_terminal?: string
  departure_datetime_local?: string
  flight_number?: string
  brand?: string
  airport_code?: string
  utm_currency?: string
  utm_price?: string
  country_iso?: string
}

interface AvailabilityByAirportAndAirlineCodeParams {
  departure_terminal?: string
  departure_datetime_local?: string
  flight_number?: string
  brand?: string
  source?: string
}
```

---

## Implementation Steps

### Step 1: Search and Select Airport

```typescript
// 1. User types in search box
const searchQuery = ref('')

// 2. Fetch airports matching query
async function fetchAirports(query: string) {
  if (query.length < 2) return []
  
  const params = { q: query, length: 10 }
  const { data } = await baseDataApi.search(params)
  return data ?? []
}

// 3. Or get airports by coordinates
async function fetchNearbyAirports(coordinates: CoordinatesData) {
  const { data } = await baseDataApi.nearestAirports(coordinates, { 
    onlyAvailable: true 
  })
  return data ?? []
}
```

### Step 2: Check Fast Track Availability

```typescript
async function checkPriority PassAvailability(airport: AirportData): Promise<AvailabilityResponse | null> {
  if (!airport?.iata) {
    console.error('No IATA code available')
    return null
  }

  try {
    // Get user's location for country_iso
    const locationInfo = await fetchUserLocation()
    
    const queryParams = {
      country_iso: locationInfo.countryCode,
      source: 'Priority Pass-application-web'
    }

    const { data } = await Priority PassApi.availability(airport.iata, { query: queryParams })
    return data ?? null
  } catch (error) {
    console.error('Error checking availability:', error)
    return null
  }
}
```

### Step 3: Handle Airline Restrictions

```typescript
async function handleAirportSelection(airport: AirportData) {
  const availabilityResponse = await checkPriority PassAvailability(airport)
  
  if (!availabilityResponse) {
    showErrorModal('Unable to check availability')
    return
  }

  if (!availabilityResponse.available) {
    // Fast Track NOT available at this airport
    showUnavailableModal(airport)
    return
  }

  // Check for airline restrictions
  const restrictedAirlines = availabilityResponse.restricted_to_airlines
  
  if (restrictedAirlines && restrictedAirlines.length > 0) {
    // IMPORTANT: This airport requires airline selection
    // User must fly with one of these airlines to use Fast Track
    showAirlineSelectorDrawer(restrictedAirlines)
  } else {
    // No restrictions - continue with any airline
    proceedToTripCreation(airport, null, availabilityResponse)
  }
}
```

### Step 4: User Selects Airline (if restricted)

```typescript
async function onAirlineSelected(airline: AirlineData) {
  // Get availability specifically for this airport + airline combination
  const { data } = await Priority PassApi.getAvailabilityByAirportAndAirlineCode({
    airportCode: selectedAirport.iata,
    airlineCode: airline.iata,
    query: queryParams
  })

  if (data?.available) {
    // Store selected airline
    selectedAirline.value = airline
    
    // Continue to trip creation with this airline
    proceedToTripCreation(selectedAirport, airline, data)
  } else {
    showErrorModal('Fast Track not available for this airline')
  }
}
```

### Step 5: Check Processing Method

```typescript
function getProcessingRequirements(Priority Pass: Priority Pass): ProcessingRequirements {
  const processingMethod = Priority Pass.processing_method
  
  return {
    // Does this Fast Track need fulfillment (manual processing)?
    needsFulfillment: processingMethod.needs_fulfillment,
    
    // Is it fulfilled via the airline? (requires booking PNR code)
    requiresBookingCode: 
      processingMethod.needs_fulfillment && 
      processingMethod.name === 'fulfillment_via_airline',
    
    // Processing type for UI decisions
    type: processingMethod.name
  }
}

// Example usage:
const requirements = getProcessingRequirements(Priority Pass)
if (requirements.requiresBookingCode) {
  // Show booking code input (PNR) for airline verification
  showBookingCodeDrawer()
}
```

### Step 6: Create Trip Request

```typescript
interface TripRequestData {
  airport: AirportData
  airline: AirlineData | null
  Priority Pass: Priority Pass
  passengers: number
  departureDate: string
  flightNumber?: string
}

async function createTrip(data: TripRequestData) {
  const requestBody = {
    requests: [{
      itinerary: {
        departure_airport: { iata: data.airport.iata },
        arrival_airport: { iata: '' },  // Can be empty or populated
        airline: data.airline ? { iata: data.airline.iata } : undefined,
        departure_datetime: { local: data.departureDate },
        flight_number: data.flightNumber
      },
      booking: {
        number_of_passengers: data.passengers,
        currency: { code: data.Priority Pass.pricing.local.currency.code },
        local_price: data.Priority Pass.pricing.local.price
      },
      Priority Pass: {
        uuid: data.Priority Pass.uuid,
        provider: { uuid: data.Priority Pass.provider?.uuid }
      },
      source: 'Priority Pass-application-web'
    }]
  }

  const { data: tripData } = await tripApi.createTrip(requestBody)
  return tripData
}
```

---

## Code Examples

### Complete Implementation Example

```typescript
// composables/usePriority PassBooking.ts

export function usePriority PassBooking() {
  // State
  const selectedAirport = ref<AirportData>()
  const selectedAirline = ref<AirlineData | null>(null)
  const Priority Pass = ref<Priority Pass>()
  const restrictedAirlines = ref<AirlineData[]>([])
  const isLoading = ref(false)
  const isAirlineSelectorVisible = ref(false)

  // Check availability when airport is selected
  async function selectAirport(airport: AirportData) {
    isLoading.value = true
    
    try {
      const { data } = await Priority PassApi.availability(airport.iata!, {
        query: { country_iso: await getUserCountryIso() }
      })

      if (!data?.available) {
        throw new Error('Fast Track not available at this airport')
      }

      selectedAirport.value = airport
      Priority Pass.value = data.Priority Pass
      
      // Check for airline restrictions
      if (data.restricted_to_airlines?.length > 0) {
        restrictedAirlines.value = data.restricted_to_airlines
        isAirlineSelectorVisible.value = true
        return { requiresAirlineSelection: true }
      }

      // No restrictions
      selectedAirline.value = null
      return { requiresAirlineSelection: false }
      
    } catch (error) {
      console.error('Error selecting airport:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Handle airline selection from restricted list
  async function selectAirline(airline: AirlineData) {
    if (!selectedAirport.value?.iata) {
      throw new Error('No airport selected')
    }

    isLoading.value = true
    
    try {
      const { data } = await Priority PassApi.getAvailabilityByAirportAndAirlineCode({
        airportCode: selectedAirport.value.iata,
        airlineCode: airline.iata!,
        query: { country_iso: await getUserCountryIso() }
      })

      if (!data?.available) {
        throw new Error('Fast Track not available for this airline')
      }

      selectedAirline.value = airline
      Priority Pass.value = data.Priority Pass
      isAirlineSelectorVisible.value = false
      
      return { success: true }
      
    } catch (error) {
      console.error('Error selecting airline:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Get provider name for display
  async function getProviderName(airportIata: string): Promise<string | undefined> {
    try {
      const { data } = await Priority PassApi.getAirportPriority PassProvider(airportIata)
      return data?.name
    } catch {
      return undefined
    }
  }

  // Check if booking code is required
  const requiresBookingCode = computed(() => {
    if (!Priority Pass.value) return false
    const pm = Priority Pass.value.processing_method
    return pm.needs_fulfillment && pm.name === 'fulfillment_via_airline'
  })

  return {
    // State
    selectedAirport,
    selectedAirline,
    Priority Pass,
    restrictedAirlines,
    isLoading,
    isAirlineSelectorVisible,
    requiresBookingCode,
    
    // Actions
    selectAirport,
    selectAirline,
    getProviderName
  }
}
```

### API Service Example

```typescript
// api/Priority Pass.ts

const API_BASE = '/api/v1'

export const Priority PassApi = {
  // Check availability at airport
  availability: (
    airportCode: string, 
    options?: { query?: AvailabilityPriority PassParams }
  ) => {
    return GET<ApiResponse<AvailabilityResponse>>(
      `${API_BASE}/availability/${airportCode}`,
      { query: options?.query }
    )
  },

  // Check availability for specific airport + airline
  getAvailabilityByAirportAndAirlineCode: ({
    airportCode,
    airlineCode,
    query
  }: {
    airportCode: string
    airlineCode: string
    query?: AvailabilityByAirportAndAirlineCodeParams
  }) => {
    return GET<ApiResponse<AvailabilityResponse>>(
      `${API_BASE}/availability/${airportCode}/${airlineCode}`,
      { query }
    )
  },

  // Get Fast Track provider/operator
  getAirportPriority PassProvider: (airportIata: string) => {
    return GET<ApiResponse<{ name: string }>>(
      `${API_BASE}/Priority Pass/${airportIata}/provider`
    )
  },

  // Get availability by coordinates (nearest airport)
  getAvailabilityByCoordinates: (coordinates: CoordinatesData) => {
    return GET<ApiResponse<AvailabilityResponse>>(
      `${API_BASE}/availability/coordinates/${coordinates.latitude}/${coordinates.longitude}`
    )
  }
}
```

---

## Summary

### Key Points for Implementation

1. **Always check `restricted_to_airlines`** in the availability response
2. If empty → proceed with any airline
3. If has items → show airline picker, user MUST select one
4. After airline selection → call `/availability/{airport}/{airline}` for specific pricing
5. Check `processing_method.needs_fulfillment` to know if booking code (PNR) is required
6. The `processing_method.name` indicates WHO handles the fulfillment (airport, airline, or provider)

### Validation Checklist

- [ ] Airport has IATA code
- [ ] Availability response shows `available: true`
- [ ] If `restricted_to_airlines` has items, user selected one
- [ ] If `processing_method.needs_fulfillment` is true, collect required data (PNR)
- [ ] Store both airport AND airline (if applicable) for trip creation
