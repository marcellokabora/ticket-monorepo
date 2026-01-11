# Lit Components Library

A collection of reusable Web Components built with Lit and styled with Tailwind-inspired inline styles.

## Features

✅ **Framework-agnostic** - Works with React, Vue, Angular, Svelte, and vanilla JavaScript  
✅ **Lit-powered** - Lightweight and fast Web Components  
✅ **Tailwind-inspired** - Familiar utility-based styling compiled into components  
✅ **TypeScript** - Full type safety and IntelliSense  
✅ **Shadow DOM** - Encapsulated styles that won't conflict
✅ **7000+ Icons** - Iconify integration with Material Design Icons

## 🎨 View Components in Storybook

Run the interactive component showcase:

```bash
pnpm storybook
```

Open `http://localhost:6006` to explore all components with live examples and controls.

## Components

### 🆕 LitIcon - Icon Component

A flexible icon component powered by Iconify with **7000+ Material Design Icons** included.

#### Quick Start

```html
<lit-icon icon="mdi:home" size="24px"></lit-icon>
<lit-icon icon="mdi:heart" size="32px" color="red"></lit-icon>
<lit-icon icon="mdi:arrow-right" rotate="90"></lit-icon>
```

#### Properties

- `icon` (string) - Icon name in format "collection:name" (e.g., "mdi:home")
- `size` (string) - Icon size: "24px", "2em", etc. (default: "24px")
- `color` (string) - Any CSS color value (default: "currentColor")

#### Popular Icons

Browse all icons at [icon-sets.iconify.design/mdi](https://icon-sets.iconify.design/mdi/)

Common examples:

- Navigation: `mdi:home`, `mdi:menu`, `mdi:arrow-left`, `mdi:chevron-right`
- Actions: `mdi:plus`, `mdi:edit`, `mdi:delete`, `mdi:check`, `mdi:close`, `mdi:search`
- Social: `mdi:heart`, `mdi:star`, `mdi:share`, `mdi:bookmark`
- Communication: `mdi:email`, `mdi:phone`, `mdi:message`
- User: `mdi:account`, `mdi:login`, `mdi:logout`

📖 **[Complete Icon Documentation →](./ICON-USAGE.md)**

---

### LitHeader

A navigation header component with links to different app frameworks.

#### Usage

```html
<!-- Basic usage with default URLs -->
<lit-header-microfrontend></lit-header-microfrontend>

<!-- Custom URLs -->
<lit-header-microfrontend
  react-url="http://localhost:4200/react"
  vue-url="http://localhost:4200/vue"
  svelte-url="http://localhost:4200/svelte"
>
</lit-header-microfrontend>
```

#### Properties

- `react-url` (string) - URL for the React app (default: '/react')
- `vue-url` (string) - URL for the Vue app (default: '/vue')
- `svelte-url` (string) - URL for the Svelte app (default: '/svelte')

#### Events

- `nav-click` - Fired when a navigation link is clicked with `detail: { app: string, url: string }`

---

### LitButton

A customizable button component with multiple variants and sizes.

#### Usage

```html
<!-- Basic usage -->
<lit-button label="Click me"></lit-button>

<!-- With variants -->
<lit-button label="Primary" variant="primary"></lit-button>
<lit-button label="Secondary" variant="secondary"></lit-button>
<lit-button label="Success" variant="success"></lit-button>
<lit-button label="Danger" variant="danger"></lit-button>

<!-- Different sizes -->
<lit-button label="Small" size="sm"></lit-button>
<lit-button label="Medium" size="md"></lit-button>
<lit-button label="Large" size="lg"></lit-button>

<!-- Disabled state -->
<lit-button label="Disabled" disabled></lit-button>
```

#### Properties

- `label` (string) - Button text
- `variant` ('primary' | 'secondary' | 'success' | 'danger') - Button style
- `size` ('sm' | 'md' | 'lg') - Button size
- `disabled` (boolean) - Disable the button

#### Events

- `button-click` - Fired when the button is clicked

#### Example in Different Frameworks

**Vue/Nuxt:**

```html
<template>
  <lit-button label="Click me" variant="primary" @button-click="handleClick" />
</template>

<script setup>
  import "@ticketapp/ui";

  const handleClick = (e) => {
    // Handle button click
  };
</script>
```

**Svelte:**

```html
<script>
  import "@ticketapp/ui";

  function handleClick(e) {
    // Handle button click
  }
</script>

<lit-button label="Click me" variant="primary" onbutton-click="{handleClick}" />
```

**Vanilla HTML:**

```html
<script type="module">
  import "@ticketapp/ui";

  document.querySelector("lit-button").addEventListener("button-click", (e) => {
    // Handle button click
  });
</script>

<lit-button label="Click me" variant="primary"></lit-button>
```

## Development

```bash
# Build the library
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```
