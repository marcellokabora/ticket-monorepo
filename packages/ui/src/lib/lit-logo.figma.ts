import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for lit-logo component
 * Links Figma design to lit-logo implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=369-54
 */

// Logo - Size variants (small, medium, large)
figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=369-54',
    {
        props: {
            size: figma.enum('Size', {
                Small: 'small',
                Medium: 'medium',
                Large: 'large',
            }),
        },
        example: ({ size }) => html`
      <lit-logo size="${size}"></lit-logo>
    `,
    }
);
