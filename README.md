# Ticket App Monorepo

A modern monorepo containing multiple frontend applications and shared packages for a comprehensive ticket booking system, powered by [TurboRepo](https://turbo.build/repo) and [pnpm workspaces](https://pnpm.io/workspaces).

## 🏗️ Structure

```
ticket-monorepo/
├── apps/
│   ├── booking/           # ✈️ Main booking app (SvelteKit + Svelte 5)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── (booking)/      # Booking flow pages
│   │   │   │   ├── activation/     # OTP verification
│   │   │   │   ├── confirmation/   # Booking confirmation
│   │   │   │   └── api/           # API endpoints (Stripe)
│   │   │   ├── lib/
│   │   │   │   ├── components/     # Svelte components
│   │   │   │   ├── state/          # Svelte 5 runes state
│   │   │   │   ├── stores/         # Store re-exports
│   │   │   │   └── stripe/         # Stripe integration
│   │   │   └── docs/               # API documentation
│   │   └── static/assets/          # Static assets (QR codes, payment logos)
│   ├── dashboard/         # 📊 Dashboard app (Svelte 5 + Vite)
│   └── homepage/          # 🏠 Landing page (Next.js 15)
├── packages/
│   ├── ui/                # 🎨 Lit web components library (mobile-first design system)
│   │   ├── src/lib/                # Component implementations
│   │   ├── src/styles/             # Design tokens & Tailwind config
│   │   └── .storybook/             # Storybook configuration
│   ├── api/               # 🌐 API client with Zod validation
│   │   ├── src/endpoints/          # API endpoint functions
│   │   ├── src/types/              # TypeScript types
│   │   ├── src/client/             # HTTP client
│   │   └── src/config/             # Environment configuration
│   └── utils/             # 🔧 Shared utilities (stores, calculations, helpers)
│       └── src/lib/                # Pricing, trip, booking logic
├── servers/
│   └── dev-server.js      # 🔌 Unified development proxy server
├── package.json           # Root workspace configuration
├── turbo.json             # TurboRepo pipeline configuration
├── pnpm-workspace.yaml    # pnpm workspace definition
└── tsconfig.base.json     # Shared TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9.15.0

### Installation

```bash
# Install all dependencies across all packages
pnpm install
```

### Development

#### Unified Development Server (Recommended)

Run all apps through a single proxy server at `http://localhost:5000`:

```bash
pnpm dev:all
```

This starts:

- **Homepage** at `http://localhost:5000/` (Next.js, port 4205)
- **Booking** at `http://localhost:5000/booking/` (SvelteKit, port 4202)
- **Dashboard** at `http://localhost:5000/dashboard/` (Svelte, port 4203)

#### Individual Apps

```bash
# Main apps
pnpm dev:booking          # Booking app only
pnpm dev:dashboard        # Dashboard app only
pnpm dev:homepage         # Homepage app only

# Development proxy server only
pnpm dev:server

# Storybook (UI components)
pnpm storybook            # http://localhost:6006
```

### Build

```bash
# Build everything (packages first, then apps)
pnpm build

# Build only apps
pnpm build:apps

# Build only packages
pnpm build:packages
```

### Other Commands

```bash
# Lint all packages
pnpm lint

# Run tests
pnpm test

# Type check
pnpm type-check

# Clean all build artifacts and node_modules
pnpm clean

# Publish Figma Code Connect
pnpm figma:publish
```

## 📦 Packages

### @ticketapp/ui

Mobile-first Lit web components library with Tailwind CSS styling and Storybook documentation.

**Features:**

- Shadow DOM components
- CSS design tokens
- Storybook stories
- Figma Code Connect integration
- Full TypeScript support

```ts
import "@ticketapp/ui";

// Use components as custom elements
<lit-button variant="primary" size="medium">Book Now</lit-button>
<lit-toggle checked></lit-toggle>
<lit-search-input placeholder="Search airports..."></lit-search-input>
```

**Design System:**

- Import styles: `import "@ticketapp/ui/styles/tailwind.css";`
- Tokens available in `@ticketapp/ui/styles/tokens.css`

### @ticketapp/api

Type-safe API client with Zod validation for the Ticket App backend.

**Features:**

- Environment variable validation
- HTTP client with error handling
- Typed endpoints for airports, trips, availability, payments
- Zod schemas for request/response validation

```ts
import {
  searchAirports,
  createTrip,
  getAvailability,
  type Airport,
  type Trip,
} from "@ticketapp/api";

// Search airports
const airports = await searchAirports({ term: "LHR" });

// Create a trip
const trip = await createTrip({
  currencyId: "USD",
  passengers: 2,
});
```

**Environment Variables:**

```bash
VITE_API_BASE_URI=https://api.example.com
VITE_APP_AUTH_TOKEN=your_token_here
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### @ticketapp/utils

Shared utilities including state management, pricing calculations, and trip logic.

**Features:**

- `PersistentStore` base class for localStorage-backed state
- Complex pricing calculations (dual-endpoint strategy)
- Trip booking logic
- Geolocation helpers

```ts
import {
  bookingStore,
  calculatePrice,
  fetchAirportAvailability,
  getNearestLocation,
} from "@ticketapp/utils";

// Access booking state
const booking = bookingStore.get();

// Calculate pricing
const price = await calculatePrice({
  airportId: "LHR",
  currencyId: "USD",
  passengers: 2,
});
```

## 🏛️ Architecture

### TurboRepo Features

- **Caching**: Build outputs are cached for faster subsequent builds
- **Parallel execution**: Independent tasks run in parallel
- **Dependency awareness**: Packages are built in topological order (`^build`)

### Base Paths

Each app runs on a different port but is unified through the dev server proxy:

| App       | Dev Port | Base Path    | Proxy Path                         |
| --------- | -------- | ------------ | ---------------------------------- |
| Homepage  | 4205     | `/`          | `http://localhost:5000/`           |
| Booking   | 4202     | `/booking`   | `http://localhost:5000/booking/`   |
| Dashboard | 4203     | `/dashboard` | `http://localhost:5000/dashboard/` |

### Technology Stack

| App/Package   | Framework/Library      | Purpose                        |
| ------------- | ---------------------- | ------------------------------ |
| **booking**   | SvelteKit 2 + Svelte 5 | Main booking application       |
| **dashboard** | Svelte 5 + Vite        | Dashboard/admin interface      |
| **homepage**  | Next.js 15 + React 19  | Marketing/landing page         |
| **ui**        | Lit 3 + Tailwind CSS   | Mobile-first component library |
| **api**       | TypeScript + Zod       | Type-safe API client           |
| **utils**     | TypeScript             | Shared utilities & state       |

### Key Patterns

**Svelte 5 Runes (booking app):**

```ts
// State management with runes
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log("Count changed:", count);
});
```

**Shared Packages:**

```json
{
  "dependencies": {
    "@ticketapp/ui": "workspace:*",
    "@ticketapp/api": "workspace:*",
    "@ticketapp/utils": "workspace:*"
  }
}
```

## 📚 Documentation

- **Booking App**: [apps/booking/.github/copilot-instructions.md](apps/booking/.github/copilot-instructions.md)
- **Homepage**: [apps/homepage/.github/copilot-instructions.md](apps/homepage/.github/copilot-instructions.md)
- **UI Components**: [packages/ui/.github/copilot-instructions.md](packages/ui/.github/copilot-instructions.md)
- **API Documentation**: [apps/booking/docs/TRIP_BOOKING_API_DOCUMENTATION.md](apps/booking/docs/TRIP_BOOKING_API_DOCUMENTATION.md)
- **Payment Integration**: [apps/booking/docs/PAYMENT_INTEGRATION_GUIDE.md](apps/booking/docs/PAYMENT_INTEGRATION_GUIDE.md)
- **Root Guidelines**: [.github/copilot-instructions.md](.github/copilot-instructions.md)

## License

Private
