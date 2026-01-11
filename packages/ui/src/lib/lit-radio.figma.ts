import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for Radio Component
 * Links the Figma design to the lit-radio implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=132-504
 */

// Radio - Parent component (all variants)
figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=132-504',
    {
        example: () => html`<lit-radio name="radio-group" value="option"></lit-radio>`,
    }
);