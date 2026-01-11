# Ticket App Monorepo - AI Agent Instructions

## Architecture Overview

This is a **TurboRepo-powered pnpm monorepo** with multiple frontend apps sharing common packages. Each app runs on different ports but is unified through a central dev server proxy at port 5000.

### Repository Structure

- **apps/**: Multiple framework apps (Svelte, React, Nuxt, SvelteKit, Next.js)
  - `homepage/` - Next.js 15 app serving root path (port 4205, proxy: `/`)
  - `booking/` - Svelte 5 app with complex pricing logic (port 4202, proxy: `/booking`)
  - `dashboard/` - Svelte app (port 4203, proxy: `/dashboard`)
  - `svelte-app/` - SvelteKit 2.x app (port 4201, proxy: `/svelte`)
  - `react-app/` - React 19.x + Vite (port 4304, proxy: `/react`)
  - `nuxt-app/` - Nuxt 4.x (port 4200, proxy: `/vue`)
- **packages/**: Shared libraries
  - `ui/` - Lit web components library (mobile-first design system)
  - `api/` - Ticket App API client with Zod validation
  - `store/` - Shared state management (PersistentStore pattern)

### Critical Context Files

Each app and package contains `.github/copilot-instructions.md` with framework-specific guidelines:

- [packages/ui/.github/copilot-instructions.md](../packages/ui/.github/copilot-instructions.md) - Lit components (MOBILE-FIRST, strict CSS variable rules)
- [apps/booking/.github/copilot-instructions.md](../apps/booking/.github/copilot-instructions.md) - Svelte 5 runes system
- [apps/booking/docs/PRICE_CALCULATION_DOCUMENTATION.md](../apps/booking/docs/PRICE_CALCULATION_DOCUMENTATION.md) - Complex pricing with dual endpoints

## Development Workflows

### Starting Development

```bash
# All apps in parallel + proxy server
pnpm dev:all

# Specific apps (useful for focused work)
pnpm dev:booking   # or dev:dashboard, dev:nuxt, dev:react, dev:svelte

# UI library in watch mode (auto-rebuilds on changes)
pnpm --filter @ticketapp/ui dev

# Storybook for UI components
pnpm storybook
```

**Critical**: Apps have Vite `base` paths configured (`/booking`, `/react`, etc.). The `servers/dev-server.js` proxies these paths to individual app ports, enabling unified development at `http://localhost:5000`.

### Building and Testing

```bash
# Build everything (Turbo handles dependencies)
pnpm build

# Build only apps or packages (topological order)
pnpm build:apps
pnpm build:packages

# Lint, test, type-check across all packages
pnpm lint
pnpm test
pnpm type-check
```

**TurboRepo caching**: Build outputs are cached. Tasks with `^build` dependency ensure packages build before apps.

### Workspace Dependencies

Use `workspace:*` in package.json for internal dependencies:

```json
{
  "dependencies": {
    "@ticketapp/ui": "workspace:*",
    "@ticketapp/api": "workspace:*"
  }
}
```

## Project-Specific Conventions

### Shared Packages Usage

**@ticketapp/ui (Lit Components)**

- Import the entire library: `import "@ticketapp/ui";`
- Components register globally, use as `<lit-button>`, `<lit-toggle>`, etc.
- **CRITICAL**: Components use CSS variables from `styles/tokens.css` - NO hardcoded values, NO fallback values in `var(--token)` syntax
- Storybook stories use Tailwind utilities, NOT inline styles
- Mobile-first: 44x44px touch targets, NO hover-dependent interactions

**@ticketapp/api**

- Requires env vars: `VITE_API_BASE_URI`, `VITE_APP_AUTH_TOKEN` (validated with Zod)
- Config cached in `getEnvConfig()` - clear with `clearEnvCache()` in tests
- Exports: endpoints, types, errors (`ApiError`), HTTP client

**@ticketapp/utils**

- Shared utilities: stores, calculations, and reusable functionality
- `PersistentStore` base class for localStorage-backed state
- `counterStore` example implementation
- See apps for usage patterns (Svelte runes, React hooks)

### TypeScript Configuration

- `tsconfig.base.json` - Shared strict config for all packages
- Each package extends base with specific needs (`moduleResolution: "bundler"`)
- `strict: true`, `noUnusedLocals`, `noUnusedParameters` enforced

### Framework-Specific Patterns

**Svelte 5 (booking app)**

- Use runes: `$state()`, `$derived()`, `$effect()`, `$props()`, `$bindable()`
- NO legacy stores - migrate to runes for reactivity
- Component files: `<script lang="ts">` at top

**Lit Components (ui package)**

- Every component needs: `.ts`, `.stories.ts`, optional `.figma.ts`
- Three required stories: Playground, All States/Variations, In Context
- Shadow DOM styling with CSS variables only

### Environment Variables

Apps using `@ticketapp/api` need `.env.local`:

```bash
VITE_API_BASE_URI=https://api.example.com
VITE_APP_AUTH_TOKEN=your_token_here
```

Listed in `turbo.json` globalEnv for cache invalidation.

## Common Patterns & Anti-Patterns

### ✅ DO

- Run `pnpm dev:all` to test cross-app integration
- Use TypeScript strict mode - all packages enforce it
- Import shared types from `@ticketapp/api` (`Currency`, `Airport`, `Ticket App`)
- Check TurboRepo cache with `turbo run build --dry-run`
- Reference component docs in `.github/copilot-instructions.md` for each package

### ❌ DON'T

- Use `npm` or `yarn` - this is a **pnpm-only** workspace
- Hardcode API URLs - use `getEnvConfig()` from `@ticketapp/api`
- Use fallback values in CSS variables (`var(--token, fallback)`) in ui package
- Import relative paths across packages - use workspace aliases (`@ticketapp/*`)
- Modify `turbo.json` tasks without understanding dependency graph (`^build`)

## Key Files Reference

- [turbo.json](../turbo.json) - Pipeline configuration, caching, env vars
- [pnpm-workspace.yaml](../pnpm-workspace.yaml) - Workspace definition
- [tsconfig.base.json](../tsconfig.base.json) - Shared TypeScript config
- [servers/dev-server.js](../servers/dev-server.js) - Vite proxy server for unified development
- [packages/api/src/config/env.ts](../packages/api/src/config/env.ts) - Environment validation with Zod
- [packages/ui/src/styles/tokens.css](../packages/ui/src/styles/tokens.css) - Design system tokens (source of truth)
