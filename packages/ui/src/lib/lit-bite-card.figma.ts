import figma, { html } from '@figma/code-connect/html';

/**
 * Figma Code Connect for lit-bite-card component
 * Links Figma design to lit-bite-card implementation
 * 
 * Design file: https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=369-48
 */

figma.connect(
    'https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=369-48',
    {
        props: {
            background: figma.enum("Background", {
                White: "white",
                Light: "light",
            }),
            biteColor: figma.enum("Bite Color", {
                "Primary 800": "primary-800",
                "Primary 700": "primary-700",
                "Secondary 800": "secondary-800",
            }),
        },
        example: ({ background, biteColor }) => html`
      <lit-bite-card
        background="${background}"
        bite-color="${biteColor}">
        <slot></slot>
      </lit-bite-card>
    `,
    }
);
