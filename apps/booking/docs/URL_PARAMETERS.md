# URL Parameter Synchronization

The booking page now supports URL parameters for all booking information, making bookings shareable and bookmarkable.

## Supported Parameters

| Parameter          | Type    | Description                            | Example  |
| ------------------ | ------- | -------------------------------------- | -------- |
| `departure`        | string  | Departure airport IATA code            | `BCN`    |
| `departureAirline` | string  | Departure airline IATA code (optional) | `VY`     |
| `return`           | string  | Return airport IATA code               | `MAD`    |
| `returnAirline`    | string  | Return airline IATA code (optional)    | `IB`     |
| `passengers`       | number  | Number of passengers (1-9)             | `2`      |
| `promo`            | string  | Promo code to apply                    | `SUMMER` |
| `addReturn`        | boolean | Enable return flight                   | `true`   |

## Example URLs

### Basic booking (departure only)

```
/booking?departure=BCN&passengers=2
```

### Round trip booking

```
/booking?departure=BCN&return=MAD&passengers=2&addReturn=true
```

### Complete booking with promo code

```
/booking?departure=BCN&return=MAD&passengers=2&addReturn=true&promo=SUMMER
```

### Booking with airline restrictions

```
/booking?departure=BCN&departureAirline=VY&return=MAD&returnAirline=IB&passengers=2&addReturn=true
```

## Features

### Automatic URL Sync

The URL updates automatically as you:

- Select/change airports
- Select/change airlines
- Adjust passenger count
- Toggle return flight
- Apply/remove promo codes

### Shareable Links

Copy the URL at any point to share your booking configuration with others. When they open the link:

- Airports are loaded and validated
- Prices are fetched from the API
- Promo codes are automatically applied
- All selections are restored

### State Persistence

- URL state survives page refresh
- Users can bookmark specific booking configurations
- Back/forward browser navigation works correctly

## Implementation Details

### URL Synchronization (`url-sync.ts`)

- `buildBookingURL()` - Converts booking state to URL parameters
- `syncURLWithBooking()` - Updates browser URL without navigation (uses `replaceState`)
- `parseBookingURL()` - Parses URL search parameters

### Page Load (`+page.ts`)

- Extracts URL parameters on page load
- Returns typed `BookingPageParams` object

### Initialization (`+page.svelte`)

- Loads airports from URL on mount
- Fetches availability and pricing from API
- Applies promo codes automatically
- Uses `$effect` for automatic URL sync on state changes

### Debouncing

URL updates are debounced (100ms) to avoid excessive history pollution.

## Testing

### Manual Testing

1. Navigate to `/booking?departure=BCN&passengers=2`
2. Verify Barcelona airport is pre-selected with 2 passengers
3. Change passenger count - URL should update
4. Add return flight - URL should include `addReturn=true`
5. Copy URL and paste in new tab - state should be restored

### Development Mode

Use the fake promo code `1234` for testing:

```
/booking?departure=BCN&promo=1234
```

### Error Handling

- Invalid airport codes are silently ignored
- Invalid passenger counts are clamped to 1-9
- Failed API calls don't break the page
- Missing/unavailable airports show user-friendly errors
