import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for TextArea component
 * Links Figma design to lit-text-area implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=341-191
 */

// Text Area - Parent component
figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=341-191',
    {
        props: {
            placeholder: figma.string('placeholder'),
            label: figma.string('label'),
            showPasteButton: figma.boolean('showPasteButton'),
            disabled: figma.boolean('disabled')
        },
        example: ({ placeholder, label, showPasteButton, disabled }) => html`
      <lit-text-area
        placeholder="${placeholder}"
        label="${label}"
        ?showPasteButton="${showPasteButton}"
        ?disabled="${disabled}">
      </lit-text-area>
    `,
    }
);
