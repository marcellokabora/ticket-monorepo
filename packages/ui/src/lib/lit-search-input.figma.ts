import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for Search Input component
 * Links Figma design to lit-search-input implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=165-288
 */

// Search Input - Parent component (all variants)
figma.connect(
  'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=165-288',
  {
    props: {
      size: figma.enum('size', {
        'large': 'large',
        'medium': 'medium',
      }),
      placeholder: figma.string('placeholder'),
    },
    example: ({ size, placeholder }) => html`
      <lit-search-input 
        size="${size}"
        placeholder="${placeholder}">
      </lit-search-input>
    `,
  }
);
