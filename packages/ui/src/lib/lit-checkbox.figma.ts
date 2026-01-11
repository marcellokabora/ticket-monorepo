import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for Checkbox Component
 * Links the Figma design to the lit-checkbox implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=132-517
 */

// Checkbox - Parent component (all variants)
figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=132-517',
    {
        example: () => html`<lit-checkbox></lit-checkbox>`,
    }
);
