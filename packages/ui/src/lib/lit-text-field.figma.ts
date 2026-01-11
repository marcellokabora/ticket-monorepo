import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for TextField component
 * Links Figma design to lit-text-field implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=146-868
 */

// Text Field - Parent component (all variants)
figma.connect(
  'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=146-868',
  {
    props: {
      placeholder: figma.string('placeholder'),
      label: figma.string('label'),
      prefix: figma.string('prefix'),
      type: figma.enum('type', {
        'basic': 'basic',
        'phone-number': 'phone-number',
        'pin-number': 'pin-number',
      }),
    },
    example: ({ placeholder, label, prefix, type }) => html`
      <lit-text-field
        placeholder="${placeholder}"
        label="${label}"
        prefix="${prefix}"
        type="${type}">
      </lit-text-field>
    `,
  }
);
