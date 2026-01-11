import figma, { html } from "@figma/code-connect/html"

/**
 * Figma Code Connect for Toggle Component
 * Links the Lit toggle component to the Figma design
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=131-477
 */

// Toggle - Parent component (all variants)
figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=131-477',
    {
        example: () => html`<lit-toggle></lit-toggle>`,
    }
);
