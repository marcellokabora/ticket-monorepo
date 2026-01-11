# Agent Guidelines for Lit Components Library

This document provides guidelines for AI agents working on the `lit-components` library to ensure consistency, quality, and best practices.

## 🎯 Core Principles

### 1. 📱 Mobile-First Library (CRITICAL)

**This library is EXCLUSIVELY for mobile applications.**

- ✅ **Touch-optimized**: Minimum 44x44px touch targets, tap/swipe/long-press interactions
- ✅ **Mobile viewports**: 375px-428px width in stories
- ✅ **Mobile components**: Buttons, toggles, bottom sheets, modals, cards, navigation bars, form inputs
- ❌ **NO desktop patterns**: No dropdowns, hover menus, multi-column layouts, hover tooltips, desktop sidebars
- ❌ **NO hover-dependent**: Hover states are progressive enhancement only, never required

### 2. 🎨 Styling Rules (CRITICAL)

**Components maintain design system consistency. Stories demonstrate usage.**

- **Components (.ts files)**: CSS variables from `styles/tokens.css` ONLY - NO hardcoded values
- **Stories (.stories.ts files)**: Tailwind utility classes ONLY - NO inline styles
- **Missing tokens?** Add to `styles/tokens.css` first, then use the new token
- **🚫 NEVER EVER use fallback values** like `var(--gap, 16px)` or `var(--button-size-md, 52px)`
  - ❌ WRONG: `var(--color-primary-300, #a0eb78)`
  - ❌ WRONG: `var(--button-border-radius, var(--border-radius-full))`
  - ✅ CORRECT: `var(--color-primary-300)`
  - ✅ CORRECT: `var(--button-border-radius)`
  - **If the variable doesn't exist, add it to `styles/tokens.css` first**
  - **This ensures design system integrity and prevents inconsistencies**

### 3. 📖 Required Stories (every component)

1. **Playground** - Interactive story with all controls
2. **All States/Variations** - Visual showcase in mobile viewport
3. **In Context** - Show component WITH other lit-components (lit-button, lit-icon, lit-toggle) in realistic mobile contexts AND event handling

## Component Creation Guidelines

### File Structure

Every new component should include these files:

```
src/lib/
  ├── lit-component-name.ts          # Main component
  ├── lit-component-name.stories.ts  # Storybook stories
  └── lit-component-name.figma.ts    # Figma Code Connect (optional)
```

### Component Template

````typescript
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Component description
 *
 * @element lit-component-name
 *
 * @attr {string} variant - Description
 * @attr {boolean} disabled - Description
 *
 * @fires component-event - Description
 *
 * @csspart part-name - Description
 *
 * @cssprop --custom-property - Description
 *
 * @example
 * ```html
 * <lit-component-name variant="primary"></lit-component-name>
 * ```
 */
@customElement("lit-component-name")
export class LitComponentName extends LitElement {
  @property({ type: String }) variant = "default";
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }
    /* Use CSS custom properties from design-tokens */
  `;

  render() {
    return html`
      <div part="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-component-name": LitComponentName;
  }
}
````

### Best Practices

✅ **DO:**

- Use semantic HTML elements
- Follow naming conventions (`lit-*`)
- Include proper TypeScript types
- Add ARIA attributes for accessibility
- Use `@property()` decorator for reactive properties
- Export component in `src/index.ts`
- Support touch gestures where appropriate
- Demonstrate component compositions in stories

❌ **DON'T:**

- Use external dependencies unless necessary
- Create inline styles in component template literals (use CSS in `static styles` instead)
- Skip accessibility attributes
- Duplicate colors - reuse existing tokens

---

## Storybook Stories Guidelines

### Required Stories

Every component **MUST** include these stories:

1. **Playground** - Interactive story with all controls (NO mobile viewport wrapper)
2. **All States/Variations** - Visual showcase of all variants (NO mobile viewport wrapper)
3. **In Context** - Show component in realistic mobile UI contexts with other lit-components (lit-button, lit-icon, lit-toggle, etc.) wrapped in `<lit-mobile-viewport>`

**IMPORTANT:** Only the "In Context" story should use `<lit-mobile-viewport>`. The Playground and All States stories should NOT use the mobile viewport wrapper.

**NOTE:** ❌ **NO Accessibility stories needed** - Mobile components have accessibility built-in (ARIA attributes, keyboard support, touch targets). Accessibility features should be documented in the component JSDoc, not in separate stories.

### Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./lit-component-name";
import "./lit-mobile-viewport"; // Mobile viewport wrapper
import "./lit-button"; // Import other components for composition
import "./lit-icon"; // Import supporting components

const meta: Meta = {
  title: "Design System/ComponentName",
  component: "lit-component-name",
  tags: ["autodocs"],
  parameters: {
    layout: "centered", // Center stories on the page
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Component variant",
    },
  },
  args: {
    variant: "primary",
  },
};

export default meta;
type Story = StoryObj;

// 1. Interactive playground (NO mobile viewport)
export const Playground: Story = {
  render: (args) =>
    html` <lit-component-name variant="${args.variant}"></lit-component-name> `,
};

// 2. All variations (NO mobile viewport)
export const AllVariations: Story = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <lit-component-name variant="primary"></lit-component-name>
      <lit-component-name variant="secondary"></lit-component-name>
    </div>
  `,
};

// 3. In Context - Show component with other lit-components AND event handling (WITH mobile viewport)
export const InContext: Story = {
  render: () => {
    const handleToggle = (e: CustomEvent) => {
      console.log("Toggle changed:", e.detail);
    };

    const handleSave = () => {
      console.log("Settings saved!");
      alert("Settings saved successfully!");
    };

    return html`
      <lit-mobile-viewport width="small" background="white">
        <h3 class="text-lg font-semibold mb-4">Notification Settings</h3>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <lit-icon icon="mdi:bell-outline"></lit-icon>
            <lit-component-name></lit-component-name>
          </div>
          <lit-toggle checked @toggle-change=${handleToggle}></lit-toggle>
        </div>
        <lit-button variant="primary" size="medium" @click=${handleSave}>
          Save Changes
        </lit-button>
      </lit-mobile-viewport>
    `;
  },
};
```

### In Context Guidelines

The "In Context" story must show component composition with other lit-components AND event handling. **This is the ONLY story that should use `<lit-mobile-viewport>`:**

```typescript
export const InContext: Story = {
  render: () => {
    const handleToggle = (e: CustomEvent) => {
      console.log("Toggle changed:", e.detail);
    };

    const handleSave = () => {
      alert("Settings saved!");
    };

    return html`
      <lit-mobile-viewport width="small" background="white">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <lit-icon icon="mdi:bell-outline"></lit-icon>
            <span>Notifications</span>
          </div>
          <lit-toggle checked @toggle-change=${handleToggle}></lit-toggle>
        </div>
        <lit-button variant="primary" @click=${handleSave}>
          Save Changes
        </lit-button>
      </lit-mobile-viewport>
    `;
  },
};
```

### Styling in Stories

**Use Tailwind classes for layout. Only use `<lit-mobile-viewport>` in "In Context" stories:**

```typescript
// ✅ CORRECT - Playground & All States (NO mobile viewport)
export const AllStates: Story = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <lit-component variant="primary"></lit-component>
      <lit-component variant="secondary"></lit-component>
    </div>
  `,
};

// ✅ CORRECT - In Context (WITH mobile viewport)
export const InContext: Story = {
  render: () => html`
    <lit-mobile-viewport width="small" background="white">
      <div class="flex flex-col gap-4">
        <lit-component></lit-component>
        <lit-button>Action</lit-button>
      </div>
    </lit-mobile-viewport>
  `,
};

// ❌ WRONG - Inline styles
html`
  <div style="padding: 40px; background: #f5f7fa;">
    <lit-component></lit-component>
  </div>
`;
```

**Mobile viewport options (In Context story only):**

- `width`: `"small"` (375px) or `"large"` (428px)
- `background`: `"white"`, `"gray"`, or `"blue"`

**Common Tailwind patterns:**

```typescript
class="flex flex-col gap-4"        // Mobile layout
class="min-h-[44px] min-w-[44px]"  // Touch targets
class="text-lg font-semibold"      // Headings
```

---

## Styling Guidelines

### 🎨 Design System Colors

**Components use CSS variables. Stories use Tailwind classes.**

```typescript
// ✅ CORRECT - Component file
static styles = css`
  :host {
    --radio-border-rest: var(--color-secondary-200);
    --radio-bg-hover: var(--color-secondary-40);
  }
  .radio-circle {
    border-color: var(--radio-border-rest);
  }
`;

// ❌ WRONG - Hardcoded colors
static styles = css`
  .radio-circle {
    border-color: #94b4d4;  /* NEVER! */
  }
`;

// ❌ WRONG - Fallback values (STRICTLY FORBIDDEN)
static styles = css`
  .radio-circle {
    border-color: var(--color-secondary-200, #94b4d4);  /* NEVER USE FALLBACKS! */
    height: var(--button-size-md, 52px);  /* NEVER USE FALLBACKS! */
  }
`;

// ✅ CORRECT - No fallbacks, pure CSS variables
static styles = css`
  .radio-circle {
    border-color: var(--color-secondary-200);
    height: var(--button-size-md);
  }
`;
```

**⚠️ CRITICAL RULE: NO FALLBACK VALUES**

Fallback values break design system integrity. They create hidden hardcoded values that:

- Bypass design system updates
- Create inconsistencies across components
- Hide missing tokens that should be added to the design system

**If a CSS variable doesn't exist:**

1. Check `styles/tokens.css` to confirm it's missing
2. Add the token to `styles/tokens.css` with the correct value
3. Use the new token WITHOUT any fallback value

**Adding missing tokens:**

1. Check Figma design system
2. Add to `styles/tokens.css`
3. Document below

### Available Design Tokens

All design tokens are defined in `styles/tokens.css`.

**Primary Colors (Green palette)**

```css
--color-primary-100: #c8f0b4;
--color-primary-200: #beeba0;
--color-primary-300: #a0eb78;
--color-primary-400: #6ed22d;
--color-primary-500: #50b40a;
--color-primary-600: #328200;
--color-primary-700: #0f6446;
--color-primary-800: #0a412d;
--color-primary-900: #052819;
```

**Secondary Colors (Blue palette)**

```css
--color-secondary-20: #f5f7fa;
--color-secondary-40: #e6ecf3;
--color-secondary-80: #dee5ed;
--color-secondary-100: #b8cce0;
--color-secondary-200: #94b4d4;
--color-secondary-300: #698daf;
--color-secondary-400: #478cd1;
--color-secondary-500: #3473b2;
--color-secondary-800: #113e73;
```

**Neutral Colors (Grayscale)**

```css
--color-neutral-white: #ffffff;
--color-neutral-50: #e3e6e8;
--color-neutral-100: #c7ccd1;
--color-neutral-200: #a9b8c6;
--color-neutral-300: #73808c;
--color-neutral-500: #3d4d5c;
--color-neutral-black: #001f3d;
```

**System Colors (Functional)**

```css
--color-system-link: #0057da;
--color-system-alert: #eb5757;
--color-system-success: #4eb40c;
--color-system-comments: #5d00f4;
```

**Shadow tokens**

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 4px 16px rgba(0, 0, 0, 0.1);
```

**Overlay/Glass effect tokens (semi-transparent)** (from `tokens.css`)

```css
--overlay-white-10: rgba(255, 255, 255, 0.1);
--overlay-white-20: rgba(255, 255, 255, 0.2);
--overlay-white-30: rgba(255, 255, 255, 0.3);
--overlay-white-50: rgba(255, 255, 255, 0.5);
--overlay-black-10: rgba(0, 0, 0, 0.1);
--overlay-black-20: rgba(0, 0, 0, 0.2);
```

**Spacing & Layout tokens** (from `tokens.css`)

```css
/* Gap */
--gap: 12px;
--gap-4: 4px;
--gap-16: 16px;

/* Horizontal Padding */
--h-padding: 24px;
--h-padding-12: 12px;
--h-padding-16: 16px;
--h-padding-20: 20px;

/* Vertical Padding */
--v-padding-32: 32px;
--v-padding-36: 36px;

/* Border Radius */
--border-radius-sm: 8px;
--border-radius-md: 12px;
--border-radius-lg: 16px;
--border-radius-full: 9999px;

/* Sizes */
--size: 52px;
--button-size-sm: 36px;
--button-size-md: 52px;
--button-size-lg: 60px;
--button-size-xxlg: 68px;

/* Line Height */
--line-height-body-sm: 20px;
--line-height-body-md: 28px;
```

### Creating Component-Specific Tokens

**Define semantic tokens in components using only design system variables:**

```typescript
// ✅ CORRECT - No fallbacks, semantic naming
static styles = css`
  :host {
    --button-bg: var(--color-primary-300);
    --button-bg-hover: var(--color-primary-400);
    --button-text: var(--color-neutral-black);

    background: var(--button-bg);
    color: var(--button-text);
  }

  :host(:hover) {
    background: var(--button-bg-hover);
  }
`;

// ❌ WRONG - Using fallback values (FORBIDDEN)
static styles = css`
  :host {
    --button-bg: var(--color-primary-300, #a0eb78);  /* NEVER! */
    background: var(--button-bg, #a0eb78);  /* NEVER! */
  }
`;
```

**Remember:** Component-specific tokens should map to design system tokens WITHOUT fallbacks. This maintains the single source of truth in `styles/tokens.css`.

---

## Testing & Accessibility

### Accessibility Checklist

Every interactive component **MUST** have:

✅ **ARIA attributes**: `role`, `aria-checked`, `aria-disabled`, `aria-label`

✅ **Keyboard support**: Space/Enter keys

✅ **Touch targets**: Minimum 44x44px

✅ **Focus indicators**: 2px outline with offset

✅ **Touch feedback**: Active state (opacity/scale)

✅ **Reduced motion**: `@media (prefers-reduced-motion: reduce)`

---

## Documentation Guidelines

### Component JSDoc

Include comprehensive JSDoc comments:

````typescript
/**
 * Brief component description
 *
 * Longer description with usage notes
 *
 * @element lit-component-name
 *
 * @slot - Default slot description
 * @slot icon - Named slot description
 *
 * @attr {string} variant - Attribute description with possible values
 * @attr {boolean} disabled - Boolean attribute description
 *
 * @fires event-name - When this event is fired and what data it contains
 *
 * @csspart part-name - What this part represents for styling
 *
 * @cssprop --property-name - CSS custom property description
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <lit-component-name></lit-component-name>
 *
 * <!-- Advanced usage -->
 * <lit-component-name variant="primary" disabled>
 *   Content here
 * </lit-component-name>
 * ```
 */
````

## Quick Reference Checklist

### 🎨 Design System

- [ ] Components use CSS variables from `styles/tokens.css` ONLY
- [ ] Stories use Tailwind classes ONLY
- [ ] Missing tokens added to `tokens.css`
- [ ] **NO fallback values** - checked with grep: `var\([^,)]+,` should return 0 matches
- [ ] All CSS variables use pure form: `var(--token-name)` not `var(--token-name, fallback)`

### 📁 Component Files

- [ ] Component file in `src/lib/`
- [ ] JSDoc documentation
- [ ] Exported in `src/index.ts`

### 📖 Storybook Stories

- [ ] Playground (interactive)
- [ ] All States/Variations (mobile viewport)
- [ ] In Context (with other lit-components)

### ♿ Accessibility & Mobile

- [ ] Touch targets ≥44x44px
- [ ] Touch interactions (tap, swipe)
- [ ] Active/pressed states for feedback
- [ ] ARIA attributes
- [ ] Keyboard support (Space, Enter)
- [ ] Focus indicators
- [ ] Reduced motion support
- [ ] Tested on 375px-428px viewports

---

## Common Patterns

### Event Handling

```typescript
// Dispatch custom events
this.dispatchEvent(
  new CustomEvent("component-change", {
    detail: { value: this.value },
    bubbles: true,
    composed: true,
  })
);

// Dispatch native events for forms
this.dispatchEvent(new Event("change", { bubbles: true }));
```

### Button + Icon Pattern

**When using buttons with icons, ALWAYS wrap text in `<span>` tags:**

```html
<!-- ✅ CORRECT - Text in span, icon stays at edge -->
<lit-button variant="primary" size="medium">
  <span>Next</span>
  <lit-icon icon="mdi:arrow-right"></lit-icon>
</lit-button>

<lit-button variant="secondary" size="medium">
  <lit-icon icon="mdi:arrow-left"></lit-icon>
  <span>Back</span>
</lit-button>

<!-- Icon-only button (no span needed) -->
<lit-button variant="primary" size="small">
  <lit-icon icon="mdi:plus"></lit-icon>
</lit-button>

<!-- ❌ WRONG - Text not wrapped -->
<lit-button variant="primary">
  Next
  <lit-icon icon="mdi:arrow-right"></lit-icon>
</lit-button>
```

**Why?** The button component uses flexbox with `space-between` to position icons at edges. Text wrapped in `<span>` with `flex: 1` fills the space and centers itself, while icons stay pinned to left/right edges.

### Form Integration

```typescript
@property({ type: String }) name = '';
@property({ type: String }) value = '';

render() {
  return html`
    <input
      type="hidden"
      name=${this.name}
      value=${this.value}
    />
  `;
}
```

### Conditional Rendering

```typescript
render() {
  return html`
    ${this.loading ? html`<div class="spinner"></div>` : ''}
    ${this.variant === 'primary' ? html`<strong>Primary</strong>` : html`<span>Default</span>`}
  `;
}
```

---

## Resources

- [Lit Documentation](https://lit.dev/)
- [Web Components Best Practices](https://lit.dev/docs/components/best-practices/)
- [Storybook for Web Components](https://storybook.js.org/docs/web-components/get-started/introduction)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Last Updated:** November 18, 2025  
**Maintained by:** AI Agents working on ticketapp-Monorepo
