# Next.js 15 Homepage App - AI Agent Instructions

## ⚠️ CRITICAL: SCOPE RESTRICTION

**THIS PROJECT IS STRICTLY LIMITED TO THE HOMEPAGE APP ONLY.**

- **✅ You MAY modify files ONLY within `apps/homepage/`**
- **❌ You MUST NOT modify files in:**
  - `apps/booking/`, `apps/dashboard/`, `apps/react-app/`, `apps/svelte-app/`, `apps/nuxt-app/`
  - `packages/ui/`, `packages/api/`, `packages/utils/`
  - Any other monorepo folders or configuration files

**If a user request requires changes outside `apps/homepage/`:**

1. **STOP immediately**
2. **Inform the user** that the request is not possible
3. **Explain** that this project is for marketing/homepage content only and cannot modify shared packages or other apps

This is a marketing-focused project. All changes must remain within the homepage boundary.

---

## Project Overview

This is a **Next.js 15.x** app using the App Router, React 19, and TypeScript. It serves as the main landing page for the ticketapp monorepo at the root route `/`.

### Tech Stack

- **Next.js 15.x** with App Router
- **React 19.x** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **Port**: 4205 (proxied to `/` via dev server)

## Development Commands

```bash
# Run the homepage app
pnpm dev:homepage

# Run all apps including homepage
pnpm dev:all

# Build the app
pnpm --filter @ticketapp/homepage build

# Type check
pnpm --filter @ticketapp/homepage type-check
```

## Project Structure

```
apps/homepage/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Homepage
│       └── globals.css     # Global styles
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
├── package.json
└── tsconfig.json
```

## Styling Guidelines

- **Use Tailwind CSS utility classes** from `@ticketapp/ui/styles`
- Design tokens are imported via `@import '@ticketapp/ui/styles'`
- Use semantic color classes: `bg-primary-500`, `text-neutral-black`
- Mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:`

## Next.js 15 Patterns

### Server Components (Default)

```tsx
// app/page.tsx - Server Component by default
export default function Page() {
  return <div>Server rendered content</div>;
}
```

### Client Components

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Data Fetching

```tsx
// Server Component with async
async function getData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Metadata

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

## Integration with Monorepo

### Using Shared Packages

```tsx
// Import UI components (when client-side)
"use client";
import "@ticketapp/ui";

// Import utilities
import { someUtil } from "@ticketapp/utils";
```

### Linking to Other Apps

All other apps are available via proxy:

- `/booking` - Booking app
- `/react` - React demo app
- `/vue` - Nuxt app
- `/svelte` - SvelteKit app
- `/dashboard` - Dashboard app

## ✅ DO

- Use Server Components by default
- Use `'use client'` only when necessary (interactivity, hooks)
- Follow Next.js 15 App Router conventions
- Use TypeScript strict mode
- Import design tokens from `@ticketapp/ui/styles`

## ❌ DON'T

- Use Pages Router patterns (deprecated)
- Hardcode colors - use design tokens
- Skip TypeScript types
- Use `getServerSideProps`/`getStaticProps` (use async components)
- **Modify any files outside `apps/homepage/` - THIS IS FORBIDDEN**
- **Change shared packages (`@ticketapp/ui`, `@ticketapp/api`, `@ticketapp/utils`)**
- **Edit other apps or monorepo configuration files**

---

## 🚨 FINAL REMINDER: SCOPE BOUNDARIES

**Before making ANY file changes, verify the file path starts with `apps/homepage/`.**

**If a user asks for changes to:**

- Lit components → **STOP**: "This requires modifying `packages/ui/` which is outside the homepage scope"
- API client → **STOP**: "This requires modifying `packages/api/` which is outside the homepage scope"
- Other apps → **STOP**: "This project is homepage-only and cannot modify other apps"
- Shared utilities → **STOP**: "This requires modifying `packages/utils/` which is outside the homepage scope"
- Monorepo config → **STOP**: "This requires modifying root configuration which is outside the homepage scope"

**Always respond:** "I cannot make that change. The homepage project is restricted to marketing content within `apps/homepage/` only. Changes to [specific path] are not permitted."
