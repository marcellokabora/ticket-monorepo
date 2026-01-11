import figma, { html } from "@figma/code-connect/html"

/**
 * Figma Code Connect for LitButton component
 * Maps the Figma button component to the lit-button web component
 */

figma.connect(
  "https://www.figma.com/design/rvRPrJEvNKe8RIa1WP0u6J/Design-System?node-id=60-117",
  {
    props: {
      variant: figma.enum("variant", {
        Outlined: "secondary",
        Filled: "primary",
      }),
      size: figma.enum("size", {
        Small: "small",
        Medium: "medium",
        Large: "large",
      }),
    },
    example: ({ variant, size }) => html`
      <lit-button
        variant="${variant}"
        size="${size}"
      >
        Menu
        <lit-icon name="menu"></lit-icon>
      </lit-button>
    `,
  },
)
